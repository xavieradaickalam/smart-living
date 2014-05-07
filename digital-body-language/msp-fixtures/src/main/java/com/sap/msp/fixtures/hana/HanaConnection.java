package com.sap.msp.fixtures.hana;

import static util.ListUtility.list;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;

import org.apache.log4j.Logger;
import org.dbunit.DatabaseUnitException;

import com.sap.db.jdbcext.ConnectionPoolDataSourceSAP;
import com.sap.db.jdbcext.PooledConnectionSAP;
import com.sap.msp.fixtures.utils.HanaProperties;


/**
 * @author I058430
 * 
 *  HANA connection and Query execution fixture
 */
public class HanaConnection {
	static ConnectionPoolDataSourceSAP connectionPoolDataSource;
	static PooledConnectionSAP pooledDbConnectionSAP;
	private static Connection sqlConnection;
	private static boolean connectionExists = false;
	static String url;
	private static Logger LOG = Logger.getLogger(HanaConnection.class);
	Properties props = HanaProperties.INSTANCE.getProperties();
	String dateString = null;


	/**
	 * Constructor create pooled connection to HANA database.
	 * <p>
	 * <u>Required FitNesse import on the Wiki page:</u>
	 * 
	 * <pre>
	 * |Import|
	 * |com.sap.dfla.tdma.fixtures.hana|
	 * </pre>
	 * 
	 */
	public HanaConnection() {
		super();
		connectionPoolDataSource = new ConnectionPoolDataSourceSAP();
		url = props.getProperty(HanaProperties.JDBC_URL);
		int HanaPort = Integer.parseInt(props.getProperty(HanaProperties.JDBC_PORT));		
		connectionPoolDataSource.setServerName(props.getProperty(HanaProperties.JDBC_HOST));
		connectionPoolDataSource.setPort(HanaPort);
		connectionPoolDataSource.setUser(props.getProperty(HanaProperties.JDBC_USER));
		connectionPoolDataSource.setPassword(props.getProperty(HanaProperties.JDBC_PASSWORD)); 
	}


	/**
	 * Constructor create user defined pooled connection to HANA database.
	 * <p>
	 * <u>Required FitNesse import on the Wiki page:</u>
	 * 
	 * <pre>
	 * |Import|
	 * |com.sap.dfla.tdma.fixtures.hana|
	 * </pre>
	 * 
	 */
	public HanaConnection(String HanaHost, String HanaInstance, String HanaUser, String HanaPassword) {
		super();
		connectionPoolDataSource = new ConnectionPoolDataSourceSAP();
		int HanaPort =  Integer.parseInt("3"+HanaInstance+"15");
		url = "jdbc:sap://"+HanaHost+":"+HanaPort; 	 	  
		connectionPoolDataSource.setServerName(HanaHost);
		connectionPoolDataSource.setPort(HanaPort);
		connectionPoolDataSource.setUser(HanaUser);
		connectionPoolDataSource.setPassword(HanaPassword);	
	}
	
	
	/**
	 * Constructor create pooled connection to HANA database for specified user.
	 * <p>
	 * <u>Required FitNesse import on the Wiki page:</u>
	 * 
	 * <pre>
	 * |Import|
	 * |com.sap.dfla.tdma.fixtures.hana|
	 * </pre>
	 * 
	 */
	public HanaConnection(String HanaUser, String HanaPassword) {
		super();
		connectionPoolDataSource = new ConnectionPoolDataSourceSAP();
		url = props.getProperty(HanaProperties.JDBC_URL);
		int HanaPort = Integer.parseInt(props.getProperty(HanaProperties.JDBC_PORT));		
		connectionPoolDataSource.setServerName(props.getProperty(HanaProperties.JDBC_HOST));
		connectionPoolDataSource.setPort(HanaPort);
		connectionPoolDataSource.setUser(HanaUser);
		connectionPoolDataSource.setPassword(HanaPassword);	
	}


	/**
	 * Get connection to HANA database.
	 * <p>
	 * <u>Required FitNesse import on the Wiki page:</u>
	 * 
	 * <pre>
	 * |Import|
	 * |com.sap.dfla.tdma.fixtures.hana|
	 * </pre>
	 * @return boolean true if successful, otherwise false
	 * 
	 * @throws DatabaseUnitException
	 * @throws SQLException
	 * @throws ClassNotFoundException
	 */
	public static boolean getConnection() throws DatabaseUnitException, SQLException, ClassNotFoundException {
		pooledDbConnectionSAP  = (PooledConnectionSAP) connectionPoolDataSource.getPooledConnection();
		sqlConnection = pooledDbConnectionSAP.getConnection();  	
		sqlConnection.setClientInfo("ApplicationName", "FitNesse");			
		String connectionID = sqlConnection.toString();
		String uniqueConnectionID = connectionID.substring(connectionID.lastIndexOf("$")+1, connectionID.length()-1); 	   	   
		LOG.info("getConnection() : Obtained "+uniqueConnectionID+" for "+url);
		sqlConnection.setAutoCommit(true);
		connectionExists = (sqlConnection != null ) ?  true:false;
		//connectionExists = sqlConnection.isValid(0);
		return connectionExists;
	}


