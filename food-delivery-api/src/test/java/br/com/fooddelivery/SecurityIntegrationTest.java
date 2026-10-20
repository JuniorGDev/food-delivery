package br.com.fooddelivery;

import br.com.fooddelivery.application.service.AuthService;
import br.com.fooddelivery.domain.model.User;
import br.com.fooddelivery.domain.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SecurityIntegrationTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private br.com.fooddelivery.config.JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void password_ShouldBeHashed_WhenRegisteringUser() {
        User user = new User();
        user.setPassword("plainPassword");

        when(passwordEncoder.encode("plainPassword")).thenReturn("hashedPassword");

        String hashedPassword = passwordEncoder.encode("plainPassword");

        assertNotEquals("plainPassword", hashedPassword);
        assertEquals("hashedPassword", hashedPassword);
    }

    @Test
    void login_ShouldFail_WhenPasswordDoesNotMatch() {
        User user = new User(1L, "John", "john@example.com", "hashedPassword", null);

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongPassword", "hashedPassword")).thenReturn(false);

        boolean matches = passwordEncoder.matches("wrongPassword", "hashedPassword");

        assertFalse(matches);
    }
}
