package com.sl.common.db;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map.Entry;
import java.util.Properties;

import org.apache.log4j.Logger;

public class ConfigManager {	

	public static final String CONFIG_FILE_NAME = "jdbc.properties";	
	public static final String JDBC_URL = "jdbc.url";
	public static final String JDBC_HOST = "jdbc.host";
	public static final String JDBC_USER = "jdbc.username";
	public static final String JDBC_PASSWORD = "jdbc.password";
	public static final String JDBC_SCHEMA = "jdbc.schema";
	public static final String JDBC_DRIVER_NAME = "jdbc.driver.name";
	
	private static Properties props;
	private static ConfigManager configManager = null;	
	
	private static final Logger LOG =  Logger.getLogger(ConfigManager.class.getName());
	/**
	 *  Singlton class loads the properties from the file from the class path for testing purposes
	 *  Production : props.ini file contains the connection properties as system variables.   
	 *  Note : System variables overides the values from properties file.
	 */
	static {
		props = new Properties();
		try {
			InputStream inputStream = Thread.currentThread()
					.getContextClassLoader()
					.getResourceAsStream(CONFIG_FILE_NAME);
			try {
				props.load(inputStream);
			} finally {
				inputStream.close();
			}
		} catch (IOException ex) {
			LOG.error("Error Loading database connection properties from file : jdbc.properties"+ ex.getMessage());
		}
	}

	private ConfigManager() {
		Properties systemPorperties = new Properties();
		Properties sysProps = System.getProperties();
		for (Entry<Object, Object> entry : sysProps.entrySet()) {
			String key = (String) entry.getKey();
			if (key.startsWith("jdbc.")) { // We are only interested in jdbc.*
											// properties
				systemPorperties.put(key, entry.getValue());
			}
		}
		// Give more preference to system properties and overide the existing
		// propeties comes from file..
		if (systemPorperties.size() > 0) {
			props.putAll(systemPorperties);
		}
		String jdbcUrl = props.getProperty("jdbc.url", null);
		String jdbcHost = props.getProperty("jdbc.host", null);
		if (jdbcUrl != null && jdbcHost != null) {
			String propHost = "${jdbc.host}";
			if (jdbcUrl.contains(propHost)) {
				String expandedJdbcUrl = jdbcUrl.replace(propHost, jdbcHost);
				props.put("jdbc.url", expandedJdbcUrl);
			}
		}
	}
	/**
	 *    
	 * @return
	 */
	public static ConfigManager getInstance() {
		if (null == configManager) {
			configManager = new ConfigManager();
		}
		return configManager;
	}
	public String getConfig(String name) {
		return props.getProperty(name);
	}
}
