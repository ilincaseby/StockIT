package com.stockit.Controllers;

import com.stockit.classes.Role;
import com.stockit.classes.User;
import com.stockit.exceptionHandlerPackage.BadRequestException;
import com.stockit.exceptionHandlerPackage.ResourceNotFoundException;
import com.stockit.payloads.FeedbackPayload;
import com.stockit.payloads.SignInPayload;
import com.stockit.payloads.SignUpPayload;
import com.stockit.security.SecurityConfig;
import com.stockit.security.SuperTokensAPI;
import com.stockit.services.EmailService;
import com.stockit.services.RoleService;
import com.stockit.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/v1")
@AllArgsConstructor
public class AuthController {
    private final RoleService roleService;
    private final UserService userService;
    private final SuperTokensAPI superTokensAPI;
    private final EmailService emailService;

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody SignUpPayload signUpPayload) throws IOException {
        Role role = roleService.createOrFindRole(signUpPayload.getRole());
        if (role == null) {
            throw new BadRequestException("Role could not be created");
        }
        userService.createUser(signUpPayload, role);
        return ResponseEntity.status(201).body("User has been created");
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/sendFeedback")
    public ResponseEntity<?> sendFeedback(@RequestBody FeedbackPayload feedbackPayload) throws IOException {
        List<String> emails=userService.adminEmails();
        for (String email : emails) {
            emailService.sendEmail(email, "Feedback", feedbackPayload.getFeedback());
        }
        return ResponseEntity.status(200).body("Feedback has been sent");
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody SignInPayload signInPayload) throws IOException {
        Map<String, String> resultSuperTokens = superTokensAPI.getJWT(signInPayload.getEmail(),
                signInPayload.getPassword(), signInPayload.getDataForJwt());
        if (!resultSuperTokens.containsKey("accessToken")) {
            if (resultSuperTokens.containsKey("error")) {
                throw new BadRequestException(resultSuperTokens.get("error"));
            }
            throw new BadRequestException(resultSuperTokens.get("status"));
        }
        User user = userService.findUserByEmail(signInPayload.getEmail());
        if (user == null) {
            throw new ResourceNotFoundException("User with email " + signInPayload.getEmail() + " not found, even if the signin was successfull in first phase");
        }
        resultSuperTokens.put("role", user.getRole().getName().toString());
        return ResponseEntity.ok(resultSuperTokens);
//        ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken",
//                        resultSuperTokens.get("accessToken"))
//                .maxAge(Duration.ofSeconds(Long.parseLong(resultSuperTokens.get("expiry"))
//                        - Long.parseLong(resultSuperTokens.get("createdTime"))))
//                .build();
//        Map<String, Long> body = new HashMap<>();
//        body.put("createdTime", Long.parseLong(resultSuperTokens.get("createdTime")));
//        body.put("expiry", Long.parseLong(resultSuperTokens.get("expiry")));
//        ResponseEntity<?> response = ResponseEntity.ok()
//                .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
//                .body(body);
//        return response;
    }
}
