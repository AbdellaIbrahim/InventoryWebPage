
/*
The strategy used in designing this website is as follows
1. jQuery is used to load webpages, hence hiding most HTML codes.
2. Requests are sent to a running server loaded up in JSON objects.
    Each JSON object contains an actionType : ActionType operations
        Any required data are also loaded with the in the same JSON object sent to the server
3. Server receives an action and does its operations in the server.
 */


// Setting up express.
const express = require('express');
const { response, query } = require('express');
const app = express();
app.listen(3000, () => console.log("Listening to port 3000!"));
app.use(express.static('index'));
app.use(express.json());
// Setting up nedb and load Database from /Users
var Datastore = require('nedb');
const db = new Datastore({ filename: 'Users/Users.db' });
const dbInv = new Datastore({ filename: 'Inventory/InventoryData.db'});
var activeUserSession;

function loadDummyItems(){ // Call this Function to add random 100 items to test Features.
    var newItem = {
        'item_Number' : [],
        'item_Name' : [],
        'item_Price' : [],
        'item_Quantity' : [],
        'item_Origin' : [],
        'item_Next_Shipment' : [],
        'item_Last_Shipment' : []
    }
    for(var i = 0; i < 1000; i++){
        newItem.item_Number[i] = Math.floor((Math.random()*10000) + 1000);
        newItem.item_Name[i] = "Dummy #" + i;
        newItem.item_Price[i] = "$2.97";
        newItem.item_Quantity[i] = 300;
        newItem.item_Origin[i] = "China";
        newItem.item_Next_Shipment[i] = null;
        newItem.item_Last_Shipment[i] = null;
    }

    for(var i = 0;i < 1000;i++){
        var dummyItem = {
        'item_Number' : newItem.item_Number[i],
        'item_Name' : newItem.item_Name[i],
        'item_Price' : newItem.item_Price[i],
        'item_Quantity' : newItem.item_Quantity[i],
        'item_Origin' : newItem.item_Origin[i],
        'item_Next_Shipment' : null,
        'item_Last_Shipment' : null,
        }
        dbInv.insert(dummyItem, function(err){
            console.log("New Item added, Item Name : *** " + dummyItem.item_Name + " ***");
        })
    }
}
// This request involves Login page ONLY!
app.post('/post', (req,res) => {
    res.header("Content-Type", "application/json");
    console.log(JSON.parse(req.query['data']));

    var checkActionType = JSON.parse(req.query['data']);
    
    //console.log(checkActionType);
    // This is to sign up a new user.
    if(checkActionType['actionType'] == 'addNewUser'){ // This is to add a new User
        console.log("\nNew Request Recieved, request type : addNewUser");
        const userInfo = checkActionType.userInfo;
        db.insert(userInfo, function(err){
            console.log('New User created,\nUsername : ' + userInfo.Username);
            console.log("Name : " + userInfo.FirstName);
            res.end('It worked!');
        })
        //checkActionType = {};
    } else if(checkActionType['actionType'] == 'loadUsersDatabase'){ // This is to load users database
        console.log("\nNew request recieved.");
        console.log("**** Loading Users Database ****")
        db.loadDatabase(); // This will load the users database.

    } else if(checkActionType['actionType'] == 'userLogin'){ // This is to verify userlogin
        db.find({Username : checkActionType.Username}, function (err,activeUsers){ // activeUsers = Accessing database that contains information about users.
            //console.log(activeUsers[0].Username);
            if(typeof(activeUsers[0]) == 'object'){ // This is to verify type of object to prevent server crash.
                if(activeUsers[0].Username == checkActionType.Username){ //Check if that user exist.
                    if(activeUsers[0].Password == checkActionType.Password){ //Check if the user matchs the password
                        if(activeUsers[0].Password == checkActionType.Password){ // In case True, console log a confirmation message.
                            console.log("\nNew request recieved.");
                            console.log("**** Login Attempt, : ****");
                            //console.log(activeUsers);
                            res.send({
                                'Status' : 'Success',
                                'FirstName' : activeUsers[0].FirstName,
                                activeUsers
                            })
                            console.log("**** Login was Successful ****");
                            activeUserSession = {
                                'FirstName' : activeUsers[0].FirstName,
                                'LastName' : activeUsers[0].LastName,
                                'UserName' : activeUsers[0].Username,
                                'AccessLevel' : activeUsers[0].AccessLevel,
                                'Status' : true
                            }
                            console.log(activeUserSession.UserName + " Logged in Successully");
                        }
                    }else if(activeUsers[0].Password != checkActionType.Password){ // In case False, console log an error.
                        console.log("Wrong Passowrd");
                        res.json({
                            'Status' : 'Failed'
                        })
                    }
                }
            }else{
                console.log("Wrong credientals");
                res.json({
                    'Status' : 'Failed'
                })
            }
            res.end();
        })
    } else if(checkActionType['actionType'] == 'loadInventoryData'){ // This is to load Inventory database
        dbInv.loadDatabase(); // Load Inventory Database.
        console.log("\nNew request recieved.")
        console.log("*** Loading Server *** ");
        
        db.find({}, function (err, docs) {
            if(typeof(docs) != "undefined"){
                console.log("***Database loaded successfully***");
            }else{
                console.log("Database can't be loaded.");
                process.exit(1);
            }
        });

        res.end();
    } else if(checkActionType['actionType'] == 'newUserCheck'){ // This is to check if user already exists when signing up for new user.
        console.log("\nNew request recieved.");
        console.log("\nNew signup attempt, checking for existing usernames.");
        db.find({ 'Username' : checkActionType.newUser }, function (err, docs) {
            if(docs.length == 0){
                res.json({
                    'Status' : false
                })
                console.log("No new user found, attemping to create a new user.");
            }else if(docs.length > 0){
                console.log("Existing user found, signup attempt failed.");
                res.json({
                    'Status' : true
                })
            }else{
                console.log("Something went wrong :/");
                res.json({
                    'Status' : 'undefined'
                })
            }
          });
    } else if(checkActionType['actionType'] == 'viewInventory'){ // Inventory Side JS starts here.

    } else if(checkActionType['actionType'] == 'addNewItem'){
        console.log("\nNew request recieved.");
        console.log("**** Add new Item : ****")
        const newItem = checkActionType.newItem;
        dbInv.insert(newItem, function(err){
            res.send({
                Status : true
            })
            console.log("\nNew Item added, Item Name : *** " + newItem.item_Name + " ***");
        })
    } else if(checkActionType['actionType'] == 'loadDatabaseHeader'){
        var DatabaseH;
        dbInv.find({}, function (err, docs) {
            //console.log(docs);
            res.send({
                docs
            });
        });
        //res.end();
    } else if(checkActionType['actionType'] == 'loadUserInformation'){
        if(activeUserSession == undefined){
            activeUserSession = {
                'FirstName' : null,
                'LastName' : null,
                'UserName' : null,
                'AccessLevel' : null,
                'Status' : false
            }
            console.log("YES " + activeUserSession);
        }
        
        res.send(activeUserSession);
        activeUserSession = undefined;
    } else if(checkActionType['actionType'] == 'deleteItem'){
        console.log("\nNew request recieved.");
        console.log("**** Delete Item : ****")
        const itemDeleteK = Object.keys(checkActionType);
        const itemDeleteV = Object.values(checkActionType);

        if(itemDeleteK[1] == 'item_Number'){
            dbInv.find({ item_Number: itemDeleteV[1] }, function (err, docs) {
                var deletedItem = docs[0];
                console.log(docs[0]);
                
                dbInv.remove({ item_Number: itemDeleteV[1] }, {}, function (err, numRemoved) {
                    if(numRemoved > 0){
                        res.send({
                            deletedItem,
                            Status : 'Success'
                        })
                    }else if(numRemoved == 0){
                        res.send({
                            Status : 'Failed'
                        })
                    }
                  });
              });
        }else if(itemDeleteK[1] == '_id'){
            dbInv.find({ _id : itemDeleteV[1] }, function (err, docs) {
                var deletedItem = docs[0];
                console.log(docs[0]);
                
                dbInv.remove({ _id: itemDeleteV[1] }, {}, function (err, numRemoved) {
                    if(numRemoved > 0){
                        res.send({
                            deletedItem,
                            Status : 'Success'
                        })
                    }else if(numRemoved == 0){
                        res.send({
                            Status : 'Failed'
                        })
                    }
                  });
              });
        }else if(itemDeleteK[1] == 'item_Origin'){
            dbInv.find({ item_Origin: itemDeleteV[1] }, function (err, docs) {
                var deletedItem = [];
                for(var i = 0; i < docs.length; i++){
                    deletedItem[i] = ((Object.values(docs[i])[1])); // BRO THIS LINE IS SOMEHITNG ELSE !!! :D
                }
                console.log(deletedItem);
                
                dbInv.remove({ item_Origin: itemDeleteV[1] }, {multi : true}, function (err, numRemoved) {
                    console.log(numRemoved);
                    if(numRemoved > 0){
                        res.send({
                            deletedItems : numRemoved,
                            Status : 'Success'
                        })
                    }else if(numRemoved == 0){
                        res.send({
                            Status : 'Failed'
                        })
                    }
                  });
              });
        }
    }
});
