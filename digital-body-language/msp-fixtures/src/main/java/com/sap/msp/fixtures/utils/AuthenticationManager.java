package com.sap.msp.fixtures.utils;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.Header;
import org.apache.http.HeaderIterator;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.StatusLine;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;

/**
 * 
 * @author i057588
 * Authentication Manager for HANA XS Engine 
 */
/**
 * 
 * TODO :  Add logging and error handling...
 *
 */
public class AuthenticationManager {
	
	private static final String REFERER_URI     = "/sap/hana/xs/formLogin";
	private static final String CHECK_LOGIN_URI = "/sap/hana/xs/formLogin/checkSession.xsjs";
	private static final String LOGIN_TOKEN_URI = "/sap/hana/xs/formLogin/token.xsjs";
	private static final String LOGIN_URI       = "/sap/hana/xs/formLogin/login.xscfunc";
	private static final String LOGOUT_URI      = "/sap/hana/xs/formLogin/logout.xscfunc";
	
	private String sessionId;
	private String xCSRFToken;
	private String hostname;
	private String instanceNumber;
	private String username;
	private String password;
		
	public AuthenticationManager() {		
	}
	
	public AuthenticationManager(String hostname, String instanceNumber,String username, String password) {
		
		this.hostname = hostname;
		this.instanceNumber = instanceNumber;
		this.username = username;
		this.password = password;
		
	}
	
	public boolean login() {
		
		boolean result = false;
		if (getLoginPage("http://"+ this.hostname +":80"+instanceNumber+CHECK_LOGIN_URI)) {
		 if (getCxsrfTokenToken("http://"+this.hostname +":80"+instanceNumber+LOGIN_TOKEN_URI)) {
		   if (sendPostWithAuthorization()) {
			   result=true;
		   }
		 }
		}
		return result;
	}
	
	public boolean logout() {
		
		HttpResponse response = null;
		boolean result = false;
		HttpPost request = new HttpPost("http://"+this.hostname +":80"+instanceNumber+LOGOUT_URI);
        request.addHeader("Content-Type", "application/json");
        request.addHeader("Cookie", sessionId);
        request.addHeader("Referer", sessionId);
        request.addHeader("X-CSRF-Token", xCSRFToken);
        request.addHeader("X-Requested-With", "XMLHttpRequest");
        HttpClient client = new DefaultHttpClient();
        try {
			response = client.execute(request);
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
        StatusLine statusLine = response.getStatusLine();
		if (statusLine.getStatusCode() == 200) {
			result = true;
			//System.out.println("Logout Success...");
		}
        //printHttpResponse(response);
        client.getConnectionManager().shutdown();
        return result;
        
	}
	
	public String getSessionId() {
		return sessionId;
	}
	
	public String getxCSRFToken() {
		return xCSRFToken;
	}
	
	private boolean getLoginPage(String loginurl) {
		
		HttpResponse response=null;
		boolean result = false;
		HttpClient client = new DefaultHttpClient();
		HttpGet request = new HttpGet(loginurl);
		try {
			response = client.execute(request);
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		//printHttpResponse(response);
		StatusLine statusLine = response.getStatusLine();
		if (statusLine.getStatusCode() == 200) {
			extractCookieFromResponse(response);
			result = true;
		}
		client.getConnectionManager().shutdown();
		//printResponse(response);
		return result;
		
	}
	
	private boolean getCxsrfTokenToken(String tokenurl)  {
		
		HttpResponse response = null;
		boolean result = false;
		HttpClient client = new DefaultHttpClient();
        HttpGet request = new HttpGet(tokenurl);
        request.addHeader("Cookie", sessionId);
        request.addHeader("Referer", "http://"+this.hostname +":80"+instanceNumber+REFERER_URI); 
        request.addHeader("X-CSRF-Token", "Fetch");   
        request.addHeader("X-Requested-With", "XMLHttpRequest");  
        try {
			response = client.execute(request);
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
        //printHttpResponse(response);
        StatusLine statusLine = response.getStatusLine();
		if (statusLine.getStatusCode() == 200) {
			extractTokenFromResponse(response);
			result = true;
		}
		client.getConnectionManager().shutdown();
		return result;
	}	
	
	private boolean sendPostWithAuthorization() {
		
		HttpResponse response = null;
		boolean result = false;
		UrlEncodedFormEntity entity = null;		
		HttpPost request = new HttpPost("http://"+this.hostname +":80"+instanceNumber+LOGIN_URI);
        request.addHeader("Content-Type", "application/json");
        request.addHeader("Cookie", sessionId);
        request.addHeader("Referer", sessionId);
        request.addHeader("X-CSRF-Token", xCSRFToken);
        request.addHeader("X-Requested-With", "XMLHttpRequest");
        request.addHeader("Content-Type", "application/x-www-form-urlencoded");
        List<NameValuePair> formparams = new ArrayList<NameValuePair>();
        formparams.add(new BasicNameValuePair("xs-username", this.username));
        formparams.add(new BasicNameValuePair("xs-password", this.password)); 
    	try {
			entity = new UrlEncodedFormEntity(formparams);
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}        
        request.setEntity(entity);
        HttpClient client = new DefaultHttpClient();
        try {
			response = client.execute(request);
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
        StatusLine statusLine = response.getStatusLine();
		if (statusLine.getStatusCode() == 200) {
			//System.out.println("Login Success...");
			result = true;
		}
        //printHttpResponse(response);
        client.getConnectionManager().shutdown();
        return result;
        
	}
	
	private void extractCookieFromResponse(HttpResponse response) {
		
		Header[] headers = response.getHeaders("set-cookie");
		String cookie =  headers[0].toString();
		String[] split1 = cookie.split(";");
		String split[]=split1[0].split(":");
		sessionId = split[1];
		//System.out.println("SessionId :" + sessionId);
	}	
	
	public void extractTokenFromResponse(HttpResponse response) {
		
		Header[] headers = response.getHeaders("x-csrf-token");
		String tokenHeader =  headers[0].toString();
		String[] split = tokenHeader.split(":");
		xCSRFToken=split[1];
		//System.out.println(" xCSRFToken:" + xCSRFToken);
	}
	
	@SuppressWarnings("unused")
	private void printHttpResponse(HttpResponse response) {
		
		HeaderIterator iter = response.headerIterator();
		System.out.println(response.getStatusLine());
		System.out.println("--------------------------");
		System.out.println("HTTP Header Information");
		System.out.println("--------------------------");
		while(iter.hasNext()) {
			System.out.println(iter.next());
		}
		System.out.println("--------------------------");
	}
}