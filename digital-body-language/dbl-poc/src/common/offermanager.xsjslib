$.import('${regi.rootPackage}.common', 'dbutils');
$.import('${regi.rootPackage}.common', 'utils');

var dbutils = $.${regi.rootPackage}.common.dbutils;
var utils = $.${regi.rootPackage}.common.utils;

/*
 *  Deprecated function
 */
function checkDIM(userid,poi) 
{
    var offer;    
    var offerlist = [];    
    var user_static_sql  = 'SELECT * FROM "${dbl.schema}"."${regi.rootPackage}.db.tables::USER_STATIC" WHERE ID = \'' + userid + '\'';
    var user_dynamic_sql = 'SELECT DATA FROM "HS_DBL_NEW"."${regi.rootPackage}.db.tables::USER_TEMPORAL" WHERE ID = \'' + userid +'\' AND EVENT=\'wishes\'';
    var dim_offers_sql   = 'SELECT * FROM "${dbl.schema}"."${regi.rootPackage}.db.tables::DIM_OFFERS" WHERE POI = \'' + poi + '\'';
    
    //Get the DIM matching the POI
    var dim = dbutils.executeSQL(dim_offers_sql,'SELECT');
    if(dim.length === 0) {
        return null;
    } else {
        var i=0;
        for(i=0;i<dim.length;i++) {
            offer = dim[i];
            var user_profiles = dbutils.executeSQL(user_static_sql,'SELECT'); 
            var user_profile = user_profiles[0];
            var user_wishlist = dbutils.executeSQL(user_dynamic_sql,'SELECT');
            var j= 0;
            var wishlistMatch = false;
            for(j=0;j<user_wishlist.length;j++) {
                if (user_wishlist[j].DATA === offer.PRODUCT) {
                    wishlistMatch = true;
                    break;
                }
            }           
            if(wishlistMatch === true && offer.POI === poi && user_profile.GENDER === offer.GENDER ) {
                var tempres = offer.OFFER_TEMPLATE;
                tempres = tempres.replace('{user}',user_profile.NAME);
                tempres = tempres.replace('{code}',utils.generateUUID);
                var result= {};
                result.PRODUCT= offer.PRODUCT;
                result.OFFER_SHORT_TEXT=offer.OFFER_SHORT_TEXT;
                result.OFFER = tempres;
                offerlist.push(result);
              //break;
            }
         }        
     }
     return offerlist;
}
/*
 *  Deprecated function
 */
