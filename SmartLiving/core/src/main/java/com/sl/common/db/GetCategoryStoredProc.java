package com.sl.common.db;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.naming.NamingException;

import org.apache.log4j.Logger;

public class GetCategoryStoredProc {
	
	private static final Logger logger =  Logger.getLogger(GetCategoryStoredProc.class.getName());
	
	public Map<String,Object> execute() throws SQLException {
		Connection connection = null;
		Map<String,Object> result = null;
		Statement stmt = null;
		try {
			connection = ConnectionManager.getInstance().getJNDIConnection("XAVIERAD1", "Initial2");
			stmt = connection.createStatement();
			boolean isResultAvailable = stmt.execute("SELECT * FROM \"XDB\".\"CATEGORY\"");
			result = processResultSet(stmt, isResultAvailable);		
		} catch (NamingException e) {
			e.printStackTrace();
			logger.error(e.getMessage());
		} catch (SQLException e) {
			e.printStackTrace();
			logger.error(e.getMessage());
		} finally {
			if(stmt != null) {
				stmt.close();
			}
			if(connection != null) {
				connection.close();
			}
		}
		return result;
	}	
	private Map<String,Object> processResultSet(final Statement stmt,boolean isResultAvailable) throws SQLException {
		List<Map<String,Object>> data = new ArrayList<Map<String,Object>>();
		if (isResultAvailable) {
			final ResultSet rs = stmt.getResultSet();
			while (rs.next()) {
				Map<String,Object> row = new HashMap<String,Object>();
				row.put("id", rs.getString("ID"));
				row.put("name",rs.getString("NAME"));
				row.put("displayName",rs.getString("DISPLAY_NAME"));
				data.add(row);
			}
			rs.close();
		}
		Map<String,Object> result = new HashMap<String,Object>();
		result.put("categories",data);
		return result;
	}
}
