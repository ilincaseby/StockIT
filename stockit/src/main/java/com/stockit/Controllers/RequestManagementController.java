package com.stockit.Controllers;

import com.stockit.classes.User;
import com.stockit.exceptionHandlerPackage.ForbiddenException;
import com.stockit.exceptionHandlerPackage.ResourceNotFoundException;
import com.stockit.payloads.RequestDevicePayload;
import com.stockit.services.RequestService;
import com.stockit.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requestManagement/v1")
@AllArgsConstructor
@EnableMethodSecurity
public class RequestManagementController {
    private final RequestService requestService;
    private final UserService userService;

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/getRequests")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getRequests() {
        List<RequestService. RecordRequest> list = requestService.getAllRequests();
        return ResponseEntity.ok(list);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/responseRequest/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> responseRequest(@PathVariable Long id, @RequestParam Boolean approved) {
        requestService.approveRequest(id, approved);
        return ResponseEntity.ok("Request " + (approved ? "approved" : "denied"));
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/requestDevice")
    public ResponseEntity<?> requestDevice(@RequestBody RequestDevicePayload requestDevicePayload) {
        String uid = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByUid(uid);
        if (user == null) {
            throw new ForbiddenException("Token provided is not valid");
        }
        requestService.addRequest(user, requestDevicePayload);
        return ResponseEntity.ok("Request added");
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/getMyRequests")
    public ResponseEntity<?> getMyRequests() {
        String uid = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByUid(uid);
        if (user == null) {
            throw new ForbiddenException("Token provided is not valid");
        }
        return ResponseEntity.ok(requestService.getMyRequests(user));
    }
}
