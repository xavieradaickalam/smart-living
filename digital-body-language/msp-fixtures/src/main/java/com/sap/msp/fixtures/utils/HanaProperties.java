package com.sap.msp.fixtures.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.InvalidPropertiesFormatException;
import java.util.Map.Entry;
import java.util.Properties;

import org.apache.log4j.Logger;

/**
 * @author i069861
 * 
 */
public enum HanaProperties {
  INSTANCE;

  private static final String CONFIGURATION = "/jdbc.properties";
  private Properties properties;

  public static final String JDBC_URL = "jdbc.url";
  public static final String JDBC_HOST = "jdbc.host";
  public static final String JDBC_PORT = "jdbc.port";
  public static final String JDBC_DRIVER = "jdbc.driver.name";
  public static final String JDBC_USER = "jdbc.username";
  public static final String JDBC_PASSWORD = "jdbc.password";
  public static final String JDBC_CONNECTIONPOOL_MAXCONNECTIONS = "jdbc.connectionpool.maxconnections";
  public static final String JDBC_CONNECTIONPOOL_MAXCONNECTIONS_PER_USER = "jdbc.connectionpool.maxconnectionsperuser";
  //TDMA JDBC Schemas 
  public static final String JDBC_SCHEMA_SOURCES = "jdbc.schema.sources";
  public static final String JDBC_SCHEMA_INPUT = "jdbc.schema.input";
  public static final String JDBC_SCHEMA_MAIN = "jdbc.schema.main";
  public static final String JDBC_SCHEMA_SCENARIOS = "jdbc.schema.scenarios";
  public static final String EPM_USER = "epmaddin.username";
  public static final String EPM_PASSWORD = "epmaddin.user.password";
  public static final String SCENARIOS_USER = "scenarios.username";
  public static final String SCENARIOS_PASSWORD = "scenarios.user.password";
  public static final String XSJS_PORT = "xsjs.port";
  public static final String SCENARIOS_UI_URL = "scenarios.ui.url";


  private HanaProperties() {
    final Logger logger = Logger.getLogger(HanaProperties.class);  
    this.properties = new Properties();
    final InputStream inputStream = getClass().getResourceAsStream(CONFIGURATION);
    loadProperties(logger, inputStream);
    init();
  }

  /**
   * @param logger
   * @param inputStream
   */
  public void loadProperties(final Logger logger, final InputStream inputStream) {
    try {
      this.properties.load(inputStream);
    } catch (InvalidPropertiesFormatException e) {
      logger.error(e);
    } catch (IOException e) {
      logger.error(e);
    }
  }

  public Properties getProperties() {
    return properties;
  }

  private void init() {
    Properties systemPorperties = new Properties();
    Properties sysProps = System.getProperties();
    for (Entry<Object, Object> entry : sysProps.entrySet()) {
      String key = (String) entry.getKey();
      /**
       * we are only interested in jdbc.*,epmaddin.*,xsjs.*,scenarios.* properties...
       */
      if (key.startsWith("jdbc.")||key.startsWith("epmaddin.")||key.startsWith("xsjs.")||key.startsWith("scenarios.")) {
        systemPorperties.put(key, entry.getValue());
      }
    }
    // Give more preference to system properties and override the existing properties comes from file..
    if(systemPorperties.size() > 0) {
      properties.putAll(systemPorperties);
    }   
    
  }
}
