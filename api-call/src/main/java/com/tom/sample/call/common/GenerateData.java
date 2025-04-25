package com.tom.sample.call.common;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.tom.sample.call.authentication.User;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class GenerateData implements DatagenUtil {

	private final Map<String, String> userPasswords = new LinkedHashMap<>();
	private final PasswordEncoder passwordEncoder;
	
	protected User datagen() {
		User user = new User();
		user.setName(generateUniqueName());
		user.setUsername(faker.internet().username());
		user.setEmail(faker.internet().emailAddress());
		user.setAge(getRandomInt(isAtributesMet(60) ? 19 : 41, isAtributesMet(20) ? 41 : 59));
		String rawPassword = generatePasswordUnique();
		user.setPassword(passwordEncoder.encode(rawPassword));
		userPasswords.put(user.getUsername(), rawPassword);
		return user;
	}
	

	public Map<String, String> getUserPasswords() {
		return userPasswords;
	}
	
    private String generateUniqueName() {
        String name;
        do {
            name = faker.name().fullName();
        } while (generatedNames.contains(name));
        generatedNames.add(name);
        return name;
    }

    private String generatePasswordUnique() {
    	String password;
    	do {
    		password = faker.internet().password();
    	} while(passwords.contains(password));
    	passwords.add(password);
    	return password;
    }
    
	protected double getRandomDouble(double min, double max) {
	    if (max <= min) {
	        return min;
	    }
		return loc.nextDouble(min, max);
	}

	protected int getRandomInt(int min, int max) {
	    if (max <= min) {
	        return min;
	    }
		return loc.nextInt(min, max);
	}

	protected boolean isAtributesMet(int atribute) {
		return loc.nextInt(100) < atribute;
	} 
}


