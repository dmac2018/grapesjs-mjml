var editorCampaignId = 0;
var redirectToPreview = false;
var protectedCss = `.gjsProtectedCss{box-sizing:border-box;}
  @media only screen and (max-width: 470px) {
    body{text-size-adjust: 100%; line-height: 125%;}
    img{max-width:100% !important; height:auto !important;}
    .row{flex-wrap: wrap !important; }
    table, td{max-width:100% !important;}
    p{margin: 0 !important; }
  }
  .row {display:flex;justify-content:flex-start;align-items:stretch;flex-wrap:nowrap;padding:10px;max-width:700px;margin:auto;min-height:95px;}
  .cell {min-height: 10px; flex-grow: 1; flex-basis: 100%; }`;



function loadEditor() {
    // Set up GrapesJS editor with the Newsletter plugin
    var editor = grapesjs.init({
        height: '100%',
            storageManager: {
                autoload: false

    },
        //canvasCss: css not included in final saved html, just for the editor
            canvasCss: 'body{margin-left:auto;margin-right:auto;}@media (max-width: 470px){#wrapper, body{width:auto !important;min-width:unset !important;}}',
            protectedCss: protectedCss,
        keepUnusedStyles: 1,
            canvas: {
                //add an external stylesheet to the editor canvas
                styles: ['/csb/areas/editor/css/editor.css']

    },
        container: '#gjs',
        fromElement: true,
        forceClass: true,
        autorender: false,
            plugins: [
             'gjs-preset-newsletter',
             'gjs-plugin-ckeditor',
             'blocks'
    ],
            pluginsOpts: {
        'gjs-blocks-flexbox': {
            },
            'gjs-preset-newsletter': {
                    modalLabelImport: 'Paste all your code here below and click import',
                    modalLabelExport: 'Copy the code and use it wherever you want',
                    codeViewerTheme: 'default',
                //defaultTemplate: templateImport,
                    importPlaceholder: '<table class="table"><tr><td class="cell">Hello world!</td></tr></table>',
                    cellStyle: {
                        'font-size': '12px',
                        'font-weight': 300,
                        'vertical-align': 'top',
                        color: 'rgb(111, 119, 125)',
                    margin: 0,
                    padding: 0,
            }
            },
            'gjs-plugin-ckeditor': {
                position: 'center',
                    options: {
                    startupFocus: true,
                        extraAllowedContent: '*(*);*{*}', // Allows any class and any inline style
                    allowedContent: true, // Disable auto-formatting, class removing, etc.
                        //enterMode: CKEDITOR.ENTER_BR,
                        extraPlugins: 'sharedspace,justify,colorbutton,panelbutton,font,indentblock,mergeField,closebtn',
                        //we can comment out the toolbar section to see all options or keep the below and control
                        //what appears and where
                        toolbar: [
                          { name: 'styles', items: ['Font', 'FontSize']},
                          ['Bold', 'Italic', 'Underline', 'Strike', 'Superscript', 'Subscript', 'RemoveFormat'],
                          { name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', 'NumberedList', 'BulletedList', 'Indent', 'Outdent', ]},
                          { name: 'links', items: ['Link', 'Unlink', 'Anchor']},
                          { name: 'colors', items: ['TextColor', 'BGColor']},
                          { name: 'insert', items: ['Table', 'SpecialChar']},
                          { name: 'DynamicContent', items: ['mergeField']},
                          { name: 'closebtn', items: ['closebtn'] },
                        ],
            }
            }
}
    });

    window.editor = editor;

    //remove layer button
    var pnm = editor.Panels;
    pnm.removeButton('views', 'open-layers');
    $(".gjs-pn-buttons span").filter(function () {
       return $(this).attr("title") === "Open Layer Manager";
}).hide();


    //hack for ckeditor allowing edit of more tags
    CKEDITOR.dtd.$editable.a = 1
    CKEDITOR.dtd.$editable.span = 1
    CKEDITOR.dtd.$editable.strong = 1
    CKEDITOR.dtd.$editable.b = 1

    //override default use of em tags in editor for italic content
    CKEDITOR.config.coreStyles_italic =
        {
        element: 'span',
            attributes: { 'style': 'font-style:italic'
}
};


    //clear the canvas
    editor.DomComponents.clear();
    editor.CssComposer.clear()
    editor.CssComposer.getAll().reset();
    editor.DomComponents.getWrapper().setStyle('') //needed to reset the body background
    setTimeout(function () {
        clearLocalStorage();
}, 0);


    if (mjmlContent !== "")
        editor.setComponents(mjmlContent);
    else {
        //make some adjustments to the content to fix random usability issues
        htmlContent = updateContentForEditor(htmlContent);

        editor.setComponents(htmlContent);

        //now set htmlContent to what will be pulled from the editor during save for updated content check
        htmlContent = editor.getHtml() + '<style>' + editor.getCss() + '</style>';
    }


    //render the editor
    editor.render();

    setTimeout(function () {
        $(".gjs-pn-panels .gjs-clm-tags").parent('div').append($(".gjs-pn-panels .gjs-clm-tags"));
    }, 1000);


    setEditorListeners();

   

    // Beautify tooltips
    beautifyTooltips();

}


function updateMediaLibaryTrait() {
    $(".gjs-trt-traits").children().first().html('<a onclick="openMediaLibrary();" style="font-size:13px; cursor:pointer;">Campaigner Hosted Media</a>')
}

function openMediaLibrary() {
    var win = new CustomRadWindow();
    var url = "/csb/Library/LibraryDialog.aspx?properties=false";
    win.showWindow('Media Library', url, 1050, 700);
    return false;
}

function updateImgSrc(src) {
    //we have to update the model, and then trigger the view
    //updating the DOM does nothing to trigger a change to update the img src
    editor.TraitManager.getTraitsViewer().collection.models[1].setTargetValue(src);

    //refresh the view
    editor.TraitManager.getTraitsViewer().render();

    //make sure to update the trait since the view was refreshed
    updateMediaLibaryTrait();

}

function updateContentForEditor(html) {

    html = updateLinks(html);

    try {

        var elemHtml = $("<textarea>").html(html);
        //fix an issue with p tags and parent divs
        $(elemHtml).find("p").each(function () {
            if($(this).parent().is("div"))
                $(this).parent().attr("data-gjs-type", "text");
        });
        

        html = $(elemHtml).html();
    }
    catch (x) { console.log("error adjusting <p> tags for editor");}
    return html;
}

function preview() {
    //save content
    redirectToPreview = true;
    saveContent(true);
}

function saveContent(redirect) {

   

    if (!ddUpdateInProgress) {

        $(".wizardButtonSpinner").show().css("display", "inline-block");

        var isNewCampaign = false;
        var isUpdate = false;
        var updatedContent = "";

        // Get the querystring - Is this a first time save?
        var campaignId = getQueryStringParameters()["campaignId"];
        if (campaignId === "0")
            isNewCampaign = true;

        //does the campaign contain MJML Markup
        if (editor.getHtml().match("<mjml>")) {
            mjmlContent = editor.getHtml();
            updatedContent = editor.runCommand('mjml-get-code').html;
        } else {
            //normal html campaign (imported or created outside of editor)
            updatedContent = isNewCampaign ? editor.getHtml() + '<style>' + editor.getCss() + '</style>' : editor.getHtml() + '<style>' + editor.getCss() + '</style>';
            mjmlContent = "";
        }

        //save a call to the thumbnail generator if the content has not changed
        if (updatedContent !== htmlContent)
            isUpdate = true; 

        var data = {
            CampaignId: editorCampaignId,
            HtmlContent: Helper.htmlEncode(updatedContent),
            MjmlContent: Helper.htmlEncode(mjmlContent),
            ProcessThumbnail: isUpdate
        };
        //disable the save button while saving is in progress
        $("#btnSave").addClass("disable");

        $.ajax({
            type: "POST",
            url: "/csb/Editor/SaveContent",
            content: "application/json; charset=utf-8",
            dataType: "html",
            data: data,
            complete: function (d) {

                if (d.responseText === "0")
                    handleError(redirect);
                else {
                    if (redirect && !redirectToPreview) {
                        window.location.href = "/csb/campaigns/templateCampaigns/templateCampaignTextEditor.aspx?campaignId=" + editorCampaignId;
                    }
                    else if (redirect && redirectToPreview) {
                        redirectToPreview = false;
                        window.location.href = "/csb/campaigns/EmailPreviewAndTest.aspx?CampaignId=" + editorCampaignId + "&action=content";
                    }
                    else {

                        toastr.success("Email content successfully saved.", "Success");

                        //enable the save button
                        $("#btnSave").removeClass("disable");
                        ddUpdateInProgress = false;
                        $(".wizardButtonSpinner").hide();

                        if (isNewCampaign) {
                            // let's reload the page so that we don't process this as a new campaign and reload the contents.
                            window.location.href = "/csb/Editor/EditCampaign?campaignId=" + editorCampaignId;
                        }

                        //update the html size
                        updateHtmlSize(editorCampaignId);
                    }
                }
            },
           error: handleError
        });

        ddUpdateInProgress = true;
    }
}

function handleError(redirect) {
     toastr.error("Error saving content.", "Error");
            //enable the save button
            $("#btnSave").removeClass("disable");
        ddUpdateInProgress = false;
        $(".wizardButtonSpinner").hide();


        if (redirect && !redirectToPreview) {
            window.location.href = "/csb/campaigns/templateCampaigns/templateCampaignTextEditor.aspx?campaignId=" + editorCampaignId;
        }
        else if (redirect && redirectToPreview) {
            redirectToPreview = false;
            window.location.href = "/csb/campaigns/EmailPreviewAndTest.aspx?CampaignId=" + editorCampaignId + "&action=content";
        }
}

function getQueryStringParameters(url) {
    if (!url)
        url = window.location.href;

    var vars = [], hash;
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


function initWizardButtons() {

    var btnCancel = $("#btnCancel");
    if (Helper.getParameterByName("campaignId") === "0" || Helper.getParameterByName("D") === "1") { //new campaign or discard flag set - discard logic
        //btnCancel.text("DISCARD");
        btnCancel.attr("href", "");
        btnCancel.on("click", function () {
            DiscardAction();
            return false;
        });
    }
    else {
        //cancel logic
        //btnCancel.text("CANCEL");
        btnCancel.attr("href", "/CSB/Campaigns/Campaigns.aspx");
        btnCancel.removeAttr('onclick');
    }

}

function DiscardAction() {
    $.ajax({
        type: "POST",
        url: "/csb/Editor/Discard",
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: { campaignId: campaignId },
        success: function (d) {
            console.log(d);
            window.location.href = "/csb/campaigns/campaigns.aspx";
        },
        error: function (xhr, textStatus, errorThrown) {
            toastr.error("Error discarding campaign.", "Error");
        }
    });
}

function initCampaign(_campaignId) {

    editorCampaignId = _campaignId;
    //we need to clear browser storage items related to the editor
    clearLocalStorage();


    //load campaign name
    $("#IENameTextBox").val(campaignName);
    $("#IENameTextBox").attr('data-origvalue', campaignName);

}

function clearLocalStorage() {
    var arr = []; // Array to hold the keys
    // Iterate over localStorage and insert the keys that meet the condition into arr
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).substring(0, 3) === 'gjs') {
            arr.push(localStorage.key(i));
        }
    }

    // Iterate over arr and remove the items by key
    for (var j = 0; j < arr.length; j++) {
        localStorage.removeItem(arr[j]);
    }
   
}


