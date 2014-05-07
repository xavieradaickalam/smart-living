package com.sap.msp.fixtures.common;

import com.sap.msp.fixtures.utils.AuthenticationManager;

public class BaseFixture {
	
	private String systemUnderTest;
	private String hanaInstanceNumber;
	private String hanaUsername;
	private String hanaPassword;
	
	private AuthenticationManager authManager;
	
	public String getSystemUnderTest() {
		return systemUnderTest;
	}
	public void setSystemUnderTest(String systemUnderTest) {
		this.systemUnderTest = systemUnderTest;
	}
	public String getHanaInstanceNumber() {
		return hanaInstanceNumber;
	}
	public void setHanaInstanceNumber(String hanaInstanceNumber) {
		this.hanaInstanceNumber = hanaInstanceNumber;
	}
	public String getHanaUsername() {
		return hanaUsername;
	}
	public void setHanaUsername(String hanaUsername) {
		this.hanaUsername = hanaUsername;
	}
	public String getHanaPassword() {
		return hanaPassword;
	}
	public void setHanaPassword(String hanaPassword) {
		this.hanaPassword = hanaPassword;
	}
	
	public boolean login() {
		boolean result = false;
		if( systemUnderTest != null && 
			hanaInstanceNumber != null &&
			hanaUsername != null &&
			hanaPassword != null ) {
			authManager = new AuthenticationManager(systemUnderTest,hanaInstanceNumber,hanaUsername,hanaPassword);
			result= authManager.login();
		}
		return result;
	}
	
	public boolean logout() {
		boolean result = false;
		if( authManager != null ) {
			result= authManager.logout();
		}
		return result;
	}
}
