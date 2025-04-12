package com.stockit.classes;

import jakarta.persistence.*;
import jakarta.xml.soap.Detail;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToMany(mappedBy = "category")
    private List<Device> devices;

    private String name;

    public Category(String name) {
        this.devices = new ArrayList<>();
        this.name = name;
    }
}
