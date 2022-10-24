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

    //Set SDK Data on pageload
    sdk.getData(function(data){
        console.log('1. data on pageload.')
        console.log(data)
        if(data.hasOwnProperty('selectedAssetIndex')) {
            console.log('Asset preselected.');
            $('#assetDropdownList').prop('selectedIndex', data['selectedAssetIndex'])
            //TODO: This doesn't seem to work
        }

        if(data.hasOwnProperty('step3')) {
            console.log(data['step3']['msAttr']);
            var msAttr = data['step3']['msAttr'];
            var keys = Object.keys(msAttr)
            for(var k in keys) {
                console.log(keys[k] + ' -- ' + msAttr[keys[k]]);
                $(keys[k]).val(msAttr[keys[k]]);
            }
        }
    });
}

function loadPage2(){
    /* Store data from page 1 */
    sdk.getData(function(data){
        if(data.hasOwnProperty('selectedAssetIndex')) {
            var t = {};
            t['selectedAssetIndex'] = $('#assetDropdownList').prop('selectedIndex');
            sdk.setData(t);
        }
    });
    
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


    /* Set SDK Values */
    /* var sdkData = {};
    sdkData['selectedAssetIndex'] = selectedAssetIndex;
    console.log('Step 2 - Set sdkData: ')
    console.log(sdkData)
    sdk.setData(sdkData);    
    */
    //Set SDK Data on pageload
    sdk.getData(function(data){
    console.log('1. data on pageload.')
    console.log(data)
    if(data.hasOwnProperty('selectedAssetIndex')) {
        console.log('Asset preselected.');
        $('#assetDropdownList').prop('selectedIndex', data['selectedAssetIndex'])
        //TODO: This doesn't seem to work
    }

    if(data.hasOwnProperty('step3')) {
        console.log(data['step3']['msAttr']);
        var msAttr = data['step3']['msAttr'];
        var keys = Object.keys(msAttr)
        for(var k in keys) {
            console.log(keys[k] + ' -- ' + msAttr[keys[k]]);
            $(keys[k]).val(msAttr[keys[k]]);
        }
    }
});
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

function getPage2Data(){
    var t = {}; 
    $('#page2 :input').not('#page2 :input[type=button]').each(function(i) { 
        console.log($(this).val());
        console.log($(this).attr('id'));
        t[$(this).val()] = $(this).attr('id');
    });
    return t; 
}

/* 
    Get all entered value
    Set in MJML 
    Render to HTML
    Set in SDK
*/
function loadPage3(){
    /* Store data from page 1 */
    sdk.getData(function(data){
        //if(data.hasOwnProperty('selectedAssetIndex')) {
            //data['mk123']
        var t = {};
        t['step2'] = getPage2Data();
        sdk.setData(t);
        console.log('data saved in page 3')
        console.log(t)
        //}
    });

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

    /* 
        TODO: Santise MJML to remove title and meta tags 
    */
    
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

    sdk.getData(function(s3sdkData){
        console.log('Data received on step 3 - s3sdkData');
        console.log(s3sdkData);
        s3sdkData['step3'] = {};
        s3sdkData['step3']['sdkHTML'] = sdkHTML;
        s3sdkData['step3']['msAttr'] = msAttr;

        console.log('Step 3 - Set s3sdkData: ')
        console.log(s3sdkData)
        sdk.setData(s3sdkData);    
    });
       
    
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

async function getToken() {
    var tokenEndpoint = 'https://mc.s10.exacttarget.com/cloud/update-token.json';
    var options = {
        credentials: "include",
        mode: "no-cors" 
    }
    var getToken = await fetch(tokenEndpoint, options)
    //var tokenData = getToken.json(); 
    console.log('Async Functoin');
    console.log(getToken);
    return getToken;
}

function updateSDKOnCompletion() { 
    sdk.getContent(function (content) {
        console.log('setting below html to Preview screen');
        console.log(sdkHTML);
        sdk.setContent(sdkHTML); 
    });
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
        /* if SDK has data - load it */ 
        //Set SDK Data on pageload
        sdk.getData(function(data){
            console.log('getAssets() data on pageload.')
            console.log(data)
            if(data.hasOwnProperty('selectedAssetIndex')) {
                console.log('Asset preselected.');
                $('#assetDropdownList').prop('selectedIndex', data['selectedAssetIndex'])
            }
        }); 

    },

    function(error){
        console.log('ERROR FETCHING!!')
    }
);


getToken().then(
    function(token) { console.log(token);

    },

    function(error){
        console.log(error);
    }
);

