package com.tom.sample.call.dto.response;

public record AuthenticationResponse(

		String accessToken,

		String refreshToken
		
) {
}
