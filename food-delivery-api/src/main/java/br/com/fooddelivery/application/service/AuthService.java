package br.com.fooddelivery.application.service;

import br.com.fooddelivery.application.dto.response.AuthResponse;
import br.com.fooddelivery.application.dto.request.LoginRequest;
import br.com.fooddelivery.application.dto.request.RegisterRequest;
import br.com.fooddelivery.config.JwtService;
import br.com.fooddelivery.domain.model.User;
import br.com.fooddelivery.domain.repository.UserRepository;
import br.com.fooddelivery.infrastructure.exception.InvalidCredentialsException;
import br.com.fooddelivery.infrastructure.exception.UserAlreadyExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Já existe um usuário cadastrado com este e-mail");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);

        return savedUser;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Credenciais inválidas"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Credenciais inválidas");
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail());
        return new AuthResponse(token);
    }
}
