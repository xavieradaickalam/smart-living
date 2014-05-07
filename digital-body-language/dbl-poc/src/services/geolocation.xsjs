$.import('${regi.rootPackage}.common', 'geoloc');

var longitude = $.request.parameters.get("longitude");
var latitude = $.request.parameters.get("latitude");

var httpMethod = $.request.method;

if(longitude !== undefined && latitude !== undefined) {
	
	switch(httpMethod) {
		case $.net.http.GET  :
			$.${regi.rootPackage}.common.geoloc.matchGeoLocation(latitude,longitude);
			break;
		case $.net.http.POST : 
			$.response.contentType = 'text/plain';
			$.response.status = $.net.http.OK;
			$.response.setBody('POST Method : Not yet implemented :'+httpMethod);
			break;
		default :		
			$.response.contentType = 'text/plain';
			$.response.status = $.net.http.OK;
			$.response.setBody('Not yet implemented : '+httpMethod);
	 }
} else {	
	$.response.contentType = 'text/plain';
	$.response.status = $.net.http.OK;
	$.response.setBody('longitude and latitide is requried....');
}