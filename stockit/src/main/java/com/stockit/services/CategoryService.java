package com.stockit.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.stockit.classes.Category;
import com.stockit.repositories.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class CategoryService {
    private CategoryRepository categoryRepository;

    public Category getCreateByName(String name) {
        if (!categoryRepository.existsByName(name)) {
            return categoryRepository.save(new Category(name));
        }
        return categoryRepository.findByName(name).orElse(null);
    }

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public List<String> getAllResponse() {
        return getAll().stream()
                .map(Category::getName)
                .toList();
    }
}
