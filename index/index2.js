
const url = "http://localhost:3000/post";
var queryWrapper;
var activeUserSession;
var ItemList;
window.onload = function (){
    $.post(url+'?data='+JSON.stringify({
        'actionType' : 'loadInventoryData',
    }), response => {
    }); // Loading Database.

    loadPagePass().then(function (result){
        //console.log(result);
        if(result.Status == false){
        //     var h1 = document.createElement("h2");
        //     $(h1).append("Invalid Access Method. <br><br>" + "Navigate to <a href=\"http://localhost:3000/\">login</a> page and sign in.");
        //     $("#home").append(h1);
        //     return
        }else {
            //Header, First thing client sees when page is loaded.
    var h1 = document.createElement("h2");
    $(h1).append("Welcome," + " " + result.FirstName);
    $("#home").append(h1);
        }
        loadPage();
    })
}

function loadPagePass(){
        return new Promise((resolve,reject) => {
            $.post(url+'?data='+JSON.stringify({
                'actionType' : 'loadUserInformation'
                }), response =>{
                    //console.log(response.docs);
                    resolve(response);
                })
        })
}
function loadPage(){

    // View Inventory Button.
    var btn = document.createElement("button");
    $(btn).attr("class","homeButtonTopRow");
    $(btn).attr("id","viewInv");
    $(btn).append("View Inventory");
    $(btn).attr("onclick","viewInventory();");
    $("#CurrentInventory").append(btn);

    // Import a Database
    btn = document.createElement("button");
    $(btn).attr("class","homeButtonTopRow");
    $(btn).attr("id","importDatabase");
    $(btn).append("*Import Database");
    $(btn).attr("onclick","");
    $("#CurrentInventory").append(btn);
}

