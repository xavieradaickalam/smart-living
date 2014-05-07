package com.sl.common.db;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.fail;

import java.sql.SQLException;

import org.junit.Test;

public class ConnectionManagerTest {
	
	private ConnectionManager conManager;
	private ConfigManager configManager;
	
	public ConnectionManagerTest() {
		conManager = ConnectionManager.getInstance();
		configManager = ConfigManager.getInstance();
	}
	
	@Test
	public void testGetConnection() {
		try {
			assertNotNull("Connection", conManager.getConnection());
		} catch (SQLException e) {
			fail();
			e.printStackTrace();
		} finally {
			try {
				conManager.closeConnection();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}	
	@Test
	public void testGetConnectionWithUsernamePassword() {
		try {
			assertNotNull("Connection", conManager.getConnection(configManager.getConfig("jdbc.username"),configManager.getConfig("jdbc.password")));
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				conManager.closeConnection();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}	
}
