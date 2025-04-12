package com.stockit.classes;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Request> requests;

    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String password;
    private String uid;

    public User(Role role, String firstName,
                String email, String password, String username, String lastName,
                String uid) {
        this.role = role;
        this.requests = new ArrayList<>();
        this.firstName = firstName;
        this.email = email;
        this.password = password;
        this.username = username;
        this.lastName = lastName;
        this.uid = uid;
    }
}