function viewInventory(){
    if(queryWrapper != undefined){
        removeElements(queryWrapper);
    }
    // HTML generating code.
    var newDiv = document.createElement("div");
    $(newDiv).attr("id","viewInventory");
    $("#CurrentInventory").after(newDiv);
    
    var newDiv = document.createElement("div");
    $(newDiv).attr("id","buttonsHeader");
    $("#CurrentInventory").append(newDiv);
    
    if ($('#buttonsHeader').is(':empty')){
        // Insert Item Button.
        btn = document.createElement("button");
        $(btn).attr("class","homeButtonTopRow");
        $(btn).attr("id","insertItemB");
        $(btn).append("Insert Item");
        $(btn).attr("onclick","insertItem();");
        $("#buttonsHeader").append(btn);

        // Update Item
        btn = document.createElement("button");
        $(btn).attr("class","homeButtonTopRow");
        $(btn).attr("id","updateItem");
        $(btn).append("Update Item");
        $(btn).attr("onclick","");
        $("#buttonsHeader").append(btn);
        
    }
    // Find an Item
    btn = document.createElement("button");
    $(btn).attr("class","homeButtonTopRow");
    $(btn).attr("id","findItem");
    $(btn).append("Find an Item");
    $(btn).attr("onclick","");
    $("#viewInventory").append(btn);

    // Delete Item
    btn = document.createElement("button");
    $(btn).attr("class","homeButtonTopRow");
    $(btn).attr("id","deleteItem");
    $(btn).append("Delete Item");
    $(btn).attr("onclick","deleteItem();");
    $("#viewInventory").append(btn);
    
    // Disabling this button.
    $("#viewInv").attr("disabled","true");

    // Making all other buttons clickable.
    $("#insertItemB").removeAttr("disabled"); // Insert Item
    $("#updateItem").removeAttr("disabled"); // Update Item
    $("#findItem").removeAttr("disabled"); // Find Item
    $("#importDatabase").removeAttr("disabled"); // Import Database.

    
    //createTable();
    loadItems();
    queryWrapper = '#viewInventory';

}
function deleteItem(){
    var newDiv = document.createElement("div");
    $(newDiv).attr("id","deleteItemDiv");
    $("#CurrentInventory").append(newDiv);

    var newDiv = document.createElement("div");
    $(newDiv).attr("id","deleteItemDivv");
    $("#deleteItemDiv").append(newDiv);

    var checkBox = document.createElement("input");
    $(checkBox).attr("id","NumberCheckBox");
    $(checkBox).attr("type","checkbox");
    $(checkBox).attr("onclick","CheckBoxClick('NumberCheckBox');")
    $("#deleteItemDivv").append(checkBox);

    var label = document.createElement("label");
    $(label).append("Item Number");
    $(label).css("margin-right","10px");
    $("#deleteItemDivv").append(label);

    var checkBox = document.createElement("input");
    $(checkBox).attr("id","IDCheckBox");
    $(checkBox).attr("type","checkbox");
    $(checkBox).attr("onclick","CheckBoxClick('IDCheckBox');");
    $("#deleteItemDivv").append(checkBox);
    var label = document.createElement("label");
    $(label).css("margin-right","10px");
    $(label).append("Item ID");
    $("#deleteItemDivv").append(label);

    var checkBox = document.createElement("input");
    $(checkBox).attr("id","OriginCheckBox");
    $(checkBox).attr("type","checkbox");
    $(checkBox).attr("onclick","CheckBoxClick('OriginCheckBox');");
    $("#deleteItemDivv").append(checkBox);
    $(label).css("margin-right","10px");
    var label = document.createElement("label");
    $(label).append("Item Origin <br>");
    $("#deleteItemDivv").append(label);


    var label = document.createElement("label");
    var br = document.createElement("br");
    var input = document.createElement("input");
    $(label).append("Delete by Item Number : <br>");
    $("#deleteItemDivv").append(label);
    $(input).attr("type","text");
    $(input).attr("class","inputBox");
    $(input).attr("id","deleteItemNumber");
    $("#deleteItemDivv").append(input);
    $("#deleteItemDivv").append(br);

    var input = document.createElement("input");
    var label = document.createElement("label");
    var br = document.createElement("br");
    $(label).append("Delete by Item ID : <br>");
    $("#deleteItemDivv").append(label);
    $(input).attr("type","text");
    $(input).attr("class","inputBox");
    $(input).attr("id","deleteItemID");
    $("#deleteItemDivv").append(input);
    $("#deleteItemDivv").append(br);

    var input = document.createElement("input");
    var label = document.createElement("label");
    var br = document.createElement("br");
    $(label).append("Delete by Item Origin : <br> *This will DELETE ALL ITEMS COMING FROM THIS ORIGIN!* <br>");
    $("#deleteItemDivv").append(label);
    $(input).attr("type","text");
    $(input).attr("class","inputBox");
    $(input).attr("id","deleteItemOrigin");
    $("#deleteItemDivv").append(input);
    $("#deleteItemDivv").append(br);

    var btn = document.createElement("button");
    $(btn).append("Delete Items");
    $(btn).attr("id","DeleteItemBtn");
    $(btn).attr("onclick","deleteItemValues();");
    $(btn).attr("disabled","true");
    $(btn).css("background-color","white");
    $("#deleteItemDivv").append(btn);

    var btn = document.createElement("button");
    $(btn).append("Close");
    $(btn).attr("onclick","removeElements('#deleteItemDiv')");
    $("#deleteItemDivv").append(btn);


}

