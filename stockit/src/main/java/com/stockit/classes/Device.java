package com.stockit.classes;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "devices")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToMany(mappedBy = "devices")
    private List<Shop> shops;

    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL)
    private List<Request> requests;

    private String name;
    private Long stock;
    private String description;

    public Device(Category category, String description, String name) {
        this.requests = new ArrayList<>();
        this.shops = new ArrayList<>();
        this.category = category;
        this.description = description;
        this.name = name;
        this.stock = 0L;
    }
}
