package com.Timperio.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.Timperio.constant.UrlConstant;
import com.Timperio.enums.ErrorMessage;
import com.Timperio.enums.Permission;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    private final ApplicationConfig applicationConfig;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${SERVER}")
    private String serverUrl;

    @Autowired
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, ApplicationConfig applicationConfig) {
        this.applicationConfig = applicationConfig;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        disableCsrf(http);

        configureAuthorization(http);

        configureExceptionHandling(http);

        configureSessionManagement(http);

        configureAuthentication(http);

        configureCors(http);

        return http.build();
    }

    private void disableCsrf(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable());
    }

    private void configureAuthorization(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(authorize -> authorize
                .requestMatchers(UrlConstant.API_VERSION + "/auth/login", "/v3/api-docs/**", "/swagger-ui/**")
                .permitAll()

                .requestMatchers(UrlConstant.API_VERSION + "/purchaseHistory")
                .hasAuthority(Permission.ACCESS_AND_FILTER_PURCHASE_HISTORY.toString())
                .requestMatchers(UrlConstant.API_VERSION + "/export")
                .hasAuthority(Permission.EXPORT_FILTERED_DATA.toString())
                .requestMatchers(UrlConstant.API_VERSION + "/customers/**")
                .hasAnyAuthority(Permission.VIEW_SALES_METRICS.toString(),
                        Permission.SEGMENT_CUSTOMERS_BY_SPENDING.toString())
                .requestMatchers(UrlConstant.API_VERSION + "/newsletter/**")
                .hasAnyAuthority(Permission.CREATE_AND_SEND_NEWSLETTER.toString(),
                        Permission.FORMAT_NEWSLETTER_TEMPLATE.toString())

                .anyRequest().authenticated());
    }

    private void configureExceptionHandling(HttpSecurity http) throws Exception {
        http.exceptionHandling(exceptionHandling -> exceptionHandling
                .accessDeniedHandler(customAccessDeniedHandler())
                .authenticationEntryPoint(customAuthenticationEntryPoint()));
    }

    private void configureSessionManagement(HttpSecurity http) throws Exception {
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
    }

    private void configureAuthentication(HttpSecurity http) throws Exception {
        http.authenticationProvider(applicationConfig.authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    }

    private void configureCors(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
    }

    private AuthenticationEntryPoint customAuthenticationEntryPoint() {
        return (request, response, authException) -> {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write(ErrorMessage.UNAUTHORIZED.getMessage());
        };
    }

    private AccessDeniedHandler customAccessDeniedHandler() {
        return (request, response, accessDeniedException) -> {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.getWriter().write(ErrorMessage.FORBIDDEN.getMessage());
        };
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(serverUrl));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

}