function CheckBoxClick(CheckBoxType){ // Making sure CheckBox values dont conflict.
    var NumberCheckBox = document.getElementById("NumberCheckBox");
    var IDCheckBox = document.getElementById("IDCheckBox");
    var OriginCheckBox = document.getElementById("OriginCheckBox");

    // Emptying all Input fields.
    var ItemNumberInput = document.getElementById("deleteItemNumber");
    var ItemIDInput = document.getElementById("deleteItemID");
    var ItemOriginInput = document.getElementById("deleteItemOrigin");
    ItemNumberInput.value = null;
    ItemIDInput.value = null;
    ItemOriginInput.value = null;

    if(CheckBoxType == 'NumberCheckBox'){
        IDCheckBox.checked = false;
        OriginCheckBox.checked = false;
        $("#deleteItemNumber").removeAttr("disabled");
        $("#deleteItemID").attr("disabled","true");
        $("#deleteItemOrigin").attr("disabled","true");
        $("#DeleteItemBtn").removeAttr("disabled");
    }

    if(CheckBoxType == 'IDCheckBox'){
        NumberCheckBox.checked = false;
        OriginCheckBox.checked = false;

        $("#deleteItemID").removeAttr("disabled");
        $("#deleteItemNumber").attr("disabled","true");
        $("#deleteItemOrigin").attr("disabled","true");
        $("#DeleteItemBtn").removeAttr("disabled");
    }

    if(CheckBoxType == 'OriginCheckBox'){
        IDCheckBox.checked = false;
        NumberCheckBox.checked = false;

        $("#deleteItemOrigin").removeAttr("disabled");
        $("#deleteItemID").attr("disabled","true");
        $("#deleteItemNumber").attr("disabled","true");
        $("#DeleteItemBtn").removeAttr("disabled");
    }
}
function loadHeaders(){
    return new Promise((resolve,reject) => {
        $.post(url+'?data='+JSON.stringify({
            'actionType' : 'loadDatabaseHeader'
            }), response =>{
                //console.log(response.docs);
                resolve(response);
            })
    })
}

function loadItems(){
    createTable().then(function(result){
        var rowItems=[];
        for(var i = 0; i < result.length; i++){
            rowItems[i] = Object.values(result[i]);
        }
        //console.log(Object.values(result));
        console.log(rowItems);
        ItemList = rowItems;
        for(var i = 0;i < result.length; i++){ 
            var tr = document.createElement("tr");
        $("#viewInventory").append(tr);
            //console.log(result);
            for(var j = 0;j < rowItems[i].length; j++){
                    var td = document.createElement("td");
                    $(td).append(rowItems[i][j]);
                    $("#viewInventory").append(td);
             }
        }
    });
}
function createTable(){

    var Items = loadHeaders().then(function(result){
        var table = document.createElement("table");
        $("#viewInventory").append(table);

        var tr = document.createElement("tr");
        $("#viewInventory").append(tr);
        
        var headersEntries = Object.keys(result.docs[0]);
        //console.log(Object.keys(result.docs));
        var Values = Object.values(result.docs[0]);


        for(var i = 0; i < headersEntries.length; i++){
            var th = document.createElement("th");
            // $(th).append("This is Header Number #" + i);
            $(th).append(headersEntries[i]);
            $("#viewInventory").append(th);
        }
        // MAKE A SEPERATE FUNCTION TO DISPLAY ITEMS.
        // var tr = document.createElement("tr");
        // $("#viewInventory").append(tr);
    
        // for(let i = 0; i < ;i++){
        //     var td = document.createElement("td");
        //     $(td).append(*Value to be Displayed*);
        //     $("#viewInventory").append(td);
        // }
        return result.docs;
    });
    return Items;
}

function insertItem(){
    if(queryWrapper != undefined){
        removeElements(queryWrapper);
    }

    var randomNum = itemNumberGen();
    var newDiv = document.createElement("div");
    $(newDiv).attr("id","insertItem");
    $("#CurrentInventory").after(newDiv);


    $("#insertItemB").attr("disabled","true");
    
    var label = document.createElement("label");
    var input = document.createElement("input");
    var br = document.createElement("br");

    $(label).append("Item Number  : ");
    $("#insertItem").append(label);
    var label = document.createElement("label");
    $(label).append(randomNum + "<br><br>");
    $(label).attr("id","itemNumber");
    $("#insertItem").append(label);
    $("#insertItem").append(br);
    $("#insertItem").append(label);

    var label = document.createElement("label");
    var br = document.createElement("br");
    $(label).text("Item Name : ");
    $("#insertItem").append(label);
    $("#insertItem").append(br);
    $(input).attr("type","text");
    $(input).attr("class","inputBox");
    $(input).attr("id","itemName");
    $("#insertItem").append(input);

    var label = document.createElement("label");
    var input = document.createElement("input");
    var br = document.createElement("br");
    $(label).append("<br>Price : ");
    $("#insertItem").append(label);
    $("#insertItem").append(br);
    $(input).attr("type","text");
    $(input).attr("class","inputBox");
    $(input).attr("id","Price");
    $("#insertItem").append(input);

    var label = document.createElement("label");
    var input = document.createElement("input");
    var br = document.createElement("br");
    $(label).append("<br>Quantity : ");
    $("#insertItem").append(label);
    $("#insertItem").append(br);
    $(input).attr("type","text");
    $(input).attr("class","inputBox");
    $(input).attr("id","Quantity");
    $("#insertItem").append(input);

    var label = document.createElement("label");
    var input = document.createElement("input");
    var br = document.createElement("br");
    $(label).append("<br>Latest Shipment : ");
    $("#insertItem").append(label);
    $("#insertItem").append(br);
    $(input).attr("type","date");
    $(input).attr("class","inputBox");
    $(input).attr("id","latestShipment");
    $("#insertItem").append(input);

    var label = document.createElement("label");
    var input = document.createElement("input");
    var br = document.createElement("br");
    $(label).append("<br>Next Shipment : ");
    $("#insertItem").append(label);
    $("#insertItem").append(br);
    $(input).attr("type","date");
    $(input).attr("class","inputBox");
    $(input).attr("id","nextShipment");
    $("#insertItem").append(input);

    var label = document.createElement("label");
    var input = document.createElement("input");
    var br = document.createElement("br");
    $(label).append("<br>Item Origin : ");
    $("#insertItem").append(label);
    $("#insertItem").append(br);
    $(input).attr("type","text");
    $(input).attr("class","inputBox");
    $(input).attr("id","itemOrigin");
    $("#insertItem").append(input);

    var btn = document.createElement("button");
    var br = document.createElement("br");
    $("#insertItem").append(br);
    $(btn).append("Submit");
    $(btn).attr("id","insertItemBtn");
    $(btn).attr("onclick","addItem();");
    $("#insertItem").append(btn);

    // Making all other buttons clickable.
    $("#viewInv").removeAttr("disabled"); // Veiw Inventory
    $("#updateItem").removeAttr("disabled"); // Update Item
    $("#findItem").removeAttr("disabled"); // Find Item
    $("#importDatabase").removeAttr("disabled"); // Import Database.
    
    // This should close the interface, setting up to be deleted.
    queryWrapper = '#insertItem';
}

function deleteItemValues(){
    var ItemNumber = document.getElementById("deleteItemNumber").value;
    var ItemOrigin = document.getElementById("deleteItemOrigin").value;
    var ItemID = document.getElementById("deleteItemID").value;
    var dKey;
    var dValue;

    if(ItemNumber != ""){
        dKey = 'item_Number';
        dValue = parseInt(ItemNumber);
    }else if(ItemOrigin != ""){
        dKey = 'item_Origin';
        dValue = ItemOrigin;
    }else if(ItemID != ""){
        dKey = '_id';
        dValue = ItemID;
    }

    console.log(ItemList);
    // for(var i=0; i < ItemList.length; i++){
    // }
    deleteItemServerSide(dKey,dValue);
}