function getMergeFields() {

    mergeFieldTags = [];

    var actionUrl = '/CSB/Editor/MergeFields';
    $.getJSON(actionUrl, function (response) {
        if (response !== null) {
            var json = JSON.parse(response);
            
            for (var i = 0; i < json.length; i++) {
                var mergeField = json[i];
                if (mergeField[1].length === 0) //root(category) item   
                    mergeFieldTags[i] = [mergeField[1], "<span onclick='return false' onmousedown='return false' style='font-weight:bold;'>" + mergeField[0] + "<span>", mergeField[0]];
                else 
                    mergeFieldTags[i] = [mergeField[1], "<span class='mergeField'>" + mergeField[0] + "<span>", mergeField[0]];
            }
        }
    });
    
}

//get template import html when campaign is selcted from import dropdown
function getTemplateHtml(dropdown) {
    var selectedCampaignId = dropdown.value;
    var returnContent = "";

    if (dropdown.value != "") {
        $.ajax({
            type: "POST",
            async: false,
            url: "/csb/Editor/GetCampaignContent",
            data: { campaignId: selectedCampaignId },
            content: "application/json; charset=utf-8",
            dataType: "html",
            success: function (d) {

                d = Helper.unescapeQuotes(d);
                d = d.substring(1, d.length - 1)
                d = d.replace(/\\r/g, '').trim();
                returnContent = d.toString().trim();
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log(errorThrown);
                toastr.error("There was an error retrieving the content for the selected campaign.", "Error");
            }
        });
    }
    return returnContent;
}

