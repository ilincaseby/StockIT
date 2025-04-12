package com.stockit.security;

import com.stockit.classes.User;
import com.stockit.services.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
@AllArgsConstructor
public class SecurityFilter extends OncePerRequestFilter {
    private final SuperTokensAPI superTokensAPI;
    private final UserService userService;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authToken = request.getHeader("Authorization");
        if (authToken != null && authToken.startsWith("Bearer ")) {
            authToken = authToken.substring(7);
            Map<String, String> jwtAnswer = superTokensAPI.verifyJWT(authToken);
            if (jwtAnswer != null && jwtAnswer.containsKey("userId")) {
                User user = userService.getUserByUid(jwtAnswer.get("userId"));
                List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().getName().toUpperCase()));
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(jwtAnswer.get("userId"), null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }
}
