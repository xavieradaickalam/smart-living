package com.sap.msp.fixtures.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * 
 * @author i057588
 *
 */
//TODO :  Logging and error handling
public class PropertiesManager {
	
    private static final String CONFIG_FILE_NAME = "config.properties";
    
    public static final String SYSTEM_UNDER_TEST = "SYSTEM_UNDER_TEST";
	public static final String HANA_INSTANCE_NUMBER = "HANA_INSTANCE_NUMBER";
	public static final String HANA_USERNAME = "HANA_USERNAME";
	public static final String HANA_PASSWORD = "HANA_PASSWORD";
	
	private static PropertiesManager propertiesManager = null;
	
	private static Properties props;
	
	static {
		props = new Properties();
		try {
			InputStream inputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(CONFIG_FILE_NAME);
			try {
				props.load(inputStream);
			} finally {
				inputStream.close();
			}
		} catch (IOException ex) {
			ex.printStackTrace();
		}
	}	
	private PropertiesManager() {
		Properties sysProps = System.getProperties();
		//Give higher properties to System Properties
		props.putAll(sysProps);
	}
	public static PropertiesManager getInstance() {
		if (null == propertiesManager) {
			propertiesManager = new PropertiesManager();
		}
		return propertiesManager;
	}
	public String get(String key) {
		return (String)props.get(key);
	}
}
