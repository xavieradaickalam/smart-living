$.import('${regi.rootPackage}.common', 'dbutils');
var dbutils = $.${regi.rootPackage}.common.dbutils;

function getPointOfInterestName(poi_id) {
    
    var sql = 'SELECT * FROM "${dbl.schema}"."${regi.rootPackage}.db.tables::GEOLOC_POI" WHERE POI_ID = \'' + poi_id + '\'';
    var conn = $.db.getConnection();
    var pstmt = conn.prepareStatement(sql);
    var rs = pstmt.executeQuery();
    var result = [];
    if (rs.next()) {
       var meta = rs.getMetaData();
       var colCount = meta.getColumnCount();
       var fName, fType, i;
       do {
              var recObj = {};
              fName = meta.getColumnLabel(2);
              recObj[fName] = rs.getString(2);
              result.push(recObj);
       } while (rs.next());
    } else {
          result.push("NO DATA");
    }
    rs.close();
    pstmt.close();
    conn.close();
    return JSON.stringify(result);
    
}
function matchGeoLocation(latitude,longitude) {
    
    var result = [];
    try {
            
            // $.trace.info('LatLng' + latitude + ' '  + longitude);
            var connection = $.db.getConnection();
            var distinctNodeQuery = 'SELECT DISTINCT (POI_ID) FROM "${dbl.schema}"."${regi.rootPackage}.db.tables::GEOLOC_COORDINATES"';
            var queryAllCoordinates = 'SELECT POI_ID, LATITUDE, LONGITUDE FROM "${dbl.schema}"."${regi.rootPackage}.db.tables::GEOLOC_COORDINATES" WHERE POI_ID = ?';
            // Get all distinct nodes
            var pstmt1 = connection.prepareStatement(distinctNodeQuery);
            var rs1 = pstmt1.executeQuery();
            var rs2;
            var pstmt2 = connection.prepareStatement(queryAllCoordinates);          
            // Put all distinct nodes into "nodes"
            var nodes = [];
            var count = 0;
            while (rs1.next()){
                nodes[count] = rs1.getString(1);
                count = count + 1;
            }           
            // Initialize matched node
            var matchedNode;            
            // For each node, retrieve all the coordinates into "verts"
            var k = 0;
            var nodeCount = nodes.length;           
            for(k=0; k<nodeCount; k++) {
            
                var currentNode = nodes[k];
                pstmt2.setString(1, currentNode);
                rs2 = pstmt2.executeQuery();
                var verts = [];
                count = 0;
                while (rs2.next()){ 
                    var point = {};
                    point.nodeID = rs2.getString(1);
                    point.latitude = rs2.getDecimal(2);
                    point.longitude = rs2.getDecimal(3);
                    verts[count] = point;
                    count = count + 1;
                }
                // Check if the input falls in that node's coordinates
                var i = 0;
                var j = 0;
                var c = false;  
                var sides = verts.length;
                j=sides-1;
                for (i=0;i<sides;j=i++) {    
                  if (( ((verts[i].longitude <= longitude) && (longitude < verts[j].longitude)) || ((verts[j].longitude <= longitude) && (longitude < verts[i].longitude))) &&
                        (latitude < (verts[j].latitude - verts[i].latitude) * (longitude - verts[i].longitude) / (verts[j].longitude - verts[i].longitude) + verts[i].latitude)) {
                    c = !c;
                  }
                  
                }
                $.trace.info('Current node :' + currentNode);
                if (c) {
                    matchedNode = currentNode;
                    break;
                }
            }
            var jsonresponse = getPointOfInterestName(matchedNode);             
            if (matchedNode !== undefined){             
                $.trace.info(jsonresponse);             
                $.response.contentType = "application/json";
                $.response.status = $.net.http.OK;
                $.response.setBody(jsonresponse);
            }else {             
                $.response.contentType = "text/plain";
                $.response.status = $.net.http.OK;
                $.response.setBody(jsonresponse);
            }           
            rs1.close();
            pstmt1.close();
            rs2.close();
            pstmt2.close();
            connection.close();
     } catch(e) {
        $.response.contentType = "text/plain";
        $.response.status = $.net.http.BAD_REQUEST;
        $.response.setBody(JSON.stringify(e.message));
    }
     
}

