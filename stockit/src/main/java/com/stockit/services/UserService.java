package com.stockit.services;

import com.stockit.classes.Role;
import com.stockit.classes.User;
import com.stockit.exceptionHandlerPackage.BadRequestException;
import com.stockit.exceptionHandlerPackage.ConflictException;
import com.stockit.exceptionHandlerPackage.Errors;
import com.stockit.payloads.SignUpPayload;
import com.stockit.repositories.UserRepository;
import com.stockit.security.SuperTokensAPI;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final SuperTokensAPI superTokensAPI;
    public User getUserByUid(String uid) {
        return userRepository.findByUid(uid).orElse(null);
    }
    public void createUser(SignUpPayload signUpPayload, Role role) throws IOException {
        if (userRepository.existsByUsernameOrEmail(signUpPayload.getUsername(), signUpPayload.getEmail())) {
            throw new ConflictException("Username or email already exists");
        }
        Map<String, String> resultSuperTokens = superTokensAPI.signInUp(signUpPayload.getEmail(), signUpPayload.getPassword(), "up");
        if (!resultSuperTokens.containsKey("userId")) {
            if (resultSuperTokens.containsKey("error")) {
                throw  new BadRequestException(resultSuperTokens.get("error"));
            }
            throw new BadRequestException(resultSuperTokens.get("status"));
        }
        String uid = resultSuperTokens.get("userId");
        User user = new User(role, signUpPayload.getFirstName(), signUpPayload.getEmail(),
                signUpPayload.getPassword(), signUpPayload.getUsername(), signUpPayload
                .getLastName(), uid);
        userRepository.save(user);
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public List<String> adminEmails() {
        List<String> emails = new ArrayList<>();
        List<User> users = userRepository.findAll();
        for (User user : users) {
            if (user.getRole().getName().equals("admin")) {
                emails.add(user.getEmail());
            }
        }
        return emails;
    }
}
