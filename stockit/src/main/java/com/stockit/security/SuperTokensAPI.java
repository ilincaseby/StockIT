package com.stockit.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

@AllArgsConstructor
@Getter
@Setter
@Component
public class SuperTokensAPI {
    private static final String url_prefix = "http://localhost:3567/appid-public/";
    public Map<String, String> signInUp(String email, String password, String inUp) throws IOException {
        Map<String, String> result = new HashMap<>();
        ObjectMapper mapper = new ObjectMapper();
        String jsonInString = mapper.writeValueAsString(Map.of("email", email, "password", password));
        connect(url_prefix.concat("public/recipe/sign").concat(inUp), Map.of("rid", "emailpassword"),
                jsonInString, "POST",
                result, 0);
        return result;
    }

    public Map<String, String> getJWT(String email, String password, Map<String, Object> dataForJWT) throws IOException {
        Map<String, String> userIdMap = this.signInUp(email, password, "in");
        if (userIdMap.containsKey("error") || userIdMap.containsKey("status")) {
            return userIdMap;
        }
        String userId = userIdMap.get("userId");
        Map<String, String> result = new HashMap<>();
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode node = mapper.createObjectNode();
        node.put("userId", userId);
        node.put("enableAntiCsrf", false);
        node.put("useDynamicSigningKey", false);
        ObjectNode jwtData = mapper.createObjectNode();
        if (dataForJWT != null && !dataForJWT.isEmpty()) {

            for (Map.Entry<String, Object> entry : dataForJWT.entrySet()) {
                jwtData.put(entry.getKey(), entry.getValue().toString());
            }

        }
        node.put("userDataInJWT", jwtData);
        node.put("userDataInDatabase", mapper.createObjectNode());
        connect(url_prefix.concat("public/recipe/session"), Map.of("rid", "session"),
                node.toString(), "POST", result, 1);
        return result;
    }

    public Map<String, String> verifyJWT(String jwt) throws IOException {
        Map<String, String> result = new HashMap<>();
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode node = mapper.createObjectNode();
        node.put("accessToken", jwt);
        node.put("enableAntiCsrf", false);
        node.put("doAntiCsrfCheck", false);
        node.put("checkDatabase", false);
        connect(url_prefix.concat("public/recipe/session/verify"), Map.of("rid", "session"),
                node.toString(), "POST", result, 2);
        return result;
    }

    private void connect(String url, Map<String, String> headers,
                         String bodyInString, String method,
                         Map<String, String> result, int auth) throws IOException {
        URL obj = new URL(url);
        HttpURLConnection connection = (HttpURLConnection) obj.openConnection();
        connection.setRequestMethod(method);
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestProperty("cdi-version", "5.1");
        connection.setRequestProperty("x-api-key", "abracadabra");
        for (Map.Entry<String, String> header : headers.entrySet()) {
            connection.setRequestProperty(header.getKey(), header.getValue());
        }
        connection.setDoOutput(true);
        ObjectMapper mapper = new ObjectMapper();
        try (OutputStream os = connection.getOutputStream()) {
            byte[] input = bodyInString.getBytes();
            os.write(input, 0, input.length);
        }
        int responseCode = connection.getResponseCode();
        String response;
        try (InputStream is = connection.getInputStream();
             BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {

            StringBuilder responseBuilder = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                responseBuilder.append(line).append("\n");
            }
            response = responseBuilder.toString();
        }
        if (responseCode != HttpURLConnection.HTTP_OK) {
            result.put("error", response);
        }

        if (responseCode == HttpURLConnection.HTTP_OK) {

            JsonNode jsonNode = mapper.readTree(response);
            if (jsonNode.get("status").asText().equals("OK")) {
                if (auth == 0) {
                    authDetails(jsonNode, result);
                } else if (auth == 1) {
                    sessionCreateDetails(jsonNode, result);
                } else if (auth == 2) {
                    getJwtDetails(jsonNode, result);
                }
                return;
            }
            result.put("status", jsonNode.get("status").asText());
        }

    }

    private void authDetails(JsonNode node, Map<String, String> result) {
        result.put("userId", node.get("user").get("id").asText());
    }

    private void getJwtDetails(JsonNode node, Map<String, String> result) {
        result.put("userId", node.get("session").get("userId").asText());
        if (node.get("session").get("userDataInJWT") != null) {
        result.put("userDataInJWT", node.get("session").get("userDataInJWT").asText());
        }
    }

    private void sessionCreateDetails(JsonNode node, Map<String, String> result) {
        result.put("accessToken", node.get("accessToken").get("token").asText());
        result.put("createdTime", node.get("accessToken").get("createdTime").asText());
        result.put("expiry", node.get("accessToken").get("expiry").asText());
    }
}
