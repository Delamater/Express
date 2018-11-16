/**************************************************************************
 * Author:          Bob Delamater
 * Date:            11/15/2018
 * Description:     Main entry for Express application to write 
 *                  This is an input to istanbul. To consume run the following
 *                  command:
 *                    istanbul report
 * Documentation: https://github.com/gotwarlost/istanbul/blob/master/coverage.json.md
 *************************************************************************/

// Set up Express
const express = require('express');
const app = express();
const port = 3000;
var bodyParser = require('body-parser');

// Support body parsing
var url = require('url');

// Validation
const { check, validationResult } = require('express-validator/check');
var covJson = require("./modules/validation.js");

// GUID support
const uuidv4 = require('uuid/v4');

// Globals
var gNum  = 0;
var gGuid = "";

// Constants
const kInvalidSessionID = { Status: "Invalid SessionID" };
const kWriteCompleted =   { Status: "Write completed successfully"};

// Generic class to hold Line information
class LineInfo {
    constructor(sourceName, lineNumber, startCol, endCol)
    {
        this.sourceName = sourceName;
        this.lineNumber = lineNumber;
        this.startCol = startCol;
        this.endCol = endCol;
    }
}

var gLineInfo = new Array();

/**************************** Routes ************************************/
// Root level route
app.get('/', (req,res) => res.send('Code Coverage For 4GL'))
app.listen(port, () => console.log(`Listening on port ${port}!`))

// App.use
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // Support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true})); //support encoded bodies

/***************** Start Session *******************/
app.post('/StartSession',(request,response) =>{

    gGuid = null;
    gGuid = uuidv4();

    response.status(200).send({ SessionID: gGuid });
})

/***************** Terminate Session *******************/
app.post('/TerminateSession', (request, response) =>{
    // Clear session information
    gGuid = null;
    response.status(200).send({ SessionID: null});
})


// Test stateful variables
app.post('/GetNum', [
    check('num1').isNumeric()
], (request, response) =>{
    const errors = validationResult(request);
    if (!errors.isEmpty()){
        // 422: Unprocessable Entity. The request was well-formed but was unable to be followed 
        // due to semantic errors
        return response.status(422).json({ errors: errors.array() });
    }
    if (covJson.ValidateSessionID(gGuid))
    {
        // Get number
        var num1 = Number(request.body.num1);
        gNum += num1;
        response.send( {SessionID: gGuid, gNum: gNum  });
    } else{
        // 403: Forbidden (because there was no session id)
        response.status(403).send({ Status: "Invalid SessionID" });
    }

});

// Get stateful array returned
app.post('/GetArray', [
    check('sourceName').isLength({ min:1 }),
    check('lineNumber').isNumeric(),
    check('startCol').isNumeric(),
    check('endCol').isNumeric()   
], (request, response) =>{
    const errors = validationResult(request);
    if (!errors.isEmpty()){
        return response.status(422).json({ errors: errors.array() });
    }    

    var covJson = require("./modules/makeIstanbulInput.js");
    var sourceName = request.body.sourceName;
    var lineNumber = request.body.lineNumber;
    var startCol   = request.body.startCol;
    var endCol     = request.body.endCol;

    // Push this one line structure to a global allocation of lines
    gLineInfo.push(new LineInfo(sourceName, lineNumber, startCol, endCol));

    // Write to file the entire JSON structure
    //covJson.writeCoverageJson(sourceName, lineNumber, startCol, endCol);    

    // Send entire JSON structure back after all the posts
    response.json(gLineInfo);

});


// Validated Write JSON
// TODO: Rename route to something better
app.post('/ValidatedWriteJson', 
[
    check('sourceName').isLength({ min:1 }),
    check('lineNumber').isNumeric(),
    check('startCol').isNumeric(),
    check('endCol').isNumeric(),
    check('SessionID').isLength({ min:1 })
], 
(request, response) => {
    // Find validation errors in this request
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.array() });
    }

    var covJson = require("./modules/makeIstanbulInput.js");
    var sourceName      = request.body.sourceName;
    var lineNumber      = request.body.lineNumber;
    var startCol        = request.body.startCol;
    var endCol          = request.body.endCol;
    var mySessionID     = request.body.SessionID;
    
    if ( gGuid == mySessionID ){
        covJson.writeCoverageJson(sourceName, lineNumber, startCol, endCol);
        response.status(200).send(JSON.stringify(kWriteCompleted));
    } else{
        response.status(403).send(kInvalidSessionID);
    }



    
});


// Coverage.json route 
// TODO: Remove, this has no validation
app.post('/WriteCoverageJson',  function(request,respond){
    var covJson = require("./modules/makeIstanbulInput.js");
    var sourceName = request.body.sourceName;
    var lineNumber = request.body.lineNumber;
    var startCol   = request.body.startCol;
    var endCol     = request.body.endCol;

    covJson.writeCoverageJson(sourceName, lineNumber, startCol, endCol);

    respond.status(200).send({ Status: "Coverage.json built"});
    // respond.send("Written successfully");
});

// Test route
// TODO: Remove, we don't need this
app.post('/receive', function(request, respond) {

    // Extract runtime information
    var sourceName = request.body.sourceName;
    var lineNumber = request.body.lineNumber;
    var startCol   = request.body.startCol;
    var endCol     = request.body.endCol;

    console.log("Source Name: "+ sourceName);
    console.log("__dirname: " + __dirname);
    var body = '';
    filePath = __dirname + '/public/data.txt';
    request.on('data', function(data) {
        body += data;
    });

    respond.send("Source: "     + sourceName);
    // respond.send("line: "       + lineNumber);

});



// module.exports = {
//     GetNumber: function GetNumber(num)
//     {
//         num += num;
//     }
// }