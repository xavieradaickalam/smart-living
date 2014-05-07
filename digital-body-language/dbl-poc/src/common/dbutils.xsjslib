function processResultSet(rs) {
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
        //result.push('No Results');
    }
    $.trace.info('Processing the result set - END');
    return result;
}

function executeSQL(sqlStmt,operation) {
  var result;
  try {
     if(sqlStmt === undefined || sqlStmt === null || sqlStmt.length === 0) {
         throw new Error('SQL statement is empty');
     }
     if(operation === undefined || operation === null || operation.length === 0) {
         throw new Error('Operation must be SELECT,INSERT,UPDATE or DELETE');
     }
     $.trace.info('EXECUTING SQL :' +sqlStmt);
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
             $.trace.info('SQL Success...');
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
}

function createFlexTable(schemaName,tableName) {
    var connection = $.db.getConnection();
    try {
        //executeSQL(connection, 'set schema "HS_DBLA" ', true);
        //executeSQL('DROP TABLE "'+ schemaName + '"."' + tableName + '"');
        executeSQL('CREATE COLUMN TABLE "' + schemaName + '"."' + tableName + '" ' +'("ID" NVARCHAR(256) NOT NULL, "NAME" NVARCHAR(256) NOT NULL,PRIMARY KEY ("ID", "NAME")) WITH SCHEMA FLEXIBILITY','CREATE');
    } catch (error) {
        $.trace.error('Error : Creating Flexitable');
        throw error;
    }                   
    connection.close(); 
}

function insertValues(schemaName,tableName,value) {   
    var input = value;
    var oData = JSON.parse(input);
    var sColumns='';
    var sValues='';
    var sKey = '';      
    if (oData === null) {
        $.trace.error("no request object");     
        $.response.status = $.net.http.BAD_REQUEST;
        $.response.setBody('Input json expected...');       
    } else {        
        for(sKey in oData) {
            if(oData.hasOwnProperty(sKey)) {
				sColumns = sColumns + sKey + ',';
				if (sKey === 'ID') {
					sValues = sValues + oData[sKey] + ',';
				} else {
					sValues = sValues + "\'" + oData[sKey] + "\'" + ',';
				}
            }
        }     
        // Remove the last char from string...
        sColumns = sColumns.replace(/(\s+)?.$/, '');
        sValues = sValues.replace(/(\s+)?.$/, '');
        var insertStmt = 'INSERT INTO "'+ schemaName + '"."' + tableName +'" (' +sColumns + ') VALUES (' + sValues + ')'; 
        $.trace.info('INSERT STMT :' + insertStmt);
        executeSQL(insertStmt,'INSERT');
        $.response.contentType = "text/plain";
        $.response.status = $.net.http.OK;
        $.response.setBody('Insert is successful...');  
    }
}

function updateValues(schemaName,tableName,keyColumns) {
  var updatesql = '';
  var whereCon = '';
  var i=0;
  var sKey = '';
  //var value = '';
  var sql = 'UPDATE  "'+ schemaName + '"."' + tableName + '" SET ';  
  var input = $.request.body.asString();
  var oData = JSON.parse(input);  
  $.trace.info('UPDATE JSON : ' + input);
  
  if (oData === null) {
        $.trace.error("no request object");     
        $.response.status = $.net.http.BAD_REQUEST;
        $.response.setBody('Input json expected...');       
   } else {
       for(sKey in oData) {        
           if(oData.hasOwnProperty(sKey)) {
                $.trace.info('sKey   :' + sKey);
                //if($.inArray(sKey,keyColumns)) {
                if(keyColumns.indexOf(sKey) === 0 ) {
                    continue;
                } else {
                    updatesql += '"' + sKey + '" = ';
                    //value = oData[sKey];
                    updatesql = updatesql + '\'' +  oData[sKey] + '\'' + ',';
                /**
                    if (isNaN(value)) {
                        updatesql = updatesql + '"' +  oData[sKey] + '"' + ',';
                    } else {
                        updatesql += value + ', ';
                    }*/
                }               
            }
       }
       $.trace.info('UPDATE SQL :' + updatesql);
       updatesql = updatesql.replace(/(\s+)?.$/, '');
       sql = sql + updatesql;      
       for(i = 0; i < keyColumns.length;i++) {
           whereCon = whereCon + ' "'+ keyColumns[i] + '"'+  ' = \'' + oData[keyColumns[i]] + '\'';
           /*
           if (isNaN(oData[keyColumns[i]])) {
             whereCon = whereCon + ' "'+ keyColumns[i] + '"'+  ' = "' + oData[keyColumns[i]] + '" ';
           } else {
               whereCon = whereCon + ' "'+ keyColumns[i] + '"'+  ' = ' + oData[keyColumns[i]];
           }*/
           if (i === (keyColumns.length -1)) {
              continue;   
           } else {
               whereCon = whereCon + ' AND';
           }
       }
        sql = sql + '  WHERE  ' + whereCon;
        $.trace.info('UPDATE STMT :' + sql);
        executeSQL(sql,'UPDATE');
        $.response.contentType = "text/plain";
        $.response.status = $.net.http.OK;
        $.response.setBody('Update is success full');   
    }
}

function getDataset(schemaName,tableName) {
    
    var sql = 'SELECT * FROM "'+ schemaName + '"."' + tableName + '"';
    var conn = $.db.getConnection();
    var pstmt = conn.prepareStatement(sql);
    var rs = pstmt.executeQuery();
    var result = [];
    
    if (rs.next()) {
        var meta = rs.getMetaData();
        var colCount = meta.getColumnCount();
        var fName, fType, i;
        do {
            var recObj = {};
            for (i = 1; i <= colCount; i++) {
                fName = meta.getColumnLabel(i);
                fType = meta.getColumnType(i);
                switch (fType) {
                case 9: // string
                case 11: // string
                    recObj[fName] = rs.getString(i);
                    break;
                case 3: // string
                    recObj[fName] = rs.getInteger(i);
                    break;
                default:
                    //throw "Unrecognised Field Type: " + fType;
                    recObj[fName] = rs.getString(i);
                }
            }
            result.push(recObj);
        } while (rs.next());
    } else {
        result.push("Empty");
    }
    rs.close();
    pstmt.close();
    $.response.setBody('{ "root": '+ JSON.stringify(result) + '}');
    $.response.contentType = "application/json";
    $.response.status = $.net.http.OK;  
}

function getTableData(schemaName,tableName) {    
    var conn,sql,pstmt,rs,result=[];
    try {
        sql = 'SELECT * FROM "'+ schemaName + '"."' + tableName + '"';
        conn = $.db.getConnection();
        pstmt = conn.prepareStatement(sql);
        rs = pstmt.executeQuery();
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
                    case $.db.types.FLOAT:
                        recObj[colName] = rs.getFloat(i);
                        break;
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
            $.trace.info('getTableData : No results :' + schemaName + '.' + tableName);
            //result.push('No Results');
        }     
    } catch (e) {
      $.trace.error('getTableData : Exception occured while executing  SQL :' + schemaName + '.' + tableName);  
      throw e;  
    } finally {
        rs.close();
        pstmt.close();
    }
    var resultStr = '{ "root": '+ JSON.stringify(result) + '}';
    return resultStr;
}
