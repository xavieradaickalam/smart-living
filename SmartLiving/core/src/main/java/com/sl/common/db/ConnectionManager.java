package com.sl.common.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.apache.log4j.Logger;

public class ConnectionManager {

	private static final Logger logger = Logger.getLogger(ConnectionManager.class.getName());

	public static final String DATASOURCE_CONTEXT = "jdbc/HanaDB";
	private Connection connection;
	private static ConnectionManager connectionManager = null;
	private ConfigManager configManager;

	private ConnectionManager() {
		configManager = ConfigManager.getInstance();
	}
	
	public static ConnectionManager getInstance() {
		if (null == connectionManager) {
			connectionManager = new ConnectionManager();
		}
		return connectionManager;
	}	
	public Connection getConnection() throws SQLException {
		if (connection == null) {
			try {
				Class.forName(configManager.getConfig(ConfigManager.JDBC_DRIVER_NAME));
			} catch (ClassNotFoundException e) {
				throw new SQLException(e);
			}
			connection = DriverManager.getConnection(
					configManager.getConfig(ConfigManager.JDBC_URL),
					configManager.getConfig(ConfigManager.JDBC_USER),
					configManager.getConfig(ConfigManager.JDBC_PASSWORD));
			if (connection != null) {
				logger.info("DB Connection is successful");
			}
		}
		return connection;
	}

	/**
	 * 
	 * @param username
	 * @param password
	 * @return
	 * @throws SQLException
	 */
	public Connection getConnection(String username, String password) throws SQLException {
		if (connection == null) {
			try {
				Class.forName(configManager.getConfig(ConfigManager.JDBC_DRIVER_NAME));
			} catch (ClassNotFoundException e) {
				throw new SQLException(e);
			}
			connection = DriverManager.getConnection(
					configManager.getConfig(ConfigManager.JDBC_URL), username,
					password);
		}
		return connection;
	}
	
	public void closeConnection() throws SQLException {
		if (connection != null && !connection.isClosed()) {
			connection.close();
			connection = null;
			logger.info("DB Connection is closed");
		}
	}
	public Connection getJNDIConnection(String username, String password)	throws SQLException, NamingException {
		Context initCtx = new InitialContext();
		Context envCtx = (Context) initCtx.lookup("java:comp/env");
		DataSource datasource = (DataSource) envCtx.lookup(DATASOURCE_CONTEXT);		
		if (datasource != null) {
			connection = datasource.getConnection(username, password);
		} else {
			logger.error("Failed to lookup datasource.");
		}
		return connection;
	}
}