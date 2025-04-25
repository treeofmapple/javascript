package com.tom.sample.call.authentication;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("v1/admin")
@PreAuthorize("hasRole('ADMIN')")
// @Tag(name = "Anonymous") # Swagger
@RequiredArgsConstructor
public class AdminController {

	// @PreAuthorize("hasAuthority('admin:read')")
	
	// @PreAuthorize("hasAuthority('admin:create')")
	
	// @PreAuthorize("hasAuthority('admin:update')")
	
	// @PreAuthorize("hasAuthority('admin:delete')")
	
}
