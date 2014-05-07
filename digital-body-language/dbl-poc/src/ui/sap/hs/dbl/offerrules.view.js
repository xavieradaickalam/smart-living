sap.ui.jsview("sap.hs.dbl.offerrules", {

    getControllerName : function() {
        return "sap.hs.dbl.offerrules";
    },

    createContent : function(oController) {

        // Create a panel instance
        // var oPanel = new sap.ui.commons.Panel({width:
        // "350px", showCollapseIcon: false});
        var oPanel = new sap.ui.commons.Panel({
            width : "100%",
            showCollapseIcon : false
        });
        oPanel.setAreaDesign(sap.ui.commons.enums.AreaDesign.Plain);
        oPanel.setBorderDesign(sap.ui.commons.enums.BorderDesign.None);

        // Set the title of the panel
        oPanel.setTitle(new sap.ui.commons.Title({
            text : "Create Marketing Compaign"
        }));
        // As alternative if no icon is desired also the
        // following shortcut might be possible:
        // oPanel.setText("Contact Data");

        // Create a matrix layout with 2 columns
        var oMatrix = new sap.ui.commons.layout.MatrixLayout({
            layoutFixed : true,
            width : '300px',
            columns : 2
        });

        oMatrix.setWidths('400px', '500px');

        // Disposable Income Moments
        var dispLabel = new sap.ui.commons.Label({
            text : 'Name'
        });
        var nameTextArea = new sap.ui.commons.TextArea({id:"DIM_NAME"});
        dispLabel.setLabelFor(nameTextArea);
        oMatrix.createRow(dispLabel, nameTextArea);
        nameTextArea.setTooltip('Name');
        nameTextArea.setEditable(true);
        nameTextArea.setWidth("500px");
        nameTextArea.setRows(1);
       
        // Age
        var oLabel = new sap.ui.commons.Label({
            text : 'Age'
        });
        var ageDropdownBox = new sap.ui.commons.DropdownBox({id : "DIM_AGE"});
        oLabel.setLabelFor(ageDropdownBox);
        oMatrix.createRow(oLabel, ageDropdownBox);
        ageDropdownBox.setTooltip('Age');
        ageDropdownBox.setEditable(true);
        ageDropdownBox.setWidth("500px");
        var oItem = new sap.ui.core.ListItem("Age1");
        oItem.setText("21-25");
        ageDropdownBox.addItem(oItem);
        oItem = new sap.ui.core.ListItem("Age2");
        oItem.setText("26-30");
        ageDropdownBox.addItem(oItem);
        oItem = new sap.ui.core.ListItem("Age3");
        oItem.setText("31-35");
        ageDropdownBox.addItem(oItem);
        oItem = new sap.ui.core.ListItem("Age4");
        oItem.setText("35-40");
        ageDropdownBox.addItem(oItem);
        ageDropdownBox.setValue("21-25");

        // Gender
        var genderLabel = new sap.ui.commons.Label({text : 'Gender'});
        var genderDropdownBox = new sap.ui.commons.DropdownBox({id : "DIM_GENDER"});
        genderLabel.setLabelFor(genderDropdownBox);

        oMatrix.createRow(genderLabel, genderDropdownBox);

        genderDropdownBox.setTooltip('Gender');
        genderDropdownBox.setEditable(true);
        genderDropdownBox.setWidth("500px");
        var oItem = new sap.ui.core.ListItem("gen1");
        oItem.setText("MALE");
        genderDropdownBox.addItem(oItem);
        oItem = new sap.ui.core.ListItem("gen2");
        oItem.setText("FEMALE");
        genderDropdownBox.addItem(oItem);
        genderDropdownBox.setValue("FEMALE");

        // Location
        var locationLabel = new sap.ui.commons.Label({
            text : 'Location'
        });
        var locationDropdownBox = new sap.ui.commons.DropdownBox({id : "DIM_POI"});
        locationLabel.setLabelFor(locationDropdownBox);
        oMatrix.createRow(locationLabel, locationDropdownBox);
        locationDropdownBox.setTooltip('In Store Offer Location');
        locationDropdownBox.setEditable(true);
        locationDropdownBox.setWidth("500px");
        var oItem = new sap.ui.core.ListItem("poi1");
        oItem.setText("SAP Ireland");
        locationDropdownBox.addItem(oItem);
        var oItem = new sap.ui.core.ListItem("poi2");
        oItem.setText("SAP US");
        locationDropdownBox.addItem(oItem);
        locationDropdownBox.setValue("SAP Ireland");

        // likes
        var likesLabel = new sap.ui.commons.Label({ text : 'Product/Brand' });
        var likesDropdownBox = new sap.ui.commons.DropdownBox({id : "DIM_PRODUCT"});
        likesLabel.setLabelFor(likesDropdownBox);
        oMatrix.createRow(likesLabel, likesDropdownBox);
        likesDropdownBox.setTooltip('likes');
        likesDropdownBox.setEditable(true);
        likesDropdownBox.setWidth("500px");
        var oItem = new sap.ui.core.ListItem("likes1");
        oItem.setText("MCM Bags");
        likesDropdownBox.addItem(oItem);
        oItem = new sap.ui.core.ListItem("likes2");
        oItem.setText("Diesel");
        likesDropdownBox.addItem(oItem);
        oItem = new sap.ui.core.ListItem("likes3");
        oItem.setText("Tommy Hilfiger");
        likesDropdownBox.addItem(oItem);
        
        oItem = new sap.ui.core.ListItem("likes4");
        oItem.setText("Calvin Klein");
        likesDropdownBox.addItem(oItem);
        
        
        oItem = new sap.ui.core.ListItem("likes5");
        oItem.setText("Bootcut Jeans");
        likesDropdownBox.addItem(oItem);
        
        oItem = new sap.ui.core.ListItem("likes6");
        oItem.setText("Bags");
        likesDropdownBox.addItem(oItem);
        
        oItem = new sap.ui.core.ListItem("likes7");
        oItem.setText("MCM");
        likesDropdownBox.addItem(oItem);
        
        likesDropdownBox.setValue("Bootcut Jeans");

        var sentimentTextField = new sap.ui.commons.TextField({id : "DIM_SENTIMENT"});
        sentimentTextField.setWidth('500px');
        var sentimentTextFieldLabel = new sap.ui.commons.Label({   text : 'Sentiment' });
        sentimentTextFieldLabel.setLabelFor(sentimentTextField);
        oMatrix.createRow(sentimentTextFieldLabel, sentimentTextField);
        
        var socialScoreTextField = new sap.ui.commons.TextField({id : "DIM_SOCIAL_ACTIVITY_SCORE"});
        socialScoreTextField.setWidth('500px');
        var socialScoreTextFieldLabel = new sap.ui.commons.Label({   text : 'Social Activity Score' });
        socialScoreTextFieldLabel.setLabelFor(sentimentTextField);
        oMatrix.createRow(socialScoreTextFieldLabel, socialScoreTextField);
        
        var offerTextArea = new sap.ui.commons.TextArea({id : "DIM_OFFER_SHORT_TEXT"});
        offerTextArea.setRows(1);
        offerTextArea.setWidth("500px");
        var offerTextLabel = new sap.ui.commons.Label({   text : 'Short Offer Text' });
        offerTextLabel.setLabelFor(offerTextArea);
        oMatrix.createRow(offerTextLabel, offerTextArea);
        
        var offerLondTextArea = new sap.ui.commons.TextArea({id : "DIM_OFFER_TEMPLATE"});
        offerLondTextArea.setTooltip("Offers");
        offerLondTextArea.setRows(4);
        offerLondTextArea.setWidth("500px");
        //offerLondTextArea.setCols(250);
        var offerLongTextLabel = new sap.ui.commons.Label({   text : 'Offer Template' });
        offerLongTextLabel.setLabelFor(offerLondTextArea);
        oMatrix.createRow(offerLongTextLabel, offerLondTextArea);
        
        oPanel.addContent(oMatrix);

        var createOfferBtn = new sap.ui.commons.Button({
            id : 'createOfferBtn',
            tooltip : 'Create an Offer',
            text : 'Create Offer',
            enabled : true
        });
        createOfferBtn.attachPress(oController.handleCreateOfferButtonClicked,
                oController);

        var veritcalLayout = new sap.ui.commons.layout.VerticalLayout(
                'verticalLayout', {
                    content : [ oPanel,createOfferBtn ]
                });
        return veritcalLayout;
    }
});