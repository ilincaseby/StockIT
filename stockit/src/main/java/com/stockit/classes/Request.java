package com.stockit.classes;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "requests")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "device_id")
    private Device device;

    private String status;
    private int units;

    public Request(User user, Device device, int units) {
        this.user = user;
        this.device = device;
        this.status = "pending";
        this.units = units;
    }
}
