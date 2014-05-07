$.import('${regi.rootPackage}.common', 'twitter');

var twitter = $.${regi.rootPackage}.common.twitter;
var httpMethod = $.request.method;
var topic = $.request.parameters.get('topic');
$.trace.info('TOPIC :' + topic);
if(topic !== undefined && topic !== null) {  
  switch(httpMethod) {    
  case $.net.http.GET : 
	 var data = twitter.getSentiment(topic);	 
     $.response.contentType = 'text/plain';
	 $.response.status = $.net.http.OK;
	 $.response.setBody('success');	 
	 break;	 
  default :	 
	$.response.contentType = 'text/plain';
    $.response.status = $.net.http.OK;
    $.response.setBody('twittersrv.xsjs : Not yet Implemented . Wrong HTTP Method : ' + httpMethod);
  }
} else {	
	$.response.contentType = 'text/plain';
	$.response.status = $.net.http.BAD_REQUEST;
	$.response.setBody('Request Param : topic is required to get twitter feed ');
}