//get the list of recent campaigns for the import dropdown
function populateImportTemplates() {
    $.ajax({
        type: "POST",
        url: "/csb/Editor/GetRecentCampaigns",
        content: "application/json; charset=utf-8",
        dataType: "json",
        success: function (d) {
            buildImportSelectOptions(d);
        },
        error: function (xhr, textStatus, errorThrown) {
            toastr.error("There was an error retrieving the most recently updated campaigns for your account.", "Error");
        }
    });
}


function buildImportSelectOptions(campaigns) {

   
    var $dropdown = $("#selImportTemplate");
    //only do this once
    if ($dropdown.find('option').length == 0) {
        //add an empty item to the beginning of the list
        $dropdown.append($("<option />").val("").text(""));

        //populate the dropdown list with our campaign Id's and names
        for (var i = 0; i < campaigns.Table.length; i++) {
            var obj = campaigns.Table[i];
            $dropdown.append($("<option />").val(obj.id).text(obj.Campaign_Name));
        }
    }
}

//generate a new element class Id using global var "importIdIndex"
function createId() {
    if (importIdIndex == null || importIdIndex == undefined)
        importIdIndex = 0;

    importIdIndex++;
    const ilen = importIdIndex.toString().length + 3;
    const uid = (Math.random() + 1.1).toString(36).slice(-ilen);
    const nextId = 'i' + uid;
    return nextId;
}