	/**
	 * Check if a connection already exits to HANA DB
	 * <p>
	 * <u>Required FitNesse import on the Wiki page:</u>
	 * <pre>
	 * |Import|
	 * |com.sap.dfla.tdma.fixtures.hana|
	 * </pre>
	 * @return boolean true if connection exists, otherwise false
	 */
	public static boolean connectionExists(){
		return connectionExists;		
	}
	
		
	/**
	 * Check connection user
	 * <p>
	 * <u>Required FitNesse import on the Wiki page:</u>
	 * <pre>
	 * |Import|
	 * |com.sap.dfla.tdma.fixtures.hana|
	 * </pre>
	 * @return connections user
	 */
	public static String checkConnectionUser(){
		return connectionPoolDataSource.getUser();		
	}


	/**
	 * Close connection to HANA database.
	 * <p>
	 * <u>Required FitNesse import on the Wiki page:</u>
	 * 
	 * <pre>
	 * |Import|
	 * |com.sap.dfla.tdma.fixtures.hana|
	 * </pre>
	 * 
	 * @throws SQLException
	 * @return boolean true if successfully closed, otherwise false
	 */
	public static boolean closeConnection() throws SQLException {
		if (sqlConnection != null) {
			sqlConnection.close();
			connectionExists = false;
			LOG.info("closeConnection() : Connection closed!");
		}
		return !connectionExists;
	}



	/**
	 * Executes given query. Returns "SUCCESS" when successful.
	 * <p>
	 * <u>Required FitNesse import on the Wiki page:</u>
	 * 
	 * <pre>
	 * |Import|
	 * |com.sap.dfla.tdma.fixtures.hana|
	 * </pre>
	 * 
	 * @param query
	 * @return
	 */
	public static String execute(final String query) {
		PreparedStatement stmt = null;
		String result = "SUCCESS";
		try {
			stmt = sqlConnection.prepareStatement(query);
			LOG.info("execute() : executing query: " + query);
			stmt.execute();
			stmt.close();
		} catch (SQLException e) {
			LOG.warn(e);
			result = e.getMessage();			
		} 		
		return result;
	}


	/**
	 * Executes given query and return resultSet
	 * 
	 * <pre>
	 * |Import|
	 * |com.sap.dfla.tdma.fixtures.hana|
	 * </pre>
	 * 
	 * @param query
	 * @return resultSet
	 */
	public static ResultSet executeAndReturnResultSet(final String query) {
		PreparedStatement stmt = null;
		java.sql.ResultSet rs = null;
		try {
			stmt = sqlConnection.prepareStatement(query);    		  
			LOG.info("executeAndReturnResultSet() : executing: " + query);
			stmt.execute();
			rs = stmt.getResultSet();  
		} catch (SQLException e) {
			LOG.error(e);	
		}    
		return rs;
	}
	
	
	/**
	 * Execute update query and return resultSet
	 * 
	 * <pre>
	 * |Import|
	 * |com.sap.dfla.tdma.fixtures.hana|
	 * </pre>
	 * 
	 * @param query
	 * @return resultSet
	 */
	public static ResultSet executeUpdateAndReturnResultSet(final String query) {
		PreparedStatement stmt = null;
		java.sql.ResultSet rs = null;
		try {
			stmt = sqlConnection.prepareStatement(query);    		  
			LOG.info("executeUpdateAndReturnResultSet() : executing: " + query);
			stmt.executeUpdate();
			rs = stmt.getResultSet();  
		} catch (SQLException e) {
			LOG.warn(e);
		}    
		return rs;
	}
	
	
	/**
	 * Execute query and return actual result (enables the use of SYMBOLS in the wiki for query results)
	 * 
	 * <pre>
	 * |Import|
	 * |com.sap.dfla.tdma.fixtures.hana|
	 * </pre>
	 * 
	 * @param query
	 * @return resultSet
	 */
	public static ResultSet executeAndReturnResult(final String query, final String columnLabel) {
		PreparedStatement stmt = null;
		java.sql.ResultSet rs = null;
		List<Object> rowList = new ArrayList<Object>();
		try {
			stmt = sqlConnection.prepareStatement(query);    		  
			LOG.info("executeAndReturnResult() : executing: " + query);
			stmt.execute();
			rs = stmt.getResultSet();
		} catch (SQLException e) {
			LOG.warn(e);
		}   		
			return rs;
	}
}
