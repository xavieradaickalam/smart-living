$.import('${regi.rootPackage}.common', 'dbutils');
$.import('${regi.rootPackage}.common', 'geoloc');
$.import('${regi.rootPackage}.common', 'offermanager');

var dbutils = $.${regi.rootPackage}.common.dbutils;
var geoloc = $.${regi.rootPackage}.common.geoloc;
var offermanager = $.${regi.rootPackage}.common.offermanager;

var schemaName = '${dbl.schema}';
var tableName  = '${regi.rootPackage}.db.tables::USER_TEMPORAL';

function deleteData(schemaName,tableName,value) {
    var sql = 'DELETE FROM "'+ schemaName + '"."' + tableName + '"';
    var oData = JSON.parse(value);
    if (oData === undefined || oData === null ) {
          $.trace.error('Error parsing JSON. Invalid input JSON :'  + value);
          $.response.status = $.net.http.BAD_REQUEST;
          $.response.setBody('Error parsing JSON. Invlaid input JSON');
     } else {
         var whereCon = '';
         var sKey = '';
         for(sKey in oData) {
             if(oData.hasOwnProperty(sKey)) {
                  whereCon += '"' + sKey + '" = ' + '\'' +  oData[sKey] + '\' AND ';
             }
         }
         //Remove the last AND
         var con = whereCon.substring(0,whereCon.lastIndexOf('AND '));
         $.trace.info('substring : ' + con);
         sql = sql + ' WHERE ' + con;
         $.trace.info('DELETE SQL :' + sql);
         var count = dbutils.executeSQL(sql,'DELETE');
         $.trace.info('Rows affected :' + count);
         if(count > 0) {
             $.response.contentType = "text/plain";
             $.response.status = $.net.http.OK;
             $.response.setBody('Delete Successful. No of rows deleted :' + count);
         } else {
             $.response.contentType = "text/plain";
             $.response.status = $.net.http.OK;
             $.response.setBody('Does not match any records to delete. rows dleted :' + count);
         }
     }
}
function update(schemaName,tableName,keyColumns,value) {
    
    var updatesql = '';
    var whereCon = '';
    var i = 0;
    var sKey = '';
    var sql = 'UPDATE  "'+ schemaName + '"."' + tableName + '" SET ';
    var oData = JSON.parse(value);
    if (oData === undefined || oData === null ) {
          $.trace.error('Error parsing JSON. Invalid input JSON :'  + value);
          $.response.status = $.net.http.BAD_REQUEST;
          
          $.response.setBody('Error parsing JSON. Invlaid input JSON');
     } else {
         for(sKey in oData) {        
             if(oData.hasOwnProperty(sKey)) {
                  if(keyColumns.indexOf(sKey) !== 0 ) {
                      updatesql += '"' + sKey + '" = ';
                      if (isNaN(oData[sKey])) {
                          updatesql = updatesql + '\'' +  oData[sKey] + '\'' + ',';
                      } else {
                          updatesql += value + ', ';
                      }
              }
             }
         }         
         updatesql += '"EVENT_TIME" = CURRENT_UTCTIMESTAMP' ;
         //$.trace.info('UPDATE PART SQL :' + updatesql);
         //updatesql = updatesql.replace(/(\s+)?.$/, '');
         sql = sql + updatesql;      
         for(i = 0; i < keyColumns.length;i++) { 
             whereCon = whereCon + ' "'+ keyColumns[i] + '"'+  " = '" + oData[keyColumns[i]] + "'";
             /**
             if (isNaN(oData[keyColumns[i]])) {
               whereCon = whereCon + ' "'+ keyColumns[i] + '"'+  ' = "' + oData[keyColumns[i]] + '" ';
             } else {
                 whereCon = whereCon + ' "'+ keyColumns[i] + '"'+  ' = ' + oData[keyColumns[i]];
             }
             */
             if (i === (keyColumns.length-1)) {
                continue;   
             } else {
                 whereCon = whereCon + ' AND';
             }
          }
          sql = sql + '  WHERE  ' + whereCon;
          $.trace.info('UPDATE FINAL SQL :' + sql);
          var count = dbutils.executeSQL(sql,'UPDATE');
          $.trace.info('Rows affected :' + count);
          if(count === 1) {
              $.response.contentType = "text/plain";
              $.response.status = $.net.http.OK;
              $.response.setBody('Update is successfull. No of rows updated :' + count);
          } else {
              $.response.contentType = "text/plain";
              $.response.status = $.net.http.OK;
              $.response.setBody('rows updated :' + count);
          }
      }
}

function IsUserExists(id,name) {
    var user_exists = false ; 
    var user_static_sql = 'SELECT * FROM "${dbl.schema}"."${regi.rootPackage}.db.tables::USER_STATIC" WHERE ID = \'' + id + '\' AND NAME = \'' + name + '\'';
    var user_profiles = dbutils.executeSQL(user_static_sql, 'SELECT');
    if(user_profiles !== undefined && user_profiles !== null && user_profiles.length === 1) {
         user_exists = true;
    }
    return user_exists;
}

function insert(schemaName,tableName,value) {
	    
    var sColumns='';
    var sValues = '';
    var sKey='';
    var geoLocation = '';
    var oData = JSON.parse(value);
    var geoLocationMatch = false;
    
    if (oData === null) {
        $.trace.error("no request object");     
        $.response.status = $.net.http.BAD_REQUEST;
        $.response.setBody('Input json expected');
    } else {
        /*
         *  Check the users already registered 
         */
        if(IsUserExists(oData.ID,oData.USERNAME) === false) {
            $.response.contentType = "text/plain";
            $.response.status = $.net.http.BAD_REQUEST;
            $.response.setBody('User is not registered :' + oData. ID + ' :' + oData.USERNAME);
            return;
        }
        
        if(oData.EVENT === 'locationUpdate') {
            var latLng = oData.DATA.split(',');
            $.trace.info('LatLng :' +latLng);
            var poiId = geoloc.isInsidePolygon(parseFloat(latLng[1]),parseFloat(latLng[0]));
            $.trace.info('POI ID :' +poiId);
            if(poiId === undefined) {
                $.response.contentType = "text/plain";
                $.response.status = $.net.http.OK;
                $.response.setBody('Geo coodinates does not match any point of interest');
                return; 
            } else {
                $.trace.info('Matched Point of id :' +oData.DATA);
                oData.DATA = geoloc.getPOI(poiId);
                $.trace.info('POI :' +oData.DATA);
                geoLocationMatch = true;
            }
        }
        //This works only for varchar and nvarchar columns
        for(sKey in oData) {
            if(oData.hasOwnProperty(sKey)) {
                sColumns = sColumns + sKey + ',';
                sValues = sValues + "\'" + oData[sKey] + "\'" + ',';
            }
        }
        sColumns = sColumns + 'EVENT_TIME';
        sValues = sValues + 'CURRENT_UTCTIMESTAMP';  
        //sColumns = sColumns.replace(/(\s+)?.$/, '');
        //sValues = sValues.replace(/(\s+)?.$/, '');
        try {
            var sqlStmt = null;
            if (oData.EVENT === 'locationUpdate') {
                if(geoLocationMatch === true) {
                    sqlStmt = 'UPSERT "' + schemaName + '"."' + tableName + '" (' + sColumns + ') VALUES (' + sValues + ') WHERE EVENT=\'locationUpdate\' AND ID = \'' + oData.ID + '\'';
                } 
            } else if( oData.EVENT === 'socialScore') {
                sqlStmt = 'UPSERT "' + schemaName + '"."' + tableName + '" (' + sColumns + ') VALUES (' + sValues + ') WHERE EVENT=\'socialScore\' AND ID = \'' + oData.ID + '\'';
            } else {
                sqlStmt = 'INSERT INTO "' + schemaName + '"."' + tableName + '" (' + sColumns + ') VALUES (' + sValues + ')';
            }
            $.trace.debug('SQL:' + sqlStmt);
            if(sqlStmt !== null) {
                var count = dbutils.executeSQL(sqlStmt, 'INSERT');
                if (count === 1) {
                    $.response.contentType = "text/plain";
                    $.response.status = $.net.http.OK;
                    $.trace.debug('User Dynamic data stored successfully. No of rows inserted :' + count);
                    var offerText = offermanager.createOffers(oData.ID);
                    if (offerText !== undefined && offerText.length > 0) {
                        $.response.setBody(JSON.stringify(offerText));
                    } 
                } else {
                    $.response.contentType = "text/plain";
                    $.response.status = $.net.http.OK;
                    $.response.setBody('Rows updated :' + count);
                }
           }
        } catch (e) {
            $.response.contentType = "text/plain";
            $.response.status = $.net.http.BAD_REQUEST;
            $.response.setBody('SQL Error :' + e);
        }
    }
}
/**
 *  Main
 */
var httpMethod = $.request.method;
switch(httpMethod) {
     case $.net.http.GET :
         $.trace.info('HTTPMETHOD GET...');
         dbutils.getDataset(schemaName,tableName);
         break;
     case $.net.http.POST :
         if($.request.body === undefined) {
             $.response.contentType = 'text/plain';
             $.response.status = $.net.http.BAD_REQUEST;
             $.response.setBody('INPUT JSON REQUIRED');
         } else {
             var value =  $.request.body.asString();
             $.trace.info('JSON : ' + value);
             var inputData = JSON.parse(value);
             if(inputData.EVENT === 'locationUpdate') {
                 $.response.contentType = 'text/plain';
                 $.response.status = $.net.http.OK;
                 //$.response.setBody('Location Update is ignored for a SAPPHIRE Demo purposes');
             } else {
                 insert(schemaName,tableName,value);
                 if(inputData.EVENT === 'wishes' || inputData.EVENT === 'socialScore') {
                     var geo = {};
                     geo.ID = inputData.ID;
                     geo.USERNAME = inputData.USERNAME;
                     geo.CATEGORY = 'GEOLOCATION';
                     geo.EVENT = 'locationUpdate';
                     geo.DATA  = '-81.46175049999999,28.4286755';
                     var geoData = JSON.stringify(geo);
                     insert(schemaName,tableName,geoData);
                 }
             }
         }
         break;
     case $.net.http.PUT:
         $.trace.info('HTTPMETHOD PUT...');
         if($.request.body === undefined) {
             $.response.contentType = 'text/plain';
             $.response.status = $.net.http.BAD_REQUEST;
             $.response.setBody('INPUT JSON REQUIRED');
         } else {
             var value =  $.request.body.asString();
             $.trace.info("JSON : " + value);
             var keyColumns = ['ID'];
             update(schemaName,tableName,keyColumns,value);
         }
         break;
     case $.net.http.DEL:
         $.trace.info('HTTPMETHOD DELETE...');  
         if($.request.body === undefined) {
             $.response.contentType = 'text/plain';
             $.response.status = $.net.http.BAD_REQUEST;
             $.response.setBody('INPUT JSON REQUIRED');
         } else {
             var value =  $.request.body.asString();
             $.trace.info("JSON : " + value);
             deleteData(schemaName,tableName,value);
         }    
         break;
     default :
        $.trace.info('NOT IMPLEMENTED HTTPMETHOD...');
        $.response.contentType = 'text/plain';
        $.response.status = $.net.http.OK;
        $.response.setBody('userdynamic.xsjs : Not yet implemented : '+httpMethod);
 }