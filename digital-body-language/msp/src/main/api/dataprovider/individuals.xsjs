$.import('${regi.rootPackage}.core.individual', 'dataaccess');

var dbutils = $.${regi.rootPackage}.core.individual.dataaccess.dbutils;
var schemaName = '${msp.schema}';
var tableName  = 'INDIVIDUAL';
var keyColumns = ['ID'];
var aCmd = $.request.parameters.get('cmd');

//Main
if(aCmd === 'create') {	
	dbutils.createFlexTable(schemaName,tableName);
	$.response.contentType = 'text/plain';
	$.response.status = $.net.http.OK;
	$.response.setBody('Table creation is successful. Table name : ' +tableName);
} else {	
	var httpMethod = $.request.method;
	switch(httpMethod) {
	 case $.net.http.POST:
		 var data=null;
		 var i=0;
		 var value =  $.request.body.asString();
		 var oData = JSON.parse(value);
		 if (Array.isArray(oData)) {
			 for(i=0;i<oData.length;i++){				 
				dbutils.insert(schemaName,tableName,oData[i]);
			 }
		 } else {
			 dbutils.insert(schemaName,tableName,oData);
		 } 
		 break;
	 case $.net.http.PUT :
		 var value =  $.request.body.asString();
		 var oData = JSON.parse(value);
		 dbutils.update(schemaName,tableName,oData,['ID']);
		 break;
	 default : 
		$.response.contentType = 'text/plain';
		$.response.status = $.net.http.OK;
		$.response.setBody('Not yet implemented : '+httpMethod);
	 }
}