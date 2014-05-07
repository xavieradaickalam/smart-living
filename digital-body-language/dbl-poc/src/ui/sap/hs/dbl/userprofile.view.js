sap.ui.jsview("sap.hs.dbl.userprofile", {

	getControllerName : function() {
		return "sap.hs.dbl.userprofile";
	},
	
	createContent : function(oController) {
		var oTable = new sap.ui.table.DataTable("testDataTable", {tableId : "dataTableID",visibleRowcount : 50});		
		return oTable;
	}
});