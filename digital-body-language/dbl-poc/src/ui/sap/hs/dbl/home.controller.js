sap.ui.controller("sap.hs.dbl.home", {
	
   onInit: function() {
	   
   },
   
   onBeforeRendering: function() {
	   
   },
   
   onAfterRendering: function() {	   
	   //this.getLocation();
   },
   onExit: function() {
	   
   },
   
  getLocation : function() {	  
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
	} else {
	}
  },
  
  showPosition : function(position) {	  
	  this.byId("Latitude_VAL").setText(position.coords.latitude);
	  this.byId("Longitude_VAL").setText(position.coords.longitude);
	  var address = this.getAddress(position.coords.latitude,position.coords.longitude);
	  this.byId("Address_VAL").setText(address);
  },  
  getAddress: function(latitude,longitude) {
	    var address="welcome";	    
	    var latlng = new google.maps.LatLng(latitude, longitude);
	    var geocoder = new google.maps.Geocoder();	    
	    geocoder.geocode({'latLng': latlng}, function(results, status) {	       	
	      if (status == google.maps.GeocoderStatus.OK) {
	        if (results[1]) {
	          console.log(results[1].formatted_address);	    	     	
	          address = results[1].formatted_address;
	          console.log(address);
	        }
	      } else {
	        alert("Geocoder failed due to: " + status);
	      }
	    }.bind(this));
	    setTimeout(function() {
	    	alert(address);
	    }, 3000);
	    return address;	    
  },
	  
 onCurrentAddressButtonClicked: function(oEvent) {
	 this.getLocation();
 }
	  
});