sap.ui.controller("sap.hs.dbl.Promotions", {

	
getUrlVars: function() {

	var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
},

onInit: function() {  
 
},
onBeforeRendering: function() {

},
onAfterRendering: function() {
	
    var productName = this.getUrlVars()["productname"];
    if(productName === undefined || productName === "" ) {
	
    	sap.ui.commons.MessageBox.show('Error : Missing URL parameter productname');
    
    }else {
    	
    	 productName = productName.replace(/%20/g," ");
         this.setProductInfo(productName);
         this.byId("PRODUCT_TXT").setText(productName);
         this.setData();
         this.setDataLocationDropdown();
         this.setDefaultOfferInterval();
         this.byId("CREATE_BTN").attachPress(this.onCreateButtonClicked,this);
         this.byId("MINUS_BTN").attachPress(this.onMinusButtonClicked,this);
         this.byId("PLUS_BTN").attachPress(this.onPlusButtonClicked,this);
    	 
     }

},
onExit: function() {
    
},



setDefaultOfferInterval : function() {
    var dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + 30);
    var myDateString = dateObj.getFullYear()+""+('0'+(dateObj.getMonth()+1)).slice(-2)+""+('0'+dateObj.getDate()).slice(-2); 
    this.byId("END_DATE").setYyyymmdd(myDateString);
    var sDateObj = new Date();
    sDateObj.setDate(sDateObj.getDate());
    var mySDateString = sDateObj.getFullYear()+""+('0'+(sDateObj.getMonth()+1)).slice(-2)+""+('0'+sDateObj.getDate()).slice(-2);
    this.byId("START_DATE").setYyyymmdd(mySDateString);
},


formatMoney : function(n , c, d, t){
	
	    c = isNaN(c = Math.abs(c)) ? 2 : c, 
	    d = d == undefined ? "." : d, 
	    t = t == undefined ? "," : t, 
	    s = n < 0 ? "-" : "", 
	    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
	    j = (j = i.length) > 3 ? j % 3 : 0;
	   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
},

populateproductInfo : function (aData, textStatus, jqXHR) {
	
 	 this.byId("PRICE_TXT").setText(aData.PRICE);
	// this.byId("PROMOTION_PRICE_TXT").setText(productPrice);
	
	 //this.byId("PRODUCT_IMG").setSrc("images/"+aData.FILENAME);
	 //this.byId("PRODUCT_IMG").setAlt("NO IMAGE");
 	var imageUrl =  "images/"+aData.FILENAME;
 	jQuery(".prodimg").css("background", "url('" + imageUrl + "')");
},



populateLocationDropdown : function (aData, textStatus, jqXHR) {
     var i = 0;
     var aLocations = { items : [] };     
     //console.log('aData :' + aData);    
     for (i = 0; i < aData.length; i++) {
        var locations = {}; 
        locations.key  = aData[i];
        locations.text = aData[i];
        aLocations.items.push(locations);
     }
     //console.log('locations :' + JSON.stringify(aLocations));     
     var oLocationModel = new sap.ui.model.json.JSONModel();
     oLocationModel.setData(aLocations);
     var oLocationItem = new sap.ui.core.ListItem();
     oLocationItem.bindProperty("key", "key");
     oLocationItem.bindProperty("text", "text");
     var aLocationDropdownBox = this.byId("LOCATION_DD");     
     aLocationDropdownBox.bindItems("/items", oLocationItem);
     aLocationDropdownBox.setModel(oLocationModel);
},
setDataLocationDropdown : function() {    
  jQuery.ajax({
        url : '../services/poisrv.xsjs',
        type : 'GET',
        dataType : 'json',
        contentType : 'application/json',
        context: this,
        success : this.populateLocationDropdown,    
        error : function() {
            sap.ui.commons.MessageBox.show('Service Call Error : Can not get the Locations');
        }
     });  
},

setProductInfo : function(productname) {    
	  jQuery.ajax({
	        url : '../services/product.xsjs?productname='+productname,
	        type : 'GET',
	        dataType : 'json',
	        contentType : 'application/json',
	        context: this,
	        success : this.populateproductInfo,    
	        error : function() {
	            sap.ui.commons.MessageBox.show('Service Call Error : Can not get the Products');
	        }
	     });  
},

setData : function () {
    var sKey = '';    
    var aWishList = { items : [] };
    var aWishListData = {
        "wishes"   : "Have this product in the wish list",    
        "follows"  : "Follow the Brand",
        "likes"    : "Liked this product",
        "comments" : "Commented on this product",
        "shares"   : "Shared this product"
    };
    for (sKey in aWishListData) {
        if (aWishListData.hasOwnProperty(sKey)) {
            var wish = {};
            wish.key = sKey;
            wish.text = aWishListData[sKey];
            aWishList.items.push(wish);
        }
    }
    var oWishListModel = new sap.ui.model.json.JSONModel();
    oWishListModel.setData(aWishList);    
    var oWishListItem = new sap.ui.core.ListItem();
    oWishListItem.bindProperty("key", "key");
    oWishListItem.bindProperty("text", "text");
    var aWishDropdownBox = this.byId("WISHLIST_DD");
    aWishDropdownBox.bindItems("/items", oWishListItem);
    aWishDropdownBox.setModel(oWishListModel);
    
    // Social
    var aSocialScore = {items : []};    
    var aSocialScoreData = {
        "70" : "Social Engagement Score > 70",
        "80" : "Social Engagement Score > 80",
        "90" : "Social Engagement Score > 90"
    };    
    for (sKey in aSocialScoreData) {
        if (aSocialScoreData.hasOwnProperty(sKey)) {
            var wish = {};
            wish.key = sKey;
            wish.text = aSocialScoreData[sKey];
            aSocialScore.items.push(wish);
        }
    }    
    var oSocialScoreModel = new sap.ui.model.json.JSONModel();
    oSocialScoreModel.setData(aSocialScore);
    var oSocialScoreItem = new sap.ui.core.ListItem();
    oSocialScoreItem.bindProperty("key", "key");
    oSocialScoreItem.bindProperty("text", "text");
    var aSocialDropdownBox = this.byId("SOCIAL_ENGAGEMENT_DD");
    aSocialDropdownBox.bindItems("/items", oSocialScoreItem);
    aSocialDropdownBox.setModel(oSocialScoreModel);
        
    //Location Distance
    var aLocDistance = {items : []};    
    var aLocDistanceData = {
        "500" : "500 Feet"
    };    
    for (sKey in aLocDistanceData) {
        if (aLocDistanceData.hasOwnProperty(sKey)) {
            var wish = {};
            wish.key = sKey;
            wish.text = aLocDistanceData[sKey];
            aLocDistance.items.push(wish);
        }
    }    
    var oLocDistanceModel = new sap.ui.model.json.JSONModel();
    oLocDistanceModel.setData(aLocDistance);
    var oLocDistanceItem = new sap.ui.core.ListItem();
    oLocDistanceItem.bindProperty("key", "key");
    oLocDistanceItem.bindProperty("text", "text");
    var aLocDistanceDropdownBox = this.byId("LOC_DISTANCE_DD");
    aLocDistanceDropdownBox.bindItems("/items", oLocDistanceItem);
    aLocDistanceDropdownBox.setModel(oLocDistanceModel);
        
    this.byId("DISCOUNT_TXT").setEditable(false);
    if(this.byId("PRODUCT_TXT").getText().length === 0 )
    	this.byId("PRODUCT_TXT").setText('Wowcool Bag');
    if(this.byId("PRICE_TXT").getText().length === 0)
    	this.byId("PRICE_TXT").setText('$189.99');
    if(this.byId("PRICE_TXT").getText().length === 0)
    	this.byId("PROMOTION_PRICE_TXT").setText('$189.99');
    
    //this.byId("PROMOTION_TXT").setValue('Please enter promotion text here');
    jQuery('.wished-textarea').attr('placeholder','Please enter promotion text here');
    this.byId("START_DATE").setValue(new Date());
    this.byId("END_DATE").setValue(new Date());
    
},
validateInput : function(data) {
    var validationResult = false;
    if(data.START_DATE !== undefined && data.START_DATE !== null && data.END_DATE !== undefined && data.END_DATE !== null) {
       var sDate = new Date(data.START_DATE);
       var eDate = new Date(data.END_DATE);
       if(eDate >= sDate) {
           validationResult = true; 
       }     
    }
    return validationResult; 
},
onCreateButtonClicked :  function() {
    
    var template = 'Just go to your favourite shop ' +
    'and show the QR code to cashier when you check out. '+
    'We hope you enjoy it!';
    
    var dimData = {
        "NAME": undefined,
        "PRODUCT": undefined,
        "PRICE": undefined,
        "DISCOUNT": undefined,
        "DISCOUNT_PRICE": undefined,
        "START_DATE": undefined,
        "END_DATE": undefined,
        "ACTIVITY": undefined,
        "SOCIAL_ENGAGEMENT_SCORE": undefined,
        "POI": undefined,
        "OFFER_SHORT_TEXT": undefined,
        "OFFER_TEMPLATE": undefined
    }; 
     
    dimData.NAME = 'Promotion for ' + this.byId('PRODUCT_TXT').getText();
    dimData.PRODUCT = this.byId('PRODUCT_TXT').getText();
    
    var currentPrice= this.byId('PRICE_TXT').getText();
    currentPrice = currentPrice.replace('$','');
    currentPrice = currentPrice.replace(',','.');
    dimData.PRICE = currentPrice;
    
    var currentValueStr = this.byId("DISCOUNT_TXT").getValue();
    currentValueStr = currentValueStr.replace('%','');
    dimData.DISCOUNT =  currentValueStr;
    
    var currentDiscountedPrice= this.byId('PROMOTION_PRICE_TXT').getText();
    currentDiscountedPrice = currentDiscountedPrice.replace('$','')
    currentDiscountedPrice = currentDiscountedPrice.replace(',','.')
    dimData.DISCOUNT_PRICE = currentDiscountedPrice;
    
    dimData.START_DATE =  jQuery.datepicker.formatDate('yy-mm-dd',new Date(this.byId("START_DATE").getValue()));;
    dimData.END_DATE =  jQuery.datepicker.formatDate('yy-mm-dd',new Date(this.byId("END_DATE").getValue()));
    dimData.ACTIVITY =  this.byId("WISHLIST_DD").getSelectedKey();
    dimData.SOCIAL_ENGAGEMENT_SCORE =  this.byId("SOCIAL_ENGAGEMENT_DD").getSelectedKey();
    dimData.POI = this.byId("LOCATION_DD").getSelectedKey();
    dimData.OFFER_SHORT_TEXT = this.byId("PROMOTION_TXT").getValue();
    dimData.OFFER_TEMPLATE = template.replace('{offer}', dimData.OFFER_SHORT_TEXT);
    
    console.log(dimData);    
    
    if(this.validateInput(dimData)) {    
    	
    	if(dimData.OFFER_SHORT_TEXT !== undefined && dimData.OFFER_SHORT_TEXT.length !== 0 ) {    	    
    	    /*
    	     * Escaping ' Chars to avoid SQL injection 
    	     */
    	    dimData.OFFER_SHORT_TEXT = dimData.OFFER_SHORT_TEXT.replace('\'','\'\'');    	    
    		jQuery.ajax({
               url : '../services/offerrules.xsjs',
               type : 'POST',
               contentType : 'application/json',
               data : JSON.stringify(dimData),
               success: function () {
                  sap.ui.commons.MessageBox.show('Offer has been created successfully');
               },
               error: function () {
                  sap.ui.commons.MessageBox.show('Service Error. Failed to create an offer');
               }
           });
    	 }else {
    	  sap.ui.commons.MessageBox.show('Offer Text cannot be blank');
      }
    } else {
        sap.ui.commons.MessageBox.show('End date should be greater than start date');
    }
},

onMinusButtonClicked : function() {
    var currentValueStr = this.byId("DISCOUNT_TXT").getValue();
    currentValueStr = currentValueStr.replace('%','');
    var currentValue = parseInt(currentValueStr,10);
    if(currentValue >1) {
        currentValue = currentValue -1;
    }
    this.byId("DISCOUNT_TXT").setValue(currentValue.toString() + '%');    
    var currentPriceTxt =  this.byId("PRICE_TXT").getText();
    currentPriceTxt = currentPriceTxt.replace('$','');
    currentPriceTxt = currentPriceTxt.replace(',','.');
    var currentPrice =  parseFloat(currentPriceTxt);    
    var promotionPrice =  currentPrice -(currentPrice * (currentValue/100));
    var tempString = new String(promotionPrice.toFixed(2))
    this.byId("PROMOTION_PRICE_TXT").setText('$'+tempString);
},

onPlusButtonClicked : function () {
    var currentValueStr = this.byId("DISCOUNT_TXT").getValue();
    currentValueStr = currentValueStr.replace('%','');
    var currentValue = parseInt(currentValueStr,10);
    if(currentValue >=0 && currentValue <100) {
        currentValue = currentValue +1;
    }
    this.byId("DISCOUNT_TXT").setValue(currentValue.toString() + '%' ); 
    var currentPriceTxt =  this.byId("PRICE_TXT").getText();
    currentPriceTxt = currentPriceTxt.replace('$','');
    currentPriceTxt = currentPriceTxt.replace(',','.');    
    var currentPrice =  parseFloat(currentPriceTxt);
    var promotionPrice =  currentPrice - (currentPrice * (currentValue/100));
    var tempString = new String(promotionPrice.toFixed(2))
    this.byId("PROMOTION_PRICE_TXT").setText('$'+tempString); 
} 

});