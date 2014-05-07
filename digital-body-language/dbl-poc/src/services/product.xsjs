$.import('${regi.rootPackage}.common', 'dbutils');


var dbutils = $.${regi.rootPackage}.common.dbutils;


function getProductDetails(productName) {
    
    var sql = 'SELECT * FROM "${dbl.schema}"."${regi.rootPackage}.db.tables::PRODUCT" WHERE PRODUCT_NAME = \'' + productName + '\'';
    var result = dbutils.executeSQL(sql, 'SELECT');
    return JSON.stringify(result[0]);
}


var httpMethod = $.request.method;
switch(httpMethod) {
        case $.net.http.GET  :
            var productName = $.request.parameters.get("productname");
            $.trace.info("Product Name : " + productName);
            var result = getProductDetails(productName);
            $.response.contentType = 'application/json';
            $.response.status = $.net.http.OK;
            $.response.setBody(result);
            break;
        default :       
            $.response.contentType = 'text/plain';
            $.response.status = $.net.http.OK;
            $.response.setBody('Not yet implemented : '+httpMethod);
}