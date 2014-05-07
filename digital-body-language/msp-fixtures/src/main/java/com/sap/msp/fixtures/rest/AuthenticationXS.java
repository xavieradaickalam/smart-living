package com.sap.msp.fixtures.rest;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Properties;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import org.apache.cxf.jaxrs.client.WebClient;
import org.apache.log4j.Logger;

import com.sap.msp.fixtures.utils.Base64Converter;
import com.sap.msp.fixtures.utils.HanaProperties;

/**
 * TDMA XS engine REST Authentication fixture.
 *
 * @author I058430
 * 
 */
public class AuthenticationXS {

	private static final Logger LOG = Logger.getLogger(AuthenticationXS.class);
	final Properties props = HanaProperties.INSTANCE.getProperties();
	private WebClient client = null;	
	private String loginlogoutPath = "/sap/hana/xs/formLogin/login.html";
	private String XCSRFTokenPath = "/sap/hana/xs/formLogin/token.xsjs";
	private String XSCFuncPath = "/sap/hana/xs/formLogin/login.xscfunc";
	private static String XsSessionId = "";
	private static String XCSRFToken = "";
	private static String username = "";
	private static String password = "";
	private static String serviceURL;


	/**
	 * Class constructor using jdbc arguments for HANA host and XS engine port
	 * <p>
	 * <u>Required FitNesse import on the Wiki page:</u>
	 * ==
	 * <pre>
	 * |Import|
	 * |com.sap.dfla.tdma.fixtures.utils|
	 * </pre>
	 */
	public AuthenticationXS() {
		super();
		//Obtain HANA instance number from port details e.g. 3{instance number}15
		String instanceNum = props.getProperty(HanaProperties.JDBC_PORT).substring(1, 3);			
		serviceURL = "http://"+props.getProperty(HanaProperties.JDBC_HOST)+":80"+instanceNum;
		client = WebClient.create(serviceURL);
	}
	
	
	/**
	 * Class constructor user defined HANA host and XS engine port
	 * <p>
	 * <u>Required FitNesse import on the Wiki page:</u>
	 * <pre>
	 * |Import|
	 * |com.sap.dfla.tdma.fixtures.utils|
	 * </pre>
	 * @param HANA host
	 * @param XS engine port
	 */
	public AuthenticationXS(String HanaHost, String XsEnginePort) {		
		super();
		serviceURL = "http://"+HanaHost+":"+XsEnginePort;
		client = WebClient.create(serviceURL);
	}
	
	public static String getXsSessionId() {
		return XsSessionId;
	}
	
	public static String getXCrsfToken() {
		return XCSRFToken;
	}
	
	public static String getServiceUrl() {
		return serviceURL;
	}
	
	public static String getUsername() {
		return username;
	}
	
	public static String getPassword() {
		return password;
	}



	
	/**
	 * Login using jdbc arguments username and password.
	 * <p>
	 * <u>Required FitNesse import on the Wiki page:</u>
	 * 
	 * <pre>
	 * |Import|
	 * |com.sap.dfla.tdma.fixtures.utils|
	 * </pre>
	 * 
	 * @param path URL path
	 * @return true if authentication is successful, false if unsuccessful
	 */
	public boolean login() {
		LOG.info("Logging into: "+serviceURL);	
		this.username = props.getProperty(HanaProperties.JDBC_USER);
		this.password = props.getProperty(HanaProperties.JDBC_PASSWORD);		
		return sendGetAndSaveXsSessionId(loginlogoutPath, encodeLoginDetails(this.username, this.password));		
	}


	/**
	 * Login using user defined username and password.
	 * <p>
	 * <u>Required FitNesse import on the Wiki page:</u>
	 * 
	 * <pre>
	 * |Import|
	 * |com.sap.dfla.tdma.fixtures.utils|
	 * </pre>
	 * 
	 * @param path URL path
	 * @param username HANA user
	 * @param password HANA password
	 * @return true if authentication is successful, false if unsuccessful
	 */
	public boolean login(String username, String password) {
		this.username = username;
		this.password = password;
		LOG.info("Logging into: "+serviceURL);	
		//Throws java.net.ConnectException if URL port wrong need to catch this
		sendGetAndSaveXsSessionId(loginlogoutPath, encodeLoginDetails(this.username, this.password));	
		return sendPostXSFUNC();		
	}
	
	
	/**
	 * @param encodedLoginDetails Base 64 encoded user name and password
	 * @param loginPath
	 * @return true if the response is 200
	 */	
	private boolean sendGetAndSaveXsSessionId(String loginPath, String encodedLoginDetails) {
		Response response;
		client.reset();
		client.path(serviceURL+loginlogoutPath);
		setAuthorizationHeaders(encodedLoginDetails);
		client.header("X-Requested-With", "XMLHttpRequest");
		client.header("X-CSRF-Token", "Fetch");
		response = client.get();
		if (!validResponse(200, response)) {
			LOG.error("Invalid HTTP response code: " + response.getStatus());
			return false;
		}
		XsSessionId = getXSCookie(response);
		XCSRFToken = getXCSRFToken(response);
		LOG.info("Obtained: " + XsSessionId);
		LOG.info("Obtained: " + XCSRFToken);
		return true;		
	}
	
	
	
	private boolean sendPostXSFUNC() {
		Response response;
		client.reset();
		client.path(serviceURL+XSCFuncPath);
		client.header("Cookie", XsSessionId);	
		client.header("X-Requested-With", "XMLHttpRequest");
		client.header("X-CSRF-Token", XCSRFToken);
		response = client.post("xs-username="+this.username+"&xs-password="+this.password);
		if (!validResponse(200, response)) {
			LOG.error("Invalid HTTP response code: " + response.getStatus());
			return false;
		}
		return true;		
	}
	
	
	/**
	 * Sent GET request.
	 * <p>
	 * <u>Required FitNesse import on the Wiki page:</u>
	 * 
	 * <pre>
	 * |Import|
	 * |com.sap.dfla.tdma.fixtures.utils|
	 * </pre>
	 * @param path URL path
	 * @return response body
	 */
	public String sendGetRequest(String path) {
		Response response;
		String responseString = "no response";
		client.reset();
		client = WebClient.create(serviceURL+path);
		LOG.info("Sending Get: " +serviceURL+path);
		client.header("Cookie", XsSessionId);
		client.type(MediaType.TEXT_PLAIN);
		//responseString = client.get(String.class); 
		response = client.get();		
		if (!validResponse(200, response)) {		
			LOG.error("Invalid HTTP response code: " + response.getStatus());
			return responseString;
		}else{
			try {
				responseString = getCalculationResponse(response);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}		
		return responseString;
	}
	
	
	/**
	 * Send POST request
	 * <p>
	 * <u>Required FitNesse import on the Wiki page:</u>
	 * 
	 * <pre>
	 * |Import|
	 * |com.sap.dfla.tdma.fixtures.utils|
	 * </pre>
	 * @param path URL path
	 * @return response body
	 */
	public String sendPostRequest(String path) {
		Response response;
		String responseString = "no response";
		client.reset();
		client = WebClient.create(serviceURL+path);
		LOG.info("Sending Get: " +serviceURL+path);
		client.header("Cookie", XsSessionId);
		client.type(MediaType.TEXT_PLAIN); 
		response = client.post(null);		
		if (!validResponse(200, response)) {		
			LOG.error("Invalid HTTP response code: " + response.getStatus());
			return responseString;
		}else{
			try {
				responseString = getCalculationResponse(response);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}		
		return responseString;
	}

	/**
	 * Logout. Return true if successful.
	 * <p>
	 * <u>Required FitNesse import on the Wiki page:</u>
	 * 
	 * <pre>
	 * |Import|
	 * |com.sap.dfla.tdma.fixtures.utils|
	 * </pre>
	 * 
	 * @return true if the response is 200
	 */
	public boolean logout() {
		Response response;
		//Get XSRF token
		client.reset();
		client = WebClient.create(serviceURL+XCSRFTokenPath);
		client.header("Cookie", XsSessionId);
		client.header("X-Requested-With", "XMLHttpRequest");
		client.header("X-CSRF-Token", "Fetch");
		response = client.get();
		XCSRFToken = getXCSRFToken(response);
		//Send logout
		client.reset();
		client = WebClient.create(serviceURL+loginlogoutPath);
		client.header("Cookie", XsSessionId);	
		client.header("X-CSRF-Token", XCSRFToken);
		try {
			response = client.get();
		} 
		catch (NullPointerException e) {		
			LOG.error("Unable to logout: "+e);
			return false;
		}		
		LOG.info("Logging out!");
		return validResponse(200, response) ? true : false;
	}

	
	
	/**
	 * @param response
	 * @return response body
	 * @throws java.io.IOException
	 */
	private String getCalculationResponse(Response response) throws IOException {
		InputStream is = (InputStream) response.getEntity();
		InputStreamReader isr = new InputStreamReader(is);
		BufferedReader br = new BufferedReader(isr);
		String read = null;
		StringBuffer sb = new StringBuffer();
		while ((read = br.readLine()) != null) {
			sb.append(read);
		}
		return sb.toString();
	}


	/**
	 * @param username and password
	 * @return base64 encoded user name and password string
	 */
	private String encodeLoginDetails(String username, String password) {
		String encoded = null;
		byte[] loginDetails = username.concat(":"+password).getBytes();
		InputStream loginDetailsInput = new ByteArrayInputStream(loginDetails);
		try {
			//encoded by com.sap.dfla.tdma.fixtures.utils.java, 
			//originally copied from capex-common-library, com.sap.planning.sop.common.Base64converter.java
			encoded = Base64Converter.encodeText(loginDetailsInput);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return encoded;
	}


	/**
	 * @param encodedLoginDetails base64 encoded user name and password
	 */
	private void setAuthorizationHeaders(String encodedLoginDetails) {
		client.header("Authorization", "Basic "+encodedLoginDetails);
	}

	/**
	 * @param getResponse response from get request
	 * @return
	 */	
	private String getXCSRFToken(Response getResponse) {
		MultivaluedMap<String, Object> metadata = getResponse.getMetadata();
		List<Object> list = metadata.get("X-CSRF-Token");
		String cookie = (String) list.get(0);
		String[] XCSRFToken = cookie.split(";");
		return XCSRFToken[0];
	}

	/**
	 * @param getResponse response from get request
	 * @return
	 */	
	private String getXSCookie(Response getResponse) {
		MultivaluedMap<String, Object> metadata = getResponse.getMetadata();
		List<Object> list = metadata.get("Set-Cookie");
		String cookie = (String) list.get(0);
		String[] XsSession = cookie.split(";");
		return XsSession[0];
	}


	private boolean validResponse(int expectedCode, Response response) {
		return response.getStatus() == expectedCode ? true : false;
	}


}
