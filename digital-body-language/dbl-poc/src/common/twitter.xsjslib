//Imported libraries
$.import('${regi.rootPackage}.common', 'utils');
$.import('${regi.rootPackage}.common', 'dbutils');

var schemaName = '${dbl.schema}';
var twitterTableName = '${regi.rootPackage}.db.tables::TWITTER_FEED';

//Define some aliases
var utils = $.${regi.rootPackage}.common.utils;
var dbutils = $.${regi.rootPackage}.common.dbutils;

function storeData(content) {
    var i;
    if(typeof content === 'object') {
        for (i = 0; i< content.length; i++) {
            content[i].ID = '"${dbl.schema}"."${regi.rootPackage}.db.tables::TWITTER_FEED_SEQ".NEXTVAL';
            $.trace.info('twitter.xsjslib: before store : ' + JSON.stringify(content[i]));
            dbutils.insertValues(schemaName,twitterTableName,JSON.stringify(content[i]));
        }	
    }
}
function fetch(topic,lang) {
    var result = [];
    var con;
    var i;
    var res;
    var timestamp;
    var count = 0;
    con = $.net.http.getConnection('http://search.twitter.com');
    con.setProxy('proxy.dub.sap.corp',8080);
    var path = '/search.json' + '?q=' + topic;
    var resp = con.request($.net.http.GET, path, 3600);
    $.trace.debug('twitter.xsjslib:' + resp.getStatus());
    var obj = JSON.parse(resp.getBody(0));  
    $.trace.debug('twitter.xsjslib: parsing JSON OK');
    var feeddata = obj.results;    
    $.trace.info('No of Feeds :' + feeddata.length);
    for (i = 0; i< feeddata.length; i++) {
        res = {};
        res.TOPIC = topic;
        res.TEXT = feeddata[i].text.replace(/["']{1}/gi, "");
        timestamp = utils.convertDate(feeddata[i].created_at);
        res.TWITTED_TIMESTAMP = timestamp;
        res.TWITTED_BY = feeddata[i].from_user.replace(/["']{1}/gi, "");
        res.LANG = feeddata[i].iso_language_code.replace(/["']{1}/gi, "");
        res.SOURCE = feeddata[i].source.replace(/["']{1}/gi, "");
        if(feeddata[i].iso_language_code === lang) {
            result.push(res);
        }
    } 
    storeData(result);
    return result;
}
function getSentiment(topic) {
    var delete_tokens_sql= 'DELETE FROM "'+ schemaName+'"."$TA_IDX_TWITTET_FEED"';
    var delete_twitter_feed = 'DELETE FROM "'+ schemaName+'"."dbl.db.tables::TWITTER_FEED"';
    dbutils.executeSQL(delete_tokens_sql,'DELETE');
    dbutils.executeSQL(delete_tokens_sql,'delete_twitter_feed');
    fetch(topic,'en');
} 