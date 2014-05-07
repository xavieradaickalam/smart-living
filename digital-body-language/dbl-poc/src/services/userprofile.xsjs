$.import('${regi.rootPackage}.common', 'dbutils');

var dbutils = $.${regi.rootPackage}.common.dbutils;
var schemaName = '${dbl.schema}';
var tableUserStatic  = '${regi.rootPackage}.db.tables::USER_STATIC';
var keyColumns = ["ID","NAME"];

var aCmd = $.request.parameters.get("cmd");
var name = $.request.parameters.get("name");

function getUserProfile(schemaName,tableName,name) {    
    var sql = 'SELECT * FROM "'+schemaName+'"."'+tableName+'"'+' WHERE NAME=\'' + name + '\'';
    $.trace.info('SQL:' + sql);
    var result = dbutils.executeSQL(sql,'SELECT');
    if(result !== undefined && result.length > 0) {
        $.response.contentType = 'application/json';
        $.response.status = $.net.http.OK;
        $.response.setBody(JSON.stringify(result[0]));
    } else {
        $.trace.info('result : No data found');
        $.response.contentType = 'application/json';
        $.response.status = $.net.http.OK;
        $.response.setBody('{ RESULT : "NO DATA FOUND" }');
    }
}

function insert(schemaName,tableName,value) {   
    var input = value;
    var oData = JSON.parse(input);
    var sColumns='';
    var sValues='';
    var sKey = '';
    var result = [];
    if (oData === null) {
        $.trace.error("no request object");     
        $.response.status = $.net.http.BAD_REQUEST;
        result.push('ERROR PARSING INPUT JSON');
        $.response.setBody(JSON.stringify(result));       
    } else {        
        for(sKey in oData) {
            if(oData.hasOwnProperty(sKey)) {
                sColumns = sColumns + sKey + ',';
                sValues = sValues + "\'" + oData[sKey] + "\'" + ',';
            }
        }
        sColumns = sColumns + 'UPDATED_TIME,';
        sValues = sValues + 'CURRENT_UTCTIMESTAMP,';
        sColumns = sColumns + 'ID';
        sValues = sValues + 'SYSUUID';
        //sValues = sValues + '"' + schemaName + '"."USER_STATIC_SEQ".NEXTVAL';        
        //Remove the last char from string...
        //remove the comma end of stmt
        //sColumns = sColumns.replace(/(\s+)?.$/, '');
        //sValues = sValues.replace(/(\s+)?.$/, '');
        var insertStmt = 'INSERT INTO "'+ schemaName + '"."' + tableName +'" (' +sColumns + ') VALUES (' + sValues + ')'; 
        $.trace.info('INSERT SQL:' + insertStmt);
        var count = dbutils.executeSQL(insertStmt,'INSERT');
        if(count === 1) {
            var name = oData.NAME;
            var sql = 'SELECT ID,NAME,UPDATED_TIME FROM "'+schemaName+'"."'+tableName+'"'+' WHERE NAME=\'' + name + '\'';
            $.trace.info('SQL:' + sql);
            result = dbutils.executeSQL(sql,'SELECT');
        }
        $.response.contentType = 'application/json';
        $.response.status = $.net.http.OK;
        $.response.setBody(JSON.stringify(result[0]));  
    }
}

//Main
if(aCmd === 'create') {	
	dbutils.createFlexTable(schemaName,tableUserStatic);
	$.response.contentType = "text/plain";
	$.response.status = $.net.http.OK;
	$.trace.debug('userprofile.xsjs : Flexitable created sucuessfully....');
	$.response.setBody('userprofile.xsjs : Flexitable created sucuessfully....');	
} else {	
	var httpMethod = $.request.method;
	switch(httpMethod) {
	 case $.net.http.GET  :
	     if(name === undefined || name.length === 0 ) {
	         dbutils.getDataset(schemaName,tableUserStatic);
	     } else {
	         getUserProfile(schemaName,tableUserStatic,name);
	     }
		 break;
	 case $.net.http.POST :
		 var value =  $.request.body.asString();
		 insert(schemaName,tableUserStatic,value); 
		 break;
	 case $.net.http.PUT  : 
		 dbutils.updateValues(schemaName,tableUserStatic,keyColumns); break;
	 //case $.net.http.DEL  : updateUserProfile(); break; 
	 default : 
		$.response.contentType = 'text/plain';
		$.response.status = $.net.http.OK;
		$.response.setBody('userprofile.xsjs : Not yet implemented : '+httpMethod);
	 }
}