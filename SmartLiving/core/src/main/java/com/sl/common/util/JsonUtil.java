package com.sl.common.util;

import java.io.IOException;
import java.util.Map;

import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

public class JsonUtil {

	private static Logger logger = Logger.getLogger(JsonUtil.class.getName());

	public static String toJsonString(final Map<String, Object> jsonMap) {
		String result = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			result = mapper.writeValueAsString(jsonMap);
		} catch (JsonMappingException ex) {
			logger.error(ex.getMessage());
		} catch (JsonGenerationException ex) {
			logger.error(ex.getMessage());
		} catch (IOException ex) {
			logger.error(ex.getMessage());
		}
		return result;
	}
	
	public static Map<String, Object> getMapFromJsonResponse(Response response) throws JsonParseException, JsonMappingException, IOException {
		@SuppressWarnings("unchecked")
		final GenericEntity<String> entity = (GenericEntity<String>) response.getEntity();
		ObjectMapper mapper = new ObjectMapper();
		return mapper.readValue(entity.getEntity(),	new TypeReference<Map<String, Object>>() {});
	}
}
