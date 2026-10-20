package br.com.fooddelivery;

import br.com.fooddelivery.config.OpenApiConfig;
import br.com.fooddelivery.config.SecurityConfig;
import br.com.fooddelivery.infrastructure.security.JwtAuthenticationFilter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class SecurityEndpointTest {

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    void securityContext_ShouldLoadCorrectly() {
        assertNotNull(applicationContext.getBean(SecurityConfig.class));
        assertNotNull(applicationContext.getBean(JwtAuthenticationFilter.class));
        assertNotNull(applicationContext.getBean(PasswordEncoder.class));
        assertNotNull(applicationContext.getBean(OpenApiConfig.class));
    }
}
