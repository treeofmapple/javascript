package com.tom.sample.call.common;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.atomic.AtomicLong;

import net.datafaker.Faker;

public interface DatagenUtil {

	Faker faker = new Faker();
	AtomicLong atomicCounter = new AtomicLong(0);
	ThreadLocalRandom loc = ThreadLocalRandom.current();
	Set<String> generatedNames = new HashSet<>();
	Set<String> passwords = new HashSet<>();
	
}
