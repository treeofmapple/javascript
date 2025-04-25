package com.tom.sample.call.common;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.tom.sample.call.authentication.Role;
import com.tom.sample.call.authentication.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@Profile("debug")
@RequiredArgsConstructor
public class SystemStarts implements CommandLineRunner {

	private final GenerateData data;
	private final UserRepository repository;
	
    @Override
    public void run(String... args) throws Exception {
    	repository.deleteAll();
			roleUser(25);
			roleManager(5);
			roleAdmin(1);
		ServiceLogger.info("Users for debug created");
		
		data.getUserPasswords().forEach((username, password) -> 
			ServiceLogger.debug("DEBUG USER -> username: {}, password: {}", username, password)
		);
	}
    
    private void roleUser(int quantity) {
    	for(int i = 0; i <= quantity; i++) {
	    	var gen = data.datagen();
	    	gen.setRole(Role.USER);
	    	repository.save(gen);
    	}
    }
	
    private void roleManager(int quantity) {
    	for(int i = 0; i <= quantity; i++) {
	    	var gen = data.datagen();
	    	gen.setRole(Role.MANAGER);
	    	repository.save(gen);
    	}
    }
    
    private void roleAdmin(int quantity) {
    	for(int i = 0; i <= quantity; i++) {
	    	var gen = data.datagen();
	    	gen.setRole(Role.ADMIN);
	    	repository.save(gen);
    	}
    }
}


