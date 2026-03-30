package com.tothenew.journalApp.controller;

//import lombok.Value;
import com.tothenew.journalApp.entity.User;
import com.tothenew.journalApp.repository.UserRepository;
import com.tothenew.journalApp.service.UserDetailsServiceImpl;
import com.tothenew.journalApp.utils.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/auth/google")
public class GoogleAuthController {

    private static final String STATE_COOKIE_NAME = "google_oauth_state";

    @Value("${spring.security.oauth2.client.registration.google.client-id:}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret:}")
    private String clientSecret;

    @Value("${app.oauth.google.redirect-uri:http://localhost:8081/auth/google/callback}")
    private String redirectUri;

    @Value("${app.oauth.google.frontend-redirect-uri:}")
    private String frontendRedirectUri;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/url")
    public ResponseEntity<?> getGoogleAuthUrl() {
        if (clientId == null || clientId.isBlank() || clientSecret == null || clientSecret.isBlank()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Google OAuth is not configured (missing client-id/client-secret)");
        }

        String state = UUID.randomUUID().toString();
        String authUrl = UriComponentsBuilder
                .fromHttpUrl("https://accounts.google.com/o/oauth2/v2/auth")
                .queryParam("client_id", clientId)
                .queryParam("redirect_uri", redirectUri)
                .queryParam("response_type", "code")
                .queryParam("scope", "openid email profile")
                .queryParam("access_type", "offline")
                .queryParam("include_granted_scopes", "true")
                .queryParam("prompt", "consent")
                .queryParam("state", state)
                .build()
                .toUriString();

        ResponseCookie cookie = ResponseCookie.from(STATE_COOKIE_NAME, state)
                .httpOnly(true)
                .secure(false)
                .path("/auth/google")
                .sameSite("Lax")
                .maxAge(300)
                .build();

        Map<String, String> body = new HashMap<>();
        body.put("url", authUrl);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(body);
    }

    @GetMapping("/callback")
    public ResponseEntity<?> handleGoogleCallback(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String error,
            @RequestParam(required = false, name = "error_description") String errorDescription,
            HttpServletRequest servletRequest
    )
    {
        try{
            if (error != null && !error.isBlank()) {
                String msg = "Google OAuth error: " + error + (errorDescription != null ? (" - " + errorDescription) : "");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(msg);
            }
            if (code == null || code.isBlank()) {
                return ResponseEntity.badRequest().body("Missing authorization code");
            }
            if (!isValidState(servletRequest, state)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid OAuth state");
            }

            String tokenEndPoint = "https://oauth2.googleapis.com/token";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("code", code);
            params.add("client_id", clientId);
            params.add("client_secret", clientSecret);
            params.add("redirect_uri", redirectUri);
            params.add("grant_type", "authorization_code");

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
            ResponseEntity<Map<String, Object>> tokenResponse;
            try {
                tokenResponse = restTemplate.exchange(
                        tokenEndPoint,
                        HttpMethod.POST,
                        request,
                        new ParameterizedTypeReference<Map<String, Object>>() {}
                );
            } catch (HttpClientErrorException e) {
                log.warn("Google token exchange failed: {}", e.getStatusCode());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Failed to exchange code for token");
            }
            if (!tokenResponse.getStatusCode().is2xxSuccessful() || tokenResponse.getBody() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Failed to exchange code for token");
            }
            Map<String, Object> tokenBody = tokenResponse.getBody();
            String idToken = (String) tokenBody.get("id_token");
            String accessToken = (String) tokenBody.get("access_token");

            // Prefer userinfo endpoint with access_token; fallback to tokeninfo with id_token
            String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
            HttpHeaders authHeaders = new HttpHeaders();
            authHeaders.setBearerAuth(accessToken);
            ResponseEntity<Map<String, Object>> userInfoResponse;
            try {
                userInfoResponse = restTemplate.exchange(
                        userInfoUrl,
                        HttpMethod.GET,
                        new HttpEntity<>(authHeaders),
                        new ParameterizedTypeReference<Map<String, Object>>() {}
                );
            } catch (HttpClientErrorException e) {
                userInfoResponse = ResponseEntity.status(e.getStatusCode()).build();
            }
            if (!userInfoResponse.getStatusCode().is2xxSuccessful() || userInfoResponse.getBody() == null) {
                // fallback to tokeninfo using id_token
                String tokenInfoUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
                try {
                    userInfoResponse = restTemplate.exchange(
                            tokenInfoUrl,
                            HttpMethod.GET,
                            HttpEntity.EMPTY,
                            new ParameterizedTypeReference<Map<String, Object>>() {}
                    );
                } catch (HttpClientErrorException e) {
                    userInfoResponse = ResponseEntity.status(e.getStatusCode()).build();
                }
            }
            if(userInfoResponse.getStatusCode() == HttpStatus.OK && userInfoResponse.getBody() != null)
            {
                Map<String, Object> usrInfo = userInfoResponse.getBody();
                String email = (String) usrInfo.get("email");
                if (email == null || email.isBlank()) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No email in Google response");
                }

                UserDetails userDetails;
                try {
                    userDetails = userDetailsService.loadUserByUsername(email);
                } catch (UsernameNotFoundException ex) {
                    User user = new User();
                    user.setEmail(email);
                    user.setUserName(email);
                    user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                    user.setRoles(Arrays.asList("USER"));
                    userRepository.save(user);
                    userDetails = userDetailsService.loadUserByUsername(email);
                }

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);

                String jwt = jwtUtil.generateToken(userDetails.getUsername());
                Map<String, String> responseBody = new HashMap<>();
                responseBody.put("token", jwt);
                responseBody.put("username", userDetails.getUsername());

                ResponseCookie clearCookie = ResponseCookie.from(STATE_COOKIE_NAME, "")
                        .httpOnly(true)
                        .secure(false)
                        .path("/auth/google")
                        .sameSite("Lax")
                        .maxAge(0)
                        .build();

                if (frontendRedirectUri != null && !frontendRedirectUri.isBlank()) {
                    String redirect = UriComponentsBuilder.fromUriString(frontendRedirectUri)
                            .queryParam("token", jwt)
                            .queryParam("username", userDetails.getUsername())
                            .build(true)
                            .toUriString();
                    return ResponseEntity.status(HttpStatus.FOUND)
                            .header(HttpHeaders.LOCATION, redirect)
                            .header(HttpHeaders.SET_COOKIE, clearCookie.toString())
                            .build();
                }

                return ResponseEntity.ok()
                        .header(HttpHeaders.SET_COOKIE, clearCookie.toString())
                        .body(responseBody);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Failed to fetch user info from Google");

        }
        catch(Exception e)
        {
            log.error("Exception occurred while handleGoogleCallback", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal error");
        }
    }

    private boolean isValidState(HttpServletRequest request, String state) {
        if (state == null || state.isBlank()) return false;
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return false;
        for (Cookie cookie : cookies) {
            if (STATE_COOKIE_NAME.equals(cookie.getName())) {
                return state.equals(cookie.getValue());
            }
        }
        return false;
    }
}
