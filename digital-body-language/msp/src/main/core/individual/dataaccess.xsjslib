var dbutils = {
		
	processResultSet : function (rs) {
		
	    $.trace.info('Processing the result set - START');
	    var result=[];
	    if(rs === undefined || rs === null) {
	        result.push('No Results');
	        return result;
	    }
	    if (rs.next()) {
	        var meta = rs.getMetaData();
	        var colCount = meta.getColumnCount();
	        var colName, colType, i;
	        do {
	            var recObj = {};
	            for (i = 1; i <= colCount; i++) {
	                colName = meta.getColumnLabel(i);
	                colType = meta.getColumnType(i);
	                switch (colType) {
	                case $.db.types.CHAR: 
	                case $.db.types.VARCHAR:    
	                    recObj[colName] = rs.getString(i);
	                    break;
	                case $.db.types.NCHAR:
	                case $.db.types.NVARCHAR: 
	                case $.db.types.SHORTTEXT:    
	                    recObj[colName] = rs.getNString(i);
	                    break;                        
	                case $.db.types.INT: 
	                case $.db.types.TINYINT:
	                case $.db.types.SMALLINT:
	                case $.db.types.BIGINT:
	                case $.db.types.INTEGER:
	                    recObj[colName] = rs.getInteger(i);
	                    break;                        
	              /*  case $.db.types.FLOAT:
	                    recObj[colName] = rs.getFloat(i);
	                    break;
	              */ 
	                case $.db.types.DOUBLE:
	                    recObj[colName] = rs.getDouble(i);
	                    break;
	                default:
	                    recObj[colName] = rs.getString(i);
	                }
	            }
	            result.push(recObj);
	        } while (rs.next());
	    } else {
	        $.trace.info('processResultSet : No results');
	    }
	    $.trace.info('Processing the result set - END');
	    return result;
	},
	
	executeSQL : function (sqlStmt,operation) {
		 var result;
		 try {
		     if(sqlStmt === undefined || sqlStmt === null || sqlStmt.length === 0) {
		         throw new Error('SQL statement is empty');
		     }
			 if(operation === undefined || operation === null || operation.length === 0) {
			     throw new Error('Operation must be SELECT,INSERT,UPDATE or DELETE');
			 }
			 $.trace.debug('EXECUTING SQL :' +sqlStmt);
			 var conn = $.db.getConnection();
			 var pstmt = conn.prepareStatement(sqlStmt);
			 switch(operation) {
			     case 'INSERT':
			     case 'UPDATE':
			     case 'DELETE':
			         result = pstmt.executeUpdate();
			         break;
			     case 'SELECT':
			             var resultSet = pstmt.executeQuery();
			             result = processResultSet(resultSet);
			             break;
			         default :
			             result = pstmt.execute();
			     }     
			     pstmt.close();
			     conn.commit();
			     conn.close();
		  } catch (error) {
		      $.trace.error("Error executing the sql :" + sqlStmt);
		      throw error;
		  }
		  return result;  
	},
	
	createFlexTable : function (schemaName,tableName) {
	    var connection = $.db.getConnection();
	    try {
	        this.executeSQL('CREATE COLUMN TABLE "' + schemaName + '"."' + tableName + '" ' +'("ID" NVARCHAR(256) NOT NULL,PRIMARY KEY ("ID")) WITH SCHEMA FLEXIBILITY','CREATE');
	    } catch (error) {
	        $.trace.error('Error : Creating Flexitable');
	        throw error;
	    }                   
	    connection.close(); 
	},

	insert : function (schemaName,tableName,value) {   
	    var oData = value;
	    var sColumns='';
	    var sValues='';
	    var result = 0;
	    var sKey = '';      
	    if (oData === null) {
	        $.trace.error("no request object");     
	        $.response.status = $.net.http.BAD_REQUEST;
	        $.response.setBody('Input json expected...');       
	    } else {        
	        for(sKey in oData) {
	            if(oData.hasOwnProperty(sKey)) {
					sColumns = sColumns + sKey + ',';
	            }
	        }     
	        sColumns = sColumns.replace(/(\s+)?.$/, '');
	        sValues = sValues.replace(/(\s+)?.$/, '');
	        var insertStmt = 'INSERT INTO "'+ schemaName + '"."' + tableName +'" (' +sColumns + ') VALUES (' + sValues + ')'; 
	        $.trace.info('INSERT STMT :' + insertStmt);
	        result = this.executeSQL(insertStmt,'INSERT');
	        $.response.contentType = "text/plain";
	        $.response.status = $.net.http.OK;
	        $.response.setBody('inserted ' + result + 'rows');
	    }
	},

	update : function (schemaName,tableName,oData,keyColumns) {
		
	  var updatesql = '';
	  var whereCon = '';
	  var i=0;
	  var sKey = '';
	  var sql = 'UPDATE  "'+ schemaName + '"."' + tableName + '" SET ';  
	  if (oData === null) {
	        $.trace.error("no request object");     
	        $.response.status = $.net.http.BAD_REQUEST;
	        $.response.setBody('Input json expected...');       
	   } else {
	       for(sKey in oData) {        
	           if(oData.hasOwnProperty(sKey)) {
	                if(keyColumns.indexOf(sKey) === 0 ) {
	                    continue;
	                } else {
	                    updatesql += '"' + sKey + '" = ';
	                    updatesql = updatesql + '\'' +  oData[sKey] + '\'' + ',';
	                }               
	            }
	       }
	       updatesql = updatesql.replace(/(\s+)?.$/, '');
	       sql = sql + updatesql;      
	       for(i = 0; i < keyColumns.length;i++) {
	           whereCon = whereCon + ' "'+ keyColumns[i] + '"'+  ' = \'' + oData[keyColumns[i]] + '\'';
	           if (i === (keyColumns.length -1)) {
	              continue;   
	           } else {
	               whereCon = whereCon + ' AND';
	           }
	       }
	        sql = sql + '  WHERE  ' + whereCon;
	        var result = this.executeSQL(sql,'UPDATE');
	        $.response.contentType = "text/plain";
	        $.response.status = $.net.http.OK;
	        $.response.setBody('Success. Updated rows :' +result);   
	    }
	}
};