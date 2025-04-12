package com.stockit.Controllers;

import com.stockit.classes.Role;
import com.stockit.exceptionHandlerPackage.BadRequestException;
import com.stockit.payloads.SignInPayload;
import com.stockit.payloads.SignUpPayload;
import com.stockit.security.SuperTokensAPI;
import com.stockit.services.RoleService;
import com.stockit.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/v1")
@AllArgsConstructor
public class AuthController {
    private final RoleService roleService;
    private final UserService userService;
    private final SuperTokensAPI superTokensAPI;

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody SignUpPayload signUpPayload) throws IOException {
        Role role = roleService.createOrFindRole(signUpPayload.getRole());
        if (role == null) {
            throw new BadRequestException("Role could not be created");
        }
        userService.createUser(signUpPayload, role);
        return ResponseEntity.status(201).body("User has been created");
    }

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
        ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken",
                        resultSuperTokens.get("accessToken"))
                .maxAge(Duration.ofSeconds(Long.parseLong(resultSuperTokens.get("expiry"))
                        - Long.parseLong(resultSuperTokens.get("createdTime"))))
                .build();
        Map<String, Long> body = new HashMap<>();
        body.put("createdTime", Long.parseLong(resultSuperTokens.get("createdTime")));
        body.put("expiry", Long.parseLong(resultSuperTokens.get("expiry")));
        ResponseEntity<?> response = ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
                .body(body);
        return response;
    }
}
