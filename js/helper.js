console.log('Helper loaded..')
//Global variables
var assetsData; 
var selectedAssetData; 
var sdkHTML; //HTML To be stored in SDK

var sdk = new window.sfdc.BlockSDK({
    blockEditorWidth: 500,
    tabs: [
        "stylingblock"
    ]
    });
    

$(document).ready(showPages);

function showPages(){
    
    var p1 = $('#page1');
    var p2 = $('#page2');
    var p3 = $('#page3');
    ($('#showp1').val() == 'true' ? p1.show() : p1.hide() ); 
    ($('#showp2').val() == 'true' ? p2.show() : p2.hide() ); 
    ($('#showp3').val() == 'true' ? p3.show() : p3.hide() ); 

    $('.nxtBtn').each(function(i) { 
        this.addEventListener('click', function() { 
            if($(this).attr('id') == 'p1nxt') {
                loadPage2();
            }
            else if($(this).attr('id') == 'p2nxt') {
                //Check if all fields are filled 
                var allValid = true; 
                $('#p2ErrorMessage').html('');
                $('*[required]').each(function(j) { 
                    if($(this).val().length == 0) {
                        $('#p2ErrorMessage').append('<br>' + 'Fill ' + $(this).attr('id') + ' field.');
                        console.log('Fill ' + $(this).attr('id') + ' field.') 
                        allValid = false; 
                    }
                } );
                //Move to next page if all fields are filled
                if(allValid){ 
                    loadPage3();
                }
            }
            else if($(this).attr('id') == 'p3done') {
                $('#page1').hide();
                $('#page2').hide();
                $('#page3').show();
                $('#completeMessage').append("<br><br><br><div>Updating SDK Content for preview</div>");

                updateSDKOnCompletion();
            }
            console.log('clicked next button - ' + $(this).attr('id')); 
        }); 
    });

    $('.backBtn').each(function(i) { 
        this.addEventListener('click', function() { 
            if($(this).attr('id') == 'p2back') {
                $('#page1').show();
                $('#page2').hide();
                $('#page3').hide();
            }
            else if($(this).attr('id') == 'p3back') {
                $('#page1').hide();
                $('#page2').show();
                $('#page3').hide();
            }
            console.log('clicked back button - ' + $(this).attr('id')); 
        }); 
    });
}

function loadPage2(){
    
    //Clean the page 
    $('#configFields').html('');

    $('#page1').hide();
    $('#page2').show();
    $('#page3').hide();

    var selectedAsset = $('#assetDropdownList').find(':selected').val();
    var selectedAssetIndex = $('#assetDropdownList').prop('selectedIndex');
    var configFields = jQuery.parseJSON(assetsData[selectedAssetIndex]['configFields']);
    console.log(configFields);
    console.log('setting config fields')

    //Store Gloabl Variable 
    selectedAssetData = assetsData[selectedAssetIndex];
    console.log('Global variable set '); 
    console.log( selectedAssetData);

    for(var i=0; i<configFields.length; i++) {
        var newElement = '';
        switch(configFields[i].type) {
            case 'text': 
                var newElement = createTextField(configFields[i]);
                console.log('Generate text field');
                break;
            case 'richText': 
                var newElement = createRichTextField(configFields[i]);
                console.log('Generate richText field');
                break;
            case 'image': 
                var newElement = createImageField(configFields[i]);
                console.log('Generate image field');
                break;
            case 'button': 
                var newElement = createButtonField(configFields[i]);
                console.log('Generate button field');
                break;
            default: 
                console.log('Unknown field')
        } 
        
        //Add element 
        $('#configFields').append(newElement);
    }
}

function createTextField(field){
    var eDiv = $('<div/>', {
        text: field.name,
        id: 'div' + field.id,
        class: 'tbc_class'
    });

    var eTxt = $('<input/>',{
        id: field.id,
        maxlength: field.length,
        class: 'tbc_input_class'
    });
    eTxt.prop('required', true);

    var parentDiv = $('<div/>',{
        id: 'parentDiv' + field.id,
        class: 'tbc_class'
    })
    .append(eDiv)
    .append(eTxt);

    return parentDiv;
}

function createRichTextField(field){
    var eDiv = $('<div/>', {
        text: field.name,
        id: 'div' + field.id,
        class: 'tbc_class'
    });

    var eTxt = $('<textArea/>',{
        id: field.id,
        maxlength: field.length,
        class: 'tbc_input_class'
    });
    eTxt.prop('required', true);

    var parentDiv = $('<div/>',{
        id: 'parentDiv' + field.id,
        class: 'tbc_class'
    })
    .append(eDiv)
    .append(eTxt);

    return parentDiv;
}

function createImageField(field){
    var eDiv = $('<div/>', {
        text: field.name,
        id: 'div' + field.id,
        class: 'tbc_class'
    });

    var eTxt = $('<text/>',{
        id: field.id,
        maxlength: field.length,
        class: 'tbc_input_class'
    });
    eTxt.prop('required', true);

    var parentDiv = $('<div/>',{
        id: 'parentDiv' + field.id,
        class: 'tbc_class'
    })
    .append(eDiv)
    .append(eTxt);

    return parentDiv;
}

function createButtonField(field){
    var eDiv = $('<div/>', {
        text: field.name,
        id: 'div' + field.id,
        class: 'tbc_class'
    });

    var eTxt = $('<input/>',{
        id: field.id,
        maxlength: field.length,
        class: 'tbc_input_class'
    });
    eTxt.prop('required', true);

    var parentDiv = $('<div/>',{
        id: 'parentDiv' + field.id,
        class: 'tbc_class'
    })
    .append(eDiv)
    .append(eTxt);

    return parentDiv;
}

/* 
    Get all entered value
    Set in MJML 
    Render to HTML
    Set in SDK
*/
function loadPage3(){
    var msAttr = {};
    var msText = '';
    sdkHTML = '';

    //Hide other pages
    $('#page1').hide();
    $('#page2').hide();
    $('#page3').show();

    //Get filled in values
    var configFields = jQuery.parseJSON(selectedAssetData['configFields']);
    for(field in configFields){
        msAttr[configFields[field]['id']] = $('#' + configFields[field]['id']).val()
    }
    
    if(selectedAssetData['isMjml'] == 'True') {
        msText = selectedAssetData['mjmlContent']
    } else {
        msText = selectedAssetData['htmlContent']
    }


    console.log('Rendering Mustache JS')
    console.log(msText)
    console.log(msAttr)
    //Render content with Mustache JS
    var output = Mustache.render(msText, msAttr);
    console.log(output)

    if(selectedAssetData['isMjml'] == 'True') {
        console.log('Rendering MJML')
        var mjmlOutput = mjml(output);
        console.log(mjmlOutput)
        if(mjmlOutput.errors.length == 0){
            sdkHTML = mjmlOutput.html;
        }else {
            sdkHTML = "ERROR Rendering MJML"
        }
    } else {
        sdkHTML = output;
    }

    console.log('Mjml Rendered HTML ')
    console.log(sdkHTML);
    $('#completeMessage').html(sdkHTML);
    //TODO: 
    /* Set html to SDK 
    set a 'pagenumber' variable in sdk 
    read pagenumber from sdk on pageload. If 3, then show last screen

    store 'all' the values selected into SDK
    and on page load, reterive all the values and set in the html of the page 

    */
    
}

async function getAssets() { 
    /*  
        Fetch asset details 
        API endpoint - https://mc-yfyyj2sjhsjhkwc1s8w4zrxx4.pub.sfmc-content.com/u4n3s0myx1b
    */
    var assetEndpoint = 'https://mc-yfyyj2sjhsjhkwc1s8w4zrxx4.pub.sfmc-content.com/u4n3s0myx1b'
    var getAssets = await fetch(assetEndpoint)
    var assetData = getAssets.json(); 
    return assetData;
}

getAssets().then(
    function(assets) { 
        assetsData = assets;
        console.log('fetched..');
        console.log(assets);
        for(var i=0;i<assets.length; i++) {
            $('#assetDropdownList').append($('<option>', {
                value: assets[i]['assetName'],
                text: assets[i]['assetName']
            }));
        }
    },
    function(error){
        console.log('ERROR FETCHING!!')
    }
);

/*if(htmlOutput.html.length > 0) {
        htmlOutput.html = sanitiseHtml(htmlOutput.html);
        //console.log(htmlOutput.html)
        sdk.getContent(function (content) {
            sdk.setContent(htmlOutput.html); 
        });

        sdk.getData(function (data) {
            data["mjml"] = textAreaContent;
            data["html"] = htmlOutput.html;
            sdk.setData(data);
        });

        if(htmlOutput.errors.length > 0){
            document.getElementById("errorMsg").innerHTML = "";
            document.getElementById("alertBox").style.display = "block";
            for(e in htmlOutput.errors) {
            document.getElementById("errorMsg").innerHTML += 'Line #' + htmlOutput.errors[e].line + ": [" + htmlOutput.errors[e].tagName + "] " + htmlOutput.errors[e].message + "<br>";
            }
        }
    } else {
        document.getElementById("errorMsg").innerHTML = "";
        document.getElementById("alertBox").style.display = "block";
        document.getElementById("errorMsg").innerHTML = "[ERROR]: Not a valid MJML document/ component.";
        for(e in htmlOutput.errors) {
            document.getElementById("errorMsg").innerHTML += 'Line #' + htmlOutput.errors[e].line + ": [" + htmlOutput.errors[e].tagName + "] " + htmlOutput.errors[e].message + "<br>";
        }
    }*/

function updateSDKOnCompletion() { 
    sdk.getContent(function (content) {
        console.log('setting below html to Preview screen');
        console.log(sdkHTML);
        sdk.setContent(sdkHTML); 
    });
}