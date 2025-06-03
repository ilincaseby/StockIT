package com.stockit.Controllers;

import com.stockit.exceptionHandlerPackage.ConflictException;
import com.stockit.exceptionHandlerPackage.Errors;
import com.stockit.exceptionHandlerPackage.ResourceNotFoundException;
import com.stockit.payloads.DeviceAddPayload;
import com.stockit.services.CategoryService;
import com.stockit.services.DeviceService;
import com.stockit.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/deviceManagement/v1")
@EnableMethodSecurity
public class DeviceManagementController {
    private final DeviceService deviceService;
    private final CategoryService categoryService;
    private final UserService userService;

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/addDevice")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> addDevice(@RequestBody DeviceAddPayload deviceAddPayload) {
        Boolean added = deviceService.addDevice(deviceAddPayload);
        if (!added) {
            throw new ConflictException("Device already exists");
        }
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @DeleteMapping("/deleteDevice/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteDevice(@PathVariable Long id) {
        Boolean deleted = deviceService.deleteDevice(id);
        if (!deleted) {
            throw new ResourceNotFoundException("Device not found");
        }
        return ResponseEntity.ok().build();
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/addStock/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> addStock(@PathVariable Long id, @RequestParam Long stock) {
        Boolean added = deviceService.addStock(id, stock);
        if (!added) {
            throw new ResourceNotFoundException("Stock already exists");
        }
        return ResponseEntity.ok().build();
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/addShop/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> addShop(@PathVariable Long id, @RequestParam String shop) {
        Errors errors = deviceService.addShop(id, shop);
        if (errors == null) {
            return ResponseEntity.ok().build();
        }
        if (errors.equals(Errors.CONFLICT)) {
            throw new ConflictException("Shop already exists for the device");
        }
        throw new ResourceNotFoundException("Device not found");
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @DeleteMapping("/deleteShop/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteShop(@PathVariable Long id, @RequestParam String shop) {
        Errors errors = deviceService.deleteShop(id, shop);
        if (errors == null) {
            return ResponseEntity.ok().build();
        }
        if (errors.equals(Errors.NOT_FOUND)) {
            throw new ResourceNotFoundException("Device not found");
        }
        throw new ResourceNotFoundException("Shop not found");
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/getStock/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getStock(@PathVariable Long id) {
        Long stock = deviceService.getStock(id);
        if (stock == null) {
            throw new ResourceNotFoundException("Device not found");
        }
        System.out.println("stock is: " + stock);
        return ResponseEntity.ok(stock.longValue());
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/getAllDevices")
    public ResponseEntity<?> getAllDevices() {
        return ResponseEntity.ok(deviceService.getAllDevices());
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/getCategories")
    public ResponseEntity<?> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllResponse());
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/getDevicesByCategory")
    public ResponseEntity<?> getAllDevicesByCategory(@RequestParam String category) {
        return ResponseEntity.ok(deviceService.getDevicesByCategory(category));
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/getDeviceDetails/{id}")
    public ResponseEntity<?> getDeviceDetails(@PathVariable Long id) {
        DeviceService.RecordDevice device = deviceService.getDeviceDetails(id);
        if (device == null) {
            throw new ResourceNotFoundException("Device not found");
        }
        return ResponseEntity.ok(device);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/getAvailable/Shops/{id}")
    public ResponseEntity<?> getAvailableShops(@PathVariable Long id) {
        List<String> ans = deviceService.getAvailableShops(id);
        if (ans == null) {
            throw new ResourceNotFoundException("Device not found");
        }
        return ResponseEntity.ok(ans);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/getDeviceByName")
    public ResponseEntity<?> getDeviceByName(@RequestParam String deviceName) {
        DeviceService.RecordDevice device = deviceService.getDeviceByName(deviceName);
        if (device == null) {
            throw new ResourceNotFoundException("Device not found");
        }
        return ResponseEntity.ok(device);
    }
}
