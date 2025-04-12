package com.stockit.payloads;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class SignInPayload {
    @NotBlank
    private String email;
    @NotBlank
    private String password;
    Map<String, Object> dataForJwt;
}
