package com.stockit.services;

import com.stockit.classes.Shop;
import com.stockit.repositories.ShopRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ShopService {
    private final ShopRepository shopRepository;

    public Shop getCreateShop(String website) {
        if (shopRepository.existsByWebsite(website)) {
            return shopRepository.findByWebsite(website).orElse(null);
        }
        Shop shop = new Shop(website);
        shop = shopRepository.save(shop);
        return shop;
    }

    public void updateShop(Shop shop) {
        shopRepository.save(shop);
    }
}