// Use Proxy pattern to catch all alert() calls and use Sweet Alerts library instead
(function (proxied) {
    window.alert = function () {
        // use sweet alert
        swal(arguments[0]);
    };

})(window.alert);


function initHtmlSizeWidget(size, limit) {
    UpdatedHTMLCalcualtionValues(size, limit);
    $("#HTMLCalculatorDiv").show();

    $(".rwCloseButton").click(function () { $(".popover").hide();});
}


function updateHtmlSize(campaignId) {

    if (!ddUpdateInProgress) {

        var data = {
            CampaignId: campaignId,
        };

        $.ajax({
            type: "POST",
            url: "/csb/Editor/UpdatedHTMLCalcualtionValues",
            content: "application/json; charset=utf-8",
            dataType: "html",
            data: data,
            success: function (d) {
                if(d != null) {
                    var values = d.split(',');
                    UpdatedHTMLCalcualtionValues(values[0], values[1]);
                }
                ddUpdateInProgress = false;
                 
            },
            error: function (xhr, textStatus, errorThrown) {
                    ddUpdateInProgress = false;
            }
        });

        ddUpdateInProgress = true;
    }
}
function beautifyTooltips() {
    var titles = document.querySelectorAll('*[title]');
      for (var i = 0; i < titles.length; i++) {
        var el = titles[i];
        var title = el.getAttribute('title');
        title = title ? title.trim(): '';
        if(!title)
          continue;
        el.setAttribute('data-tooltip', title);
        el.setAttribute('data-tooltip-pos', 'bottom');
        el.setAttribute('title', '');
      }
}

function showQuickLinkDialog() {

    //hide the dialog
    CKEDITOR.dialog.getCurrent().hide();

    //hide the inline editor
    //$(".gjs-rte-toolbar").hide();
    
        var win = new CustomRadWindow();
        var url = "/CSB/Campaigns/ManageQuickLinks.aspx";
        win.showWindow('Insert Quicklink', url, 705, 500);
        return false;
}

var selectedLink;

function showReadMoreDialog(readMoreURL, linkName) {

    var readMoreId;
    if (readMoreURL) {
        readMoreId = getQueryStringParameters(readMoreURL)["id"];
    }
    

    //get the dialog
    var d = CKEDITOR.dialog.getCurrent();
    

    var win = new CustomRadWindow();
    var winTitle;

    //existing link - update
    if (readMoreURL) {
        winTitle = "Update Read More Link";
        url = `/CSB/Campaigns/TemplateCampaigns/tinymce/readmore.aspx?LinkName=${linkName}&id=cmp_readmore_id_${readMoreId}&CampaignId=${window.top.campaignId}`;
        selectedElements = d._.selectedElements;
    }
    else {
        winTitle = "Insert Read More Link";
        url = "/CSB/Campaigns/TemplateCampaigns/tinymce/readmore.aspx?CampaignId=" + window.top.campaignId;
    }

    //hide the dialog
    d.hide();

    win.classes = ["readMoreRW"];
    win.showWindow(winTitle, url, 670, 510);
    $(".readMoreRW table").first().height("490px")
    return false;
}

