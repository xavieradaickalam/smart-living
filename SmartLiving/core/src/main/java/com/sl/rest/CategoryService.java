package com.sl.rest;

import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;

import com.sl.common.db.GetCategoryStoredProc;
import com.sl.common.util.JsonUtil;

@Path("/cs/")
public class CategoryService {
	
	private static final Logger logger =  Logger.getLogger(CategoryService.class.getName());
	
	@GET
	@Path("/all")
	public Response getAllCategories() {
		String jsonString = null;
		GetCategoryStoredProc st = new GetCategoryStoredProc();
		try {
			Map <String,Object> categories = st.execute();
			jsonString = JsonUtil.toJsonString(categories);			
		} catch (Exception e) {
			e.printStackTrace();
		}
		final GenericEntity<String> entity = new GenericEntity<String>(jsonString) {}; 
		return Response.ok(entity).build();
	}	
}