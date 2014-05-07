sap.ui.jsview("sap.hs.dbl.twitter",
{
    getControllerName : function() {
        return "sap.hs.dbl.twitter";
    },

    createContent : function(oController) {
        
        var oModel = new sap.ui.model.odata.ODataModel("../services/twittercontent.xsodata", false);
        
        var oTable = new sap.ui.table.Table("test", {tableId : "tableID",visibleRowcount : 50});
        oTable.setTitle("TWITTER FEED");
        
        var oControl1 = new sap.ui.commons.TextField().bindProperty("value","TOPIC");
        oTable.addColumn(new sap.ui.table.Column({label : new sap.ui.commons.Label({text : "TOPIC"}),  template : oControl1,sortProperty : "TOPIC"}));

        var oControl2 = new sap.ui.commons.TextField().bindProperty("value","TWITTED_BY");
        oTable.addColumn(new sap.ui.table.Column({label : new sap.ui.commons.Label({text : "TWITTED_BY"}),template : oControl2,sortProperty : "TWITTED_BY"}));
        
        var oControl3 = new sap.ui.commons.TextField().bindProperty("value",   "SOURCE");
        oTable.addColumn(new sap.ui.table.Column({label : new sap.ui.commons.Label({text : "SOURCE"}),template : oControl3,sortProperty : "SOURCE"}));

        var oControl4 = new sap.ui.commons.TextField().bindProperty("value",   "TEXT");
        oTable.addColumn(new sap.ui.table.Column({label : new sap.ui.commons.Label({text : "TEXT"}),template : oControl4,sortProperty : "TEXT"}));

        oTable.setModel(oModel);

        var sort1 = new sap.ui.model.Sorter("TOPIC");
        oTable.bindRows("/TwitterData", sort1);

        var iNumberOfRows = oTable.getBinding("rows").iLength;
        oTable.setTitle("Number of users" + "(" + iNumberOfRows+")");
        
        return oTable;
    }

});