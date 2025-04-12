package com.stockit.services;
import com.stockit.classes.Category;
import com.stockit.classes.Device;
import com.stockit.classes.Shop;
import com.stockit.exceptionHandlerPackage.Errors;
import com.stockit.payloads.DeviceAddPayload;
import com.stockit.repositories.DeviceRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@AllArgsConstructor
@Service
public class DeviceService {
    private final DeviceRepository deviceRepository;
    private final CategoryService categoryService;
    private final ShopService shopService;

    public static record RecordDevice(Long id, List<String> shops, String name, String description, Long stock) {}

    public Boolean addDevice(DeviceAddPayload deviceAddPayload) {
        if (deviceRepository.existsByName(deviceAddPayload.getName())) {
            return false;
        }
        Category category = categoryService.getCreateByName(deviceAddPayload.getCategory());
        Device device = new Device(category, deviceAddPayload.getDescription(), deviceAddPayload.getName());
        deviceRepository.save(device);
        return true;
    }

    public boolean deleteDevice(Long id) {
        if (deviceRepository.existsById(id)) {
            deviceRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Boolean addStock(Long id, Long stock) {
        Device device = deviceRepository.findById(id).orElse(null);
        if (device != null) {
            device.setStock(device.getStock() + stock);
            deviceRepository.save(device);
            return true;
        }
        return false;
    }

    public Errors addShop(Long id, String website) {
        Device device = deviceRepository.findById(id).orElse(null);
        if (device != null) {
            Shop shop = shopService.getCreateShop(website);
            if (device.getShops().stream().anyMatch(a -> a.getWebsite().equals(shop.getWebsite()))) {
                return Errors.CONFLICT;
            }
            device.getShops().add(shop);
            shop.getDevices().add(device);
            shopService.updateShop(shop);
            deviceRepository.save(device);
            return null;
        }
        return Errors.NOT_FOUND;
    }

    public Errors deleteShop(Long id, String website) {
        Device device = deviceRepository.findById(id).orElse(null);
        if (device != null) {
            Shop shop = shopService.getCreateShop(website);
            if (device.getShops().stream().noneMatch(a -> a.getWebsite().equals(shop.getWebsite()))) {
                return Errors.NOT_FOUND_SHOP_FOR_DEVICE;
            }
            device.getShops().removeIf(aux -> Objects.equals(aux.getId(), shop.getId()));
            shop.getDevices().removeIf(aux -> Objects.equals(aux.getId(), device.getId()));
            shopService.updateShop(shop);
            deviceRepository.save(device);
            return null;
        }
        return Errors.NOT_FOUND;
    }

    public Long getStock(Long id) {
        Device device = deviceRepository.findById(id).orElse(null);
        if (device != null) {
            return device.getStock();
        }
        return null;
    }

    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }



    public List<RecordDevice> getDevicesByCategory(String categoryName) {
        Category category = categoryService.getCreateByName(categoryName);
        List<Device> devices = deviceRepository.findAllByCategory(category);
        return devices.stream().map(a -> new RecordDevice(a.getId(), a.getShops().stream().map(b -> b.getWebsite()).toList(),
                a.getName(), a.getDescription(), a.getStock())).toList();
    }

    public RecordDevice getDeviceDetails(Long id) {
        Device device = deviceRepository.findById(id).orElse(null);
        if (device == null) {
            return null;
        }
        return new RecordDevice(device.getId(), device.getShops().stream().map(Shop::getWebsite).toList(), device.getName(), device.getDescription(), device.getStock());
    }

    public List<String> getAvailableShops(Long id) {
        Device device = deviceRepository.findById(id).orElse(null);
        if (device == null) {
            return null;
        }
        return device.getShops().stream().map(Shop::getWebsite).toList();
    }

    public RecordDevice getDeviceByName(String name) {
        Device device = deviceRepository.findByName(name).orElse(null);
        if (device == null) {
            return null;
        }
        return getDeviceDetails(device.getId());
    }

    public Device getDeviceById(Long id) {
        return deviceRepository.findById(id).orElse(null);
    }

    public void saveDevice(Device device) {
        deviceRepository.save(device);
    }
}
