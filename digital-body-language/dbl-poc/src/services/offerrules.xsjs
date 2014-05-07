$.import('${regi.rootPackage}.common', 'dbutils');
$.import('${regi.rootPackage}.common', 'utils');

var dbutils = $.${regi.rootPackage}.common.dbutils;
var utils = $.${regi.rootPackage}.common.utils;

var schemaName = '${dbl.schema}';
var tableName  = '${regi.rootPackage}.db.tables::DIM_OFFERS';
var httpMethod = $.request.method;

function insert(schemaName,tableName,value) {    
    var sColumns='';
    var sValues = '';
    var sKey='';
    var oData = JSON.parse(value);
    $.trace.info('After Parsing Input Json :' + JSON.stringify(oData));
    if (oData === null) {
        $.trace.error("no request object");     
        $.response.status = $.net.http.BAD_REQUEST;
        $.response.setBody('Input json expected...');       
    } else {
        oData.ID = utils.generateUUID();
        for(sKey in oData) {
            if(oData.hasOwnProperty(sKey)) {
                sColumns = sColumns + sKey + ',';
                sValues = sValues + "\'" + oData[sKey] + "\'" + ',';
            }
        }
        //Romove the comma at end
        sColumns = sColumns.replace(/(\s+)?.$/, '');
        sValues = sValues.replace(/(\s+)?.$/, '');
        try {
            var insertStmt = 'INSERT INTO "'+ schemaName + '"."' + tableName +'" (' +sColumns + ') VALUES (' + sValues + ')'; 
            $.trace.debug('INSERT SQL:' + insertStmt);
            var count = dbutils.executeSQL(insertStmt,'INSERT');
            $.trace.info('Rows affected :' + count);
            if(count === 1) {
                $.response.contentType = "text/plain";
                $.response.status = $.net.http.OK;
                $.response.setBody('Created DIM. No of rows inserted :' + count);
            } else {
                $.response.contentType = "text/plain";
                $.response.status = $.net.http.OK;
                $.response.setBody('Rows affected :' + count);
            }
        } catch (e) {
            $.response.contentType = "text/plain";
            $.response.status = $.net.http.BAD_REQUEST;
            $.response.setBody('SQL Error' + e);
        }
    }
}
//Main
switch(httpMethod) {
 case $.net.http.GET:
     $.trace.info('HTTPMETHOD GET');
     var result = dbutils.getDataset(schemaName,tableName);
     break;
 case $.net.http.POST:
     $.trace.info('HTTPMETHOD POST');
     if($.request.body === undefined) {
         $.response.contentType = 'text/plain';
         $.response.status = $.net.http.BAD_REQUEST;
         $.response.setBody('INPUT JSON REQUIRED');             
     } else {
         var value =  $.request.body.asString();
         $.trace.info("Before Parsing JSON : " + value);
         insert(schemaName,tableName,value);
     }       
     break;
 case $.net.http.PUT: 
     $.trace.info('HTTPMETHOD PUT');
     break; 
 case $.net.http.DEL: 
     $.trace.info('HTTPMETHOD PUT');
     break;     
 default : 
    $.response.contentType = 'text/plain';
    $.response.status = $.net.http.OK;
    $.response.setBody('offerrules.xsjs : Not yet implemented : '+httpMethod);
 }