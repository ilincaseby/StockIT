package com.stockit.services;

import com.stockit.classes.Role;
import com.stockit.repositories.RoleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;

    public Role findByName(String name) {
        return roleRepository.findByName(name).orElse(null);
    }

    public Role createOrFindRole(String name) {
        Role role = findByName(name);
        if (role == null) {
            role = new Role(name);
            role = roleRepository.save(role);
        }
        return role;
    }
}