function deleteItemServerSide(itemType,item){ // Delete Item Server side requests.
    removeElements("#TempRe");
    if(itemType == 'item_Number'){
        console.log(true);
        $.post(url+'?data='+JSON.stringify({
            'actionType' : 'deleteItem',
            'item_Number' : item
            }), response =>{
                if(response.Status == 'Success'){
                    var newDiv = document.createElement("div");
                    var span = document.createElement("span");
                    $(newDiv).attr("class","alert");
                    $(newDiv).attr("id","TempRe");
                    $(newDiv).append("Item Successfully Deleted.");
                    $("#deleteItemDivv").append(newDiv);

                    $(span).attr("class","closebtn");
                    $(span).attr("onclick","this.parentElement.style.display='none';");
                    $(span).append("&times;");
                    $(".alert").append(span);

                }else if(response.Status == 'Failed'){
                    alert("Something went wrong. Invalid Item Number.");
                }
            })
    }else if(itemType == '_id'){
        console.log(true);
        $.post(url+'?data='+JSON.stringify({
            'actionType' : 'deleteItem',
            '_id' : item
            }), response =>{
                if(response.Status == 'Success'){
                    var newDiv = document.createElement("div");
                    var span = document.createElement("span");
                    $(newDiv).attr("class","alert");
                    $(newDiv).append("Item Successfully Deleted.");
                    $("#deleteItemDivv").append(newDiv);

                    $(span).attr("class","closebtn");
                    $(span).attr("onclick","this.parentElement.style.display='none';");
                    $(span).append("&times;");
                    $(".alert").append(span);
                }else if(response.Status == 'Failed'){
                    return false
                }
            })
    }else if(itemType == 'item_Origin'){
        console.log(itemType);
        $.post(url+'?data='+JSON.stringify({
            'actionType' : 'deleteItem',
            'item_Origin' : item
            }), response =>{
                if(response.Status == 'Success'){
                    var newDiv = document.createElement("div");
                    var span = document.createElement("span");
                    $(newDiv).attr("class","alert");
                    $(newDiv).append("Items Successfully Deleted.");
                    $("#deleteItemDivv").append(newDiv);

                    $(span).attr("class","closebtn");
                    $(span).attr("onclick","this.parentElement.style.display='none';");
                    $(span).append("&times;");
                    $(".alert").append(span);
                }else if(response.Status == 'Failed'){
                    return false
                }
            })
    }
}

function removeElements(wrapper){
    $(wrapper).remove();
}
function itemNumberGen(){
    var randomNum = Math.floor((Math.random() * 1000000000)) + 10000;
    var returnNum;
    
    switch(true) {
        case (randomNum < 10000000):
            returnNum = '0' + randomNum;       
        case (randomNum < 1000000):
            returnNum = '00' + randomNum;
        case (randomNum < 100000):
            returnNum = '0000' + randomNum;
        case (randomNum < 10000):
            returnNum = '0000' + randomNum;
        case (randomNum < 1000000):
            returnNum = '000' + randomNum;
        
        
            default:
            returnNum = randomNum;
   } 
   return returnNum;
}

function addItem(){
    // This is to grab item Information.
    var itemNumber = parseInt(document.getElementById("itemNumber").innerHTML);
    var itemName = document.getElementById("itemName").value;
    var itemPrice = "$"+ document.getElementById("Price").value;
    var itemQuantity = document.getElementById("Quantity").value;
    var itemLatestShipment = document.getElementById("latestShipment").value;
    var itemNextShipment = document.getElementById("nextShipment").value;
    var itemOrigin = document.getElementById("itemOrigin").value;
    // Check if any of required fields are empty.
    if(itemName.length == 0){
        alert("Please fill in all required fields");
    }else{
        const newItem = {
            'item_Number' : itemNumber,
            'item_Name' : itemName,
            'item_Price' : itemPrice,
            'item_Quantity' : itemQuantity,
            'item_Origin' : itemOrigin,
            'item_Next_Shipment' : itemNextShipment,
            'item_Last_Shipment' : itemLatestShipment
        }
        $.post(url+'?data='+JSON.stringify({ // Sending items to Inventory.
            'actionType' : 'addNewItem',
            newItem
            }), response => {
                if(response.Status == true){
                    console.log("This is running");
                    var newDiv = document.createElement("div");
                    var span = document.createElement("span");
                    $(newDiv).attr("class","alert");
                    $(newDiv).append("Item Successfully Inserted.");
                    $("#insertItem").append(newDiv);

                    $(span).attr("class","closebtn");
                    $(span).attr("onclick","this.parentElement.style.display='none';");
                    $(span).append("&times;");
                    $(".alert").append(span);
                }
        }); 
    }
}