function insertLinkIntoEditor(href, linkName, linkToolTip, linkType, wrapperId) {

    var p = href.split(":");

    var linkObj = {
        anchor: { id: "", name: "" },
        email: { address: "", body: "", subject: "" },
        linkText: linkName,
        lnkToolTip: linkToolTip,
        reportingName: linkName,
        target: { name: "notSet", type: "notSet" },
        type: "url",
        url: { protocol: p[0] + "://", url: href },
        trackClicks: 1
    }

    //get the instance to pass into our ckeditor link plugin fn
    var oEditor = getCKEditor();

    //ckeditor link plugin
    if (linkType === "QuickLink") {
        //don't replace the selected text (if selected) with the quicklink name
        let linkText = oEditor.getSelection().getSelectedText();
        if (linkText)
            linkObj.linkText = linkText;

        insertLinksIntoSelection(oEditor, linkObj);
    }
    else if (linkType === "ReadMore") {
       linkObj.url.protocol = "";
       insertReadMoreLinksIntoSelection(oEditor, linkObj, wrapperId) //cheditor link plugin
   }

    win.closeCustomWindow();


}
function updateReadmoreLinkFromCampaign(readMoreId, isUpdate, linkText) {

    //get the instance to pass into our ckeditor link plugin fn
    var oEditor = getCKEditor();

    if (!linkText)
        linkText = '';
    
    editReadMoreLinkInSelection(oEditor, selectedElements, linkText);

    win.closeCustomWindow();
}

function getCKEditor() {
    //get the id of the visible ckeditor (multiple instances)
    var cke = $(".cke:visible").attr("id");

    //get the name of the editor
    var editorName = cke.split("_")[1];

    //get the instance to pass into our ckeditor link plugin fn
    var oEditor = CKEDITOR.instances[editorName];

    return oEditor;
}
function removeRSSBlock() {
    var comp = editor.getSelected();
    var coll = comp.collection;
    coll.remove(comp);
}

function setEditorListeners() {
    //organize blocks into sections
    editor.on('load', function() {
        $(".gjs-blocks-c .divider").after("<hr>");
        $(".gjs-blocks-c .buttonBlock").after("<hr>");
    });


// On component change show the Style Manager
    editor.on('component:selected', () => {
        const selected = editor.getSelected();

        if (selected) {
            if(selected.is('flexRow')) {
                // Don't switch when the Layer Manager is on or
                const openSmBtn = pn.getButton('views', osm);
                openSmBtn && openSmBtn.set('active', 1);

                expandSections();

                setSliderValue(selected);
            }
            if(selected.is('flexCol')) {
                var acSector = editor.StyleManager.getSector("ca");
                if(acSector === null) 
                    addAlignmentSector();
                else 
                    $("#gjs-sm-content_alignment").show();

    
                //reposition the sector to the top
                var alignmentSector = $("#gjs-sm-content_alignment");
                $("#gjs-sm-content_alignment").insertBefore($("#gjs-sm-decorations"));


                //add our event listeners to both select elements
                $("#gjs-sm-content_alignment select").each(function() {
                    $(this).on("change", function(e){
                        updateClass(selected);
                    })	
                });


            }
            else 
                $("#gjs-sm-content_alignment").hide();

            //hide the typography sector for all comps except wrapper/body
            if(selected.get('wrapper')) 
                $("#gjs-sm-typography").show();
            else
                $("#gjs-sm-typography").hide();

        }
    });



    //on component drop show the style manager
        editor.on('canvas:drop', (DataTransfer, model) => {
            try {  
                if(model) {
                    if(model.get('type') == "flexRow") {
                        editor.select(model);
                    }
                }
            }
            catch(x) {}
        });


    //detect when we click on the body to show the blocks
    var editorBody = editor.Canvas.getBody();
    editor.on('component:selected', () => {
        const selected = editor.getSelected();

        if (selected.get('wrapper') == "1") {
            // Don't switch when the Layer Manager is on or
            const openSmBtn = editor.Panels.getButton('views', 'open-blocks');
            openSmBtn && openSmBtn.set('active', 1);
        }
    });

    
    //detect when the enter key is pressed to shift the position of the inline-editor
    $(editor.Canvas.getWrapperEl()).keyup(function (e) {
        if (e.keyCode == 13) {
            //$(this).trigger('enter'); //cool idea to listen for a custom event in a backbone view
            editor.RichTextEditor.udpatePosition();
        }
    });



    //disable all links while inside editor
    $(editor.Canvas.getWrapperEl()).find("a").click(function (e) { e.preventDefault(); })



}