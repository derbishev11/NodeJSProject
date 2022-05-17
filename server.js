//Load modules
let express = require('express');
let bodyParser = require('body-parser');
let chalk = require('chalk');
let fs = require('fs');
let path = require('path');

//calling express constructor to create express application object
let app = express();
app.use(bodyParser.urlencoded({extended: false}));

//create a handler for the HTTP GET request
app.get('/', (request,response) => response.sendFile(__dirname + "/index.html"));

//creating a handler for the HTTP POST request
app.post('/api/data',(request,response) => {
    let postBody = request.body;
    //creating file path to work with the customer ID
    let filePath = path.join(__dirname, 'api', 'data', `${postBody.custID}.txt`);

    if(postBody.operation1 === "newCust") {
        response.send(postBody);
    }//newCust ends here
    else if(postBody.operation2 === "addCust") {
        addCust(postBody,response) // calling a function to add the customer
    }//addCust ends here
    else if(postBody.operation3 === "findCust") {
        //fs.access to check if the customer exists
        fs.access(filePath, (err) => {
            if(err) {
                console.log("Not Found");
                postBody.firstN = "Not Found";
                postBody.lastN = " ";
                postBody.address = " ";
                postBody.city = " ";
                postBody.province = " ";
                postBody.postal = " ";
                response.send(postBody);
            }
            else {
                //reading a file to find customer
                fs.readFile(filePath, 'utf-8', (err, content) =>{
                    if(err) {
                        console.log(err)
                    }
                    //converting JSON to Object
                    let obj = JSON.parse(content)
                    postBody.firstN = obj.firstN;
                    postBody.lastN = obj.lastN;
                    postBody.address = obj.address;
                    postBody.city = obj.city;
                    postBody.province = obj.province;
                    postBody.postal = obj.postal;
                    response.send(postBody);
                    console.log(obj);
                })
            }

        })
    }//findCust ends here
    else if(postBody.operation4 === "updateCust") {
        //converting object to json
        let json = JSON.stringify(postBody);
        fs.access(filePath, (err) => {
            if(err) {
                postBody.firstN = ("Sorry but customer with this ID doesn't exists");
                postBody.lastN = " ";
                postBody.address = " ";
                postBody.city = " ";
                postBody.province = " ";
                postBody.postal = " "
                console.log(chalk.blue("Sorry but customer with this ID doesn't exists"))
                response.send(postBody);
            }
            else {
                fs.writeFile(filePath, json, err => {
                    if(err) {
                        console.log(err)
                    }
                    console.log("File has been update")
                })
            }
        })

    }//updateCust ends here
    else if(postBody.operation5 === "deleteCust") {
        if(postBody.conf === "true") {
            deleteCust(filePath) // calling a function delete the customer
            console.log("File was deleted")
        }
        else {
            console.log("File wasn't deleted")
        }

    }//deleteCust ends here
});
//Listening server, port:3000
let server = app.listen(3000, function() {
    console.log('Server is running...')
});


//function to add Customer
function addCust(data,resp) {
    //converting object to json
    let json = JSON.stringify(data);
    //creating file path to work with it
    let filePath = path.join(__dirname, 'api', 'data', `${data.custID}.txt`);
    //access to check if the file exists
    fs.access(filePath, (err) => {
        if(err) {

            //creating a txt file
            fs.writeFile(filePath, json, err=>{
                if(err) {
                    console.log(err);
                }
                console.log("File has been created");
            })
        }
        else {
            data.firstN = "Customer with this ID already exists";
            data.lastN = " ";
            data.address = " ";
            data.city = " ";
            data.province = " ";
            data.postal = " ";
            resp.send(data);
        }
    })

}

//Function to delete customer
function deleteCust(data) {
    //Unlink to delete selected id
    fs.unlink(data,function (err) {
        if(err) console.log(err);
        console.log('File Deleted')
    })
}