function locationTimeDiff(location_time_created) {

    var result = true; 
    
    var location_time_hour = location_time_created.getHours();
    var location_time_minute = location_time_created.getMinutes();    
    var start = location_time_hour +":"+location_time_minute;
    var date = new Date();
    var new_hour = date.getUTCHours();
    var new_minutes = date.getUTCMinutes();
    var end = new_hour +":"+new_minutes;
    
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    
    var timeDiff = (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes ; 
    
    $.trace.info('time difference :' + timeDiff);
    
    if(timeDiff > "00:30" ) {
       result = false ;
    }   
    return result;
}

function getProductDetails(productName) {
    
    var sql = 'SELECT * FROM "${dbl.schema}"."${regi.rootPackage}.db.tables::PRODUCT" WHERE PRODUCT_NAME = \'' + productName + '\'';
    var result = dbutils.executeSQL(sql, 'SELECT');
    return result[0];
}

function checkDateRange(offer) {    
    var nowDate = new Date();
    var startDate = new Date(offer.START_DATE);
    var endDate = new Date(offer.END_DATE);
    var daterange_match = false;    
    if (startDate <= nowDate && nowDate <= endDate) {
        daterange_match = true;
    }
    return daterange_match;
}

function createOffers(userid) {
    
    var connection;
    var offer;
    var offerlist = [];    
    
    var wishes_match = false;
    var location_match=false ;
    var socialScore_match = false;
    //var sentiment_match= false;
    
    var user_static_sql = 'SELECT * FROM "${dbl.schema}"."dbl.db.tables::USER_STATIC" WHERE ID = \'' + userid + '\'';
    var user_dynamic_wishes_sql = 'SELECT DATA FROM "${dbl.schema}"."${regi.rootPackage}.db.tables::USER_TEMPORAL" WHERE ID = \'' + userid + '\' AND EVENT=\'wishes\' AND DATA= ?';
    //var user_dynamic_location_sql = 'SELECT DATA,EVENT_TIME FROM "HS_DBL_NEW"."USER_TEMPORAL" WHERE ID = \'' + userid + '\' AND EVENT=\'locationUpdate\' AND DATA= ?';
    //var user_dynamic_location_sql =  'SELECT * FROM "${dbl.schema}"."USER_TEMPORAL" WHERE ID = \'' + userid + '\' AND EVENT=\'locationUpdate\' AND (SELECT CURRENT_UTCTIMESTAMP FROM DUMMY) <=' + 
    //'( SELECT ADD_SECONDS(EVENT_TIME,60*30) FROM "${dbl.schema}"."USER_TEMPORAL" WHERE ID = \'' + userid + '\' AND EVENT=\'locationUpdate\' ) AND DATA = ?';     
    var user_dynamic_location_sql =  'SELECT A.* FROM "${dbl.schema}"."${regi.rootPackage}.db.tables::USER_TEMPORAL" AS A WHERE A.ID = \'' + userid + '\' AND A.EVENT=\'locationUpdate\' '  +
     
    ' AND EXISTS (SELECT B.ID FROM "${dbl.schema}"."${regi.rootPackage}.db.tables::USER_TEMPORAL" AS B WHERE B.ID = A.ID AND B.EVENT= A.EVENT AND CURRENT_UTCTIMESTAMP <= ADD_SECONDS(B.EVENT_TIME,60*30))' ;

    var user_dynamic_socialScore_sql = 'SELECT DATA FROM "${dbl.schema}"."${regi.rootPackage}.db.tables::USER_TEMPORAL" WHERE ID = \'' + userid + '\' AND EVENT=\'socialScore\'';
    var user_dynamic_sentiment_sql = 'SELECT DATA FROM "${dbl.schema}"."${regi.rootPackage}.db.tables::USER_TEMPORAL" WHERE ID = \'' + userid + '\' AND EVENT=\'sentiment\' AND DATA= ?';
    var dim_offers_sql = 'SELECT * FROM "${dbl.schema}"."${regi.rootPackage}.db.tables::DIM_OFFERS"'; 

    
    // Get the DIM matching the POI
    var dim = dbutils.executeSQL(dim_offers_sql,'SELECT');    
    if (dim.length === 0) {
        return undefined;
    } else {
        var i = 0;
        connection = $.db.getConnection();
        // User Static Data
        var user_profiles = dbutils.executeSQL(user_static_sql, 'SELECT');
        var user_profile = user_profiles[0];
        
        for ( i = 0; i < dim.length; i++) {
            offer = dim[i];
            wishes_match = false;
            location_match = false;
            socialScore_match = false;
     
            //User tempral Data - Wishlists
            var user_dynamic_wishes_query = connection.prepareStatement(user_dynamic_wishes_sql);
            user_dynamic_wishes_query.setString(1, offer.PRODUCT);
            $.trace.info("user_dynamic_wishes_sql :" + user_dynamic_wishes_sql);
            var wishes_resultset = user_dynamic_wishes_query.executeQuery();
            if (wishes_resultset !== undefined && wishes_resultset !== null) {
                if (wishes_resultset.next()) {
                    wishes_match = true;
                }
            }
            user_dynamic_wishes_query.close();

            //User tempral Data - Location
            var user_dynamic_location_query = connection.prepareStatement(user_dynamic_location_sql);
            //user_dynamic_location_query.setString(1, offer.POI);
            $.trace.info("user_dynamic_location_sql :" + user_dynamic_location_sql);
            var location_resultset = user_dynamic_location_query.executeQuery();
            //$.trace.info('Result Set :' + location_resultset.next());
            if (location_resultset !== undefined && location_resultset !== null) {
                if (location_resultset.next()) {                   
                    location_match = true;
                }
            }
            user_dynamic_location_query.close();
            
            // User tempral Data - Social Score
            var user_dynamic_socialScore_query = connection.prepareStatement(user_dynamic_socialScore_sql);
            $.trace.info("user_dynamic_socialScore_sql :" + user_dynamic_socialScore_sql);
            var socialScore_resultset = user_dynamic_socialScore_query.executeQuery();
            if (socialScore_resultset !== undefined && socialScore_resultset !== null) {
                if (socialScore_resultset.next()) {
                    var score = socialScore_resultset.getString(1);
                    var socialScore_temp = parseInt(score, 10);
                    if (socialScore_temp >= parseInt(offer.SOCIAL_ENGAGEMENT_SCORE,10)) {
                        socialScore_match = true;
                    }
                }
            }
            user_dynamic_socialScore_query.close();
          
            $.trace.info("Current Offer            :" + JSON.stringify(offer));
            $.trace.info("Location_match           :" + location_match);
            $.trace.info("SocialScore_match        :" + socialScore_match);
            $.trace.info("Wishes_match             :" + wishes_match);
            $.trace.info("Is Within the Date range :" + checkDateRange(offer));

            if (wishes_match === true && location_match === true && socialScore_match === true && checkDateRange(offer)) {
                var tempres = offer.OFFER_TEMPLATE;
                //tempres = tempres.replace('{user}', user_profile.NICK_NAME);
              
                var result = {};
                var productInfo =  getProductDetails(offer.PRODUCT);
                result.PRODUCT = offer.PRODUCT;
                result.PRODUCT_IMAGE_URL="http://SYSTEM:Manager05@dubl60244901a.dhcp.dub.sap.corp:8005/dbl/newui/images/"+productInfo.FILENAME;
                result.OFFER_CODE = utils.generateUUID();
                result.OFFER_SHORT_TEXT = offer.OFFER_SHORT_TEXT;
                result.OFFER_LONG_TEXT = tempres;
                result.PRODUCT_PRICE = offer.PRICE;
                result.DISCOUNT = offer.DISCOUNT;
                result.OFFER_PRICE = offer.DISCOUNT_PRICE;
                result.OFFER_START_DATE = offer.START_DATE;
                result.OFFER_END_DATE = offer.END_DATE;
                offerlist.push(result);
            }
        }
        connection.close();
    }
    return offerlist;    
}