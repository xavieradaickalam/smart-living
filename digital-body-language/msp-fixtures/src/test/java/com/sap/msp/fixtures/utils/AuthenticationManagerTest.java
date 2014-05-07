package com.sap.msp.fixtures.utils;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class AuthenticationManagerTest {
	
	private AuthenticationManager authManager;
	private PropertiesManager propsMan;

	@Before
	public void setUp() throws Exception {
		 propsMan = PropertiesManager.getInstance();
		 authManager = new AuthenticationManager(
				 propsMan.get(propsMan.SYSTEM_UNDER_TEST),
				 propsMan.get(propsMan.HANA_INSTANCE_NUMBER),
				 propsMan.get(propsMan.HANA_USERNAME),
				 propsMan.get(propsMan.HANA_PASSWORD));
	}

	@After
	public void tearDown() throws Exception {
		authManager = null;
	}

	@Test
	public void testLogin() {
		assertTrue(authManager.login());
		assertTrue(authManager.logout());
	}

	@Test
	public void testLogout() {
		assertTrue(authManager.login());
		assertTrue(authManager.logout());
	}

	@Test
	public void testGetSessionId() {
		assertTrue(authManager.login());
		assertNotNull(authManager.getSessionId());
		assertTrue(authManager.logout());
	}

	@Test
	public void testGetxCSRFToken() {
		assertTrue(authManager.login());
		assertNotNull(authManager.getxCSRFToken());
		assertTrue(authManager.logout());
	}
}
