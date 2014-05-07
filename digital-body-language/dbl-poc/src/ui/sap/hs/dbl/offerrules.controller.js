sap.ui.controller("sap.hs.dbl.offerrules", {
    
    onSuccessPOI : function (aData, textStatus, jqXHR) {
        var model = {items:[]};
        var i=0;
        for(i=0;i<aData.length;i++) {
            var loc = {};
            loc.key = aData[i];
            loc.text = aData[i];
            model.items.push(loc);
        }        
        var oModel = new sap.ui.model.json.JSONModel();                            
        oModel.setData(model);
        var oListItem = new sap.ui.core.ListItem();
        oListItem.bindProperty("key", "key");
        oListItem.bindProperty("text", "text");       
        var combo = sap.ui.getCore().byId("DIM_POI");
        combo.bindItems("/items", oListItem);
        combo.setModel(oModel);        
    },
    
    onErrorPOI : function () {
        sap.ui.commons.MessageBox.show(jqXHR.responseText, "ERROR", "Service Call Error....");
    },
    
    getPOIValues : function () {
        jQuery.ajax({
            url : '../services/poisrv.xsjs',
            type : 'GET',
            dataType : 'json',
            contentType : 'application/json',
            success : this.onSuccessPOI
        });
    },    
    
    handleCreateOfferButtonClicked : function() {
        
        var dimData = {
            "NAME" : undefined,
            "AGE" : undefined,
            "GENDER" : undefined,
            "POI" : undefined,
            "PRODUCT" : undefined,
            "SENTIMENT" : undefined,
            "SOCIAL_ACTIVITY_SCORE" : undefined,
            "OFFER_SHORT_TEXT" :undefined,
            "OFFER_TEMPLATE" : undefined
         };        
        dimData.NAME = sap.ui.getCore().byId("DIM_NAME").getValue();
        dimData.AGE = sap.ui.getCore().byId("DIM_AGE").getValue();
        dimData.GENDER = sap.ui.getCore().byId("DIM_GENDER").getValue();
        dimData.POI = sap.ui.getCore().byId("DIM_POI").getValue();
        dimData.PRODUCT =  sap.ui.getCore().byId("DIM_PRODUCT").getValue();
        dimData.SENTIMENT =  sap.ui.getCore().byId("DIM_SENTIMENT").getValue();
        dimData.SOCIAL_ACTIVITY_SCORE =  sap.ui.getCore().byId("DIM_SOCIAL_ACTIVITY_SCORE").getValue();
        dimData.OFFER_SHORT_TEXT = sap.ui.getCore().byId("DIM_OFFER_SHORT_TEXT").getValue();
        dimData.OFFER_TEMPLATE =   sap.ui.getCore().byId("DIM_OFFER_TEMPLATE").getValue();
        
          jQuery.ajax({
                url : '../services/offerrules.xsjs',
                type : 'POST',
                data : JSON.stringify(dimData),
                success: function () {
                    sap.ui.commons.MessageBox.show('DIM created successfully');
                 },
                 error: function () {
                      sap.ui.commons.MessageBox.show('Falied to create the DIM');
                  }
                });
    },    
    /**
     * Called when a controller is instantiated and its View controls (if
     * available) are already created. Can be used to modify the View before it
     * is displayed, to bind event handlers and do other one-time
     * initialization.
     */
    // onInit: function() {
    //
    // },
    /**
     * Similar to onAfterRendering, but this hook is invoked before the
     * controller's View is re-rendered (NOT before the first rendering!
     * onInit() is used for that one!).
     */
    // onBeforeRendering: function() {
    //
    // },
    /**
     * Called when the View has been rendered (so its HTML is part of the
     * document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     */
    onAfterRendering : function() {
        this.getPOIValues();
    }

    /**
     * Called when the Controller is destroyed. Use this one to free resources and
     * finalize activities.
     */
    // onExit: function() {
    //
    // }
});