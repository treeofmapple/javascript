package com.tom.sample.call.authentication;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tom.sample.call.dto.requests.AuthenticationRequest;
import com.tom.sample.call.dto.requests.RegisterRequest;
import com.tom.sample.call.dto.response.AuthenticationResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v1/auth")
// @Tag(name = "Anonymous") # Swagger
@RequiredArgsConstructor
public class AnonymousController {

	private final UserService service;
	
	@PostMapping("/sign-up")
	public ResponseEntity<AuthenticationResponse> registerUser(@RequestBody RegisterRequest request) {
		var register = service.register(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(register);
	}
	
	@PostMapping("/sign-in")
	public ResponseEntity<AuthenticationResponse> authenticateUser(@RequestBody AuthenticationRequest request) {
		var authenticate = service.authenticate(request);
		return ResponseEntity.status(HttpStatus.ACCEPTED).body(authenticate);
	}
	
	@PostMapping("/refresh-token")
	public ResponseEntity<String> refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
		service.refreshToken(request, response);
		return ResponseEntity.status(HttpStatus.OK).body("Token from user refreshed");
	}

}
