package com.sap.msp.fixtures.utils;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;

/**
 * 
 * @author i057588
 *
 */
public class HttpUtils {
	
	private String sessionId;
	private String xCSRFToken;
	
	public HttpResponse post(String url,String payload) {
		
		HttpResponse response = null;
		StringEntity entity = null;
        HttpPost request = new HttpPost(url);
        request.addHeader("Content-Type", "application/json");
        request.addHeader("Cookie", sessionId);
        request.addHeader("X-CSRF-Token", xCSRFToken);        
		try {
			entity = new StringEntity(payload);
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}
        entity.setContentType("application/json");
        request.setEntity(entity);
        HttpClient client = new DefaultHttpClient();
        try {
			response = client.execute(request);
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
        return response; 
		
	}	
	
	public HttpResponse put(String url,String payload) {
		
		HttpResponse response = null;
		StringEntity entity = null;
        HttpPut request = new HttpPut(url);
        request.addHeader("Content-Type", "application/json");
        request.addHeader("Cookie", sessionId);
        request.addHeader("X-CSRF-Token", xCSRFToken);        
		try {
			entity = new StringEntity(payload);
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}
        entity.setContentType("application/json");
        request.setEntity(entity);
        HttpClient client = new DefaultHttpClient();
        try {
			response = client.execute(request);
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
        return response; 
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	public void setxCSRFToken(String xCSRFToken) {
		this.xCSRFToken = xCSRFToken;
	}
}
