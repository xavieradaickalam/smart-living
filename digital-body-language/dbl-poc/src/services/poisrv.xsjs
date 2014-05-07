$.import('${regi.rootPackage}.common', 'geoloc');

var httpMethod = $.request.method;

switch(httpMethod) {
        case $.net.http.GET  :
            var result = $.${regi.rootPackage}.common.geoloc.getAllPOIs();
            $.response.contentType = 'application/json';
            $.response.status = $.net.http.OK;
            $.response.setBody(result);
            break;
        default :       
            $.response.contentType = 'text/plain';
            $.response.status = $.net.http.OK;
            $.response.setBody('Not yet implemented : '+httpMethod);
}