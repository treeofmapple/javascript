package com.tom.sample.call.common;

import org.springframework.stereotype.Component;

import com.tom.sample.call.authentication.AuthenticationMapper;
import com.tom.sample.call.authentication.TokenRepository;
import com.tom.sample.call.authentication.TokenType;
import com.tom.sample.call.authentication.User;
import com.tom.sample.call.dto.requests.UpdateRequest;
import com.tom.sample.call.exception.NotFoundException;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class EntityUpdater {

	private final TokenRepository tokenRepository;
	private final AuthenticationMapper mapper;
	
	public User mergeData(User user, UpdateRequest request) {
		user.setUsername(request.username());
		user.setEmail(request.email());
		user.setAge(request.age());
		return user;
	}
	
	public void saveUserToken(User user, String jwtToken) {
		var token = mapper.buildAttributes(user, jwtToken, TokenType.BEARER, false, false);
		tokenRepository.save(token);
	}

	public void revokeAllUserTokens(User user) {
		var validUser = tokenRepository.findAllValidTokenByUser(user.getId());
		if (validUser.isEmpty()) {
			throw new NotFoundException("No active tokens found for user");
		}
		validUser.forEach(token -> {
			token.setExpired(true);
			token.setRevoked(true);
		});
		tokenRepository.saveAll(validUser);
	}
	
}
