package com.stockit.services;

import com.stockit.classes.Device;
import com.stockit.classes.Request;
import com.stockit.classes.User;
import com.stockit.exceptionHandlerPackage.BadRequestException;
import com.stockit.exceptionHandlerPackage.ResourceNotFoundException;
import com.stockit.payloads.RequestDevicePayload;
import com.stockit.repositories.RequestRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class RequestService {
    private final RequestRepository requestRepository;
    private final DeviceService deviceService;
    private final UserService userService;

    public static record RecordRequest(String username, String firstName, String lastName,
                                       String deviceName, Long deviceId, Long requestId, int units, String status) {}

    public List<RecordRequest> getAllRequests() {
        return requestRepository.findAll().stream().map(a -> new RecordRequest(a.getUser().getUsername(), a.getUser().getFirstName(),
                a.getUser().getLastName(), a.getDevice().getName(), a.getDevice().getId(), a.getId(), a.getUnits(), a.getStatus())).toList();
    }

    public void approveRequest(Long id, Boolean approved) throws RuntimeException {
        if (requestRepository.existsById(id)) {
            Request request = requestRepository.findById(id).orElse(null);
            if (request != null && request.getStatus().equals("pending")) {
                if (!approved) {
                    request.setStatus("denied");
                } else {
                    if (request.getUnits() <= request.getDevice().getStock()) {
                        request.setStatus("approved");
                        request.getDevice().setStock(request.getDevice().getStock() - request.getUnits());
                    } else {
                        throw new BadRequestException("You are not allowed to approve " +
                                "this request, due to reduced stock");
                    }
                }
                request.setStatus(approved ? "approved" : "denied");
                requestRepository.save(request);
                return;
            }
            throw new BadRequestException("Request with id " + id + " already " +
                    "approved or denied");
        }
        throw new ResourceNotFoundException("Request with id " + id + " not found");
    }

    public void addRequest(User user, RequestDevicePayload requestDevicePayload) throws RuntimeException {
        Device device = deviceService.getDeviceById(requestDevicePayload.getDeviceId());
        if (device == null) {
            throw new ResourceNotFoundException("Device with id " + requestDevicePayload.getDeviceId() + " does not exist");
        }
        Request request = new Request(user, device, requestDevicePayload.getUnits());
        requestRepository.save(request);
        device.getRequests().add(request);
        deviceService.saveDevice(device);
        user.getRequests().add(request);
        userService.saveUser(user);
    }

    public List<RecordRequest> getMyRequests(User user) {
        return user.getRequests().stream().map(a -> new RecordRequest(a.getUser().getUsername(), a.getUser().getFirstName(),
                a.getUser().getLastName(), a.getDevice().getName(), a.getDevice().getId(), a.getId(), a.getUnits(), a.getStatus())).toList();
    }
}