function getPOI(poi_id) {
    
    var sql = 'SELECT NAME FROM "${dbl.schema}"."${regi.rootPackage}.db.tables::GEOLOC_POI" WHERE POI_ID = \'' + poi_id + '\'';
    var conn = $.db.getConnection();
    var pstmt = conn.prepareStatement(sql);
    var rs = pstmt.executeQuery();
    var result;
    if (rs.next()) {
       result = rs.getString(1); 
    } 
    rs.close();
    pstmt.close();
    conn.close();
    return result;
    
}

function isInsidePolygon(latitude,longitude) {
    
    // Initialize matched node
    var matchedNode;   
	try {
	        $.trace.info('isInsidePolygon : LatLng' + latitude + ' '  + longitude);
	        var connection = $.db.getConnection();
			var distinctNodeQuery = 'SELECT DISTINCT (POI_ID) FROM "${dbl.schema}"."${regi.rootPackage}.db.tables::GEOLOC_COORDINATES"';
			var queryAllCoordinates = 'SELECT POI_ID, LATITUDE, LONGITUDE FROM "${dbl.schema}"."${regi.rootPackage}.db.tables::GEOLOC_COORDINATES" WHERE POI_ID = ?';
			// Get all distinct nodes
			var pstmt1 = connection.prepareStatement(distinctNodeQuery);
			var rs1 = pstmt1.executeQuery();
			var rs2;
			var pstmt2 = connection.prepareStatement(queryAllCoordinates);			
			// Put all distinct nodes into "nodes"
			var nodes = [];
			var count = 0;
			while (rs1.next()){
				nodes[count] = rs1.getString(1);
				count = count + 1;
			}			
			// For each node, retrieve all the coordinates into "verts"
			var k = 0;
			var nodeCount = nodes.length;			
			for(k=0; k<nodeCount; k++) {			
				var currentNode = nodes[k];
				pstmt2.setString(1, currentNode);
				rs2 = pstmt2.executeQuery();
				var verts = [];
				count = 0;
				while (rs2.next()){	
					var point = {};
					point.nodeID = rs2.getString(1);
					point.latitude = rs2.getDecimal(2);
					point.longitude = rs2.getDecimal(3);
					verts[count] = point;
					count = count + 1;
				}
				// Check if the input falls in that node's coordinates
				var i = 0;
				var j = 0;
				var c = false;	
				var sides = verts.length;
				j=sides-1;
				for (i=0;i<sides;j=i++) {    
				  if (( ((verts[i].longitude <= longitude) && (longitude < verts[j].longitude)) || ((verts[j].longitude <= longitude) && (longitude < verts[i].longitude))) &&
				        (latitude < (verts[j].latitude - verts[i].latitude) * (longitude - verts[i].longitude) / (verts[j].longitude - verts[i].longitude) + verts[i].latitude)) {
				    c = !c;
				  }
				  
				}
				$.trace.info('c :' + c);
				if (c) {
				    // $.trace.info('comparing matching node :' + currentNode);
					matchedNode = currentNode;
					break;
				}
			}
			// $.trace.info('matched node :' + matchedNode);
			rs1.close();
			pstmt1.close();
			rs2.close();
			pstmt2.close();
			connection.close();
	 } catch(e) {
	     throw(e);
	 }
	 return matchedNode;	 
}

function getAllPOIs() {
    
    var sql = 'SELECT NAME FROM "${dbl.schema}"."${regi.rootPackage}.db.tables::GEOLOC_POI"';
    var poilist = [];
    var i=0;
    var result = dbutils.executeSQL(sql, 'SELECT');
    if (result !== undefined && result.length > 0) {
        for (i = 0; i < result.length;i++) {
            poilist.push(result[i].NAME);
        }
    }
    return JSON.stringify(poilist);
}
