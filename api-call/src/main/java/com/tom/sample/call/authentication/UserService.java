package com.tom.sample.call.authentication;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tom.sample.call.common.EntityUpdater;
import com.tom.sample.call.common.ServiceLogger;
import com.tom.sample.call.dto.requests.AuthenticationRequest;
import com.tom.sample.call.dto.requests.PasswordRequest;
import com.tom.sample.call.dto.requests.RegisterRequest;
import com.tom.sample.call.dto.requests.UpdateRequest;
import com.tom.sample.call.dto.response.AuthenticationResponse;
import com.tom.sample.call.dto.response.UserResponse;
import com.tom.sample.call.exception.AlreadyExistsException;
import com.tom.sample.call.exception.IllegalStatusException;
import com.tom.sample.call.exception.NotFoundException;
import com.tom.sample.call.security.JwtService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	// details the logs
	
	private final JwtService jwtService;
	private final AuthenticationMapper mapper;
	private final AuthenticationManager authManager;
	private final PasswordEncoder passwordEncoder;
	private final UserRepository repository;
	private final EntityUpdater updater;

	public UserResponse getCurrentUser(Principal connectedUser) {
		var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
		return mapper.buildUserResponse(user);
	}
	
	// get user by name or email
	public List<UserResponse> findUser(String userInfo, Principal connectedUser) {
		var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
		ServiceLogger.info("The user {}, is searching for: {}", user.getUsername(), userInfo);
		
		var users = repository.findByUsernameOrEmailContainingIgnoreCase(userInfo);
		if (users.isEmpty()) {
			throw new NotFoundException("No users found matching: " + userInfo);
		}
		return users.stream()
		            .map(mapper::buildUserResponse)
		            .toList();
	}
	
	// edit connected user
	public void editUser(UpdateRequest request, Principal connectedUser) {
		var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
		if(!request.password().equals(request.confirmPassword())) {
			throw new IllegalStatusException("Wrong Password");
		}
		var data = updater.mergeData(user, request);
		repository.save(data);
		ServiceLogger.info("User {} changed their password", user.getUsername());
	}
	
	// logout connected user
	public void logout(Principal connectedUser) {
		var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
		updater.revokeAllUserTokens(user);
		ServiceLogger.info("User {} has logged out. All valid tokens revoked.", user.getUsername());
	}
	
	// connected user
	public void changePassword(PasswordRequest request, Principal connectedUser) {
		var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
		
		if (!passwordEncoder.matches(request.confirmationpassword(), user.getPassword())) {
			ServiceLogger.warn("Wrong Password");
			throw new IllegalStatusException("Wrong Password");
		}

		if (!request.newpassword().equals(request.confirmationpassword())) {
			ServiceLogger.warn("Passwords are not the same");
			throw new IllegalStatusException("Passwords are not the same");
		}

		user.setPassword(passwordEncoder.encode(request.newpassword()));
		repository.save(user);
		ServiceLogger.info("User {} changed their password", user.getUsername());
	}

	// Admin
	public void changePassword(String userInfo, PasswordRequest request, Principal connectedUser) {
		var admin = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
		
		var user = repository.findByUsername(userInfo)
				.or(() -> repository.findByEmail(userInfo))
				.orElseThrow(() -> new NotFoundException("User not found"));

		if (!passwordEncoder.matches(request.confirmationpassword(), user.getPassword())) {
			throw new IllegalStatusException("Wrong Password");
		}

		if (!request.newpassword().equals(request.confirmationpassword())) {
			throw new IllegalStatusException("Passwords are not the same");
		}

		user.setPassword(passwordEncoder.encode(request.newpassword()));
		repository.save(user);
		ServiceLogger.info("Password changed for user {} by {}", userInfo, admin);
	}

	@Transactional
	public AuthenticationResponse register(RegisterRequest request) {
		if(repository.existsByUsername(request.username()) || repository.existsByEmail(request.email())) {
			throw new AlreadyExistsException("User already exists");
		}
		
		if (request.password().equals(request.confirmpassword())) {
			throw new IllegalStatusException("Passwords are not the same");
		}
		
		var user = mapper.buildAttributes(request.name(), request.username(),request.age(), request.email(), passwordEncoder.encode(request.password()));
		user.setRole(Role.USER);
		var savedUser = repository.save(user);
		var jwtToken = jwtService.generateToken(user);
		var refreshToken = jwtService.generateRefreshToken(user);
		updater.saveUserToken(savedUser, jwtToken);
		
		ServiceLogger.info("User registered: {}", request.username());
		var response = mapper.buildResponse(jwtToken, refreshToken);
		return response;
	}

	public AuthenticationResponse authenticate(AuthenticationRequest request) {
		String userIdentifier = request.userinfo();
		
		var user = repository.findByUsername(userIdentifier)
				.or(() -> repository.findByEmail(userIdentifier))
				.orElseThrow(() -> new NotFoundException("Username or email wasn't found"));
		
		authManager.authenticate(
				new UsernamePasswordAuthenticationToken(user.getUsername(), request.password()));

		var jwtToken = jwtService.generateToken(user);
		var refreshToken = jwtService.generateRefreshToken(user);
		updater.revokeAllUserTokens(user);
		updater.saveUserToken(user, jwtToken);
		ServiceLogger.info("User authenticated: {}", userIdentifier);
		var response = mapper.buildResponse(jwtToken, refreshToken);
		return response;
	}

	public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
		final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		final String refreshToken;
		final String userInfo;
		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			throw new NotFoundException("Auth token was not found");
		}
		refreshToken = authHeader.substring(7);
		userInfo = jwtService.extractUsername(refreshToken);
		if (userInfo != null) {
			var user = repository.findByUsername(userInfo).or(() -> repository.findByEmail(userInfo))
					.orElseThrow(() -> new NotFoundException("User username or email not found"));
			if(jwtService.isTokenValid(refreshToken, user)) {
				var accessToken = jwtService.generateToken(user);
				updater.revokeAllUserTokens(user);
				updater.saveUserToken(user, accessToken);
				var authResponse = mapper.buildResponse(accessToken, refreshToken);
				new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
				ServiceLogger.info("Access token refreshed for user {}", userInfo);
			}
		}
	}
	
	// delete my user
	
}
