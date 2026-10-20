package br.com.fooddelivery;

import br.com.fooddelivery.application.dto.response.AuthResponse;
import br.com.fooddelivery.application.dto.request.LoginRequest;
import br.com.fooddelivery.application.dto.request.RegisterRequest;
import br.com.fooddelivery.application.service.AuthService;
import br.com.fooddelivery.config.JwtService;
import br.com.fooddelivery.domain.model.User;
import br.com.fooddelivery.domain.repository.UserRepository;
import br.com.fooddelivery.infrastructure.exception.InvalidCredentialsException;
import br.com.fooddelivery.infrastructure.exception.UserAlreadyExistsException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void register_ShouldReturnUser_WhenValidRequest() {
        RegisterRequest request = new RegisterRequest("John Doe", "john@example.com", "password123");
        User savedUser = new User(1L, "John Doe", "john@example.com", "hashedPassword", null);

        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hashedPassword");
        when(userRepository.save(any())).thenReturn(savedUser);
        when(jwtService.generateToken(any(), any())).thenReturn("jwt-token");

        User response = authService.register(request);

        assertNotNull(response);
        assertEquals("John Doe", response.getName());
        assertEquals("john@example.com", response.getEmail());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_ShouldThrowException_WhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest("John Doe", "john@example.com", "password123");

        when(userRepository.existsByEmail(any())).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_ShouldReturnToken_WhenValidCredentials() {
        LoginRequest request = new LoginRequest("john@example.com", "password123");
        User user = new User(1L, "John Doe", "john@example.com", "hashedPassword", null);

        when(userRepository.findByEmail(any())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(any(), any())).thenReturn(true);
        when(jwtService.generateToken(any(), any())).thenReturn("jwt-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
    }

    @Test
    void login_ShouldThrowException_WhenInvalidEmail() {
        LoginRequest request = new LoginRequest("john@example.com", "password123");

        when(userRepository.findByEmail(any())).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request));
    }

    @Test
    void login_ShouldThrowException_WhenInvalidPassword() {
        LoginRequest request = new LoginRequest("john@example.com", "wrongpassword");
        User user = new User(1L, "John Doe", "john@example.com", "hashedPassword", null);

        when(userRepository.findByEmail(any())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(any(), any())).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request));
    }
}
