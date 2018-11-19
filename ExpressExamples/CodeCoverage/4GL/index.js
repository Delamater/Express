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

// Generic class to hold Line information
const clsLineInfo = require('./Classes/LineInfo.js')

// GUID support
const uuidv4 = require('uuid/v4');

// Globals
var gNum  = 0;
var gGuid = "";
var gLineInfo = new Array();

// Constants
const kInvalidSessionID =   { Status: "Invalid SessionID" };
const kWriteCompleted =     { Status: "Write completed successfully" };
const kNoLinesToWrite =     { Status: "No lines to write" };


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
app.post('/TerminateSession',[check('SessionID').isLength({ min:1 })],  (request, response) =>{
    // Obtain session ID
    var mySessionID     = request.body.SessionID;

    if ( gGuid == mySessionID ){
        if ( gLineInfo != null ) {
            // Write intermediate file required to build Coverage.json
            var covJson = require("./modules/makeIstanbulInput.js");        
            covJson.writeCoverageJson2( gLineInfo );
            // Clear session information
            gGuid = null;
            gLineInfo = null;
            gLineInfo = new Array();
            response.status(200).send({ kWriteCompleted });
        }
        else {
            // Clear GUID and Line arrays. Tests will need to be re-run as we 
            // are not storing the details. 
            gGuid = null;
            gLineInfo = null;
            response.status(403).send( kNoLinesToWrite );
        }        
    } else{
        response.status(403).send( kInvalidSessionID );
    }
});


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
        response.status(403).send({ kInvalidSessionID });
    }

});

// Get stateful array returned
app.post('/SubmitLine', [
    check('sourceName').isLength({ min:1 }),
    check('lineNumber').isNumeric(),
    check('startCol').isNumeric(),
    check('endCol').isNumeric(),
    check('SessionID').isLength({ min:1 }) 
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
    var mySessionID     = request.body.SessionID;

    if ( gGuid == mySessionID ){

        // Push this one line structure to a global allocation of lines
        gLineInfo.push(new clsLineInfo.LineInfo(sourceName, lineNumber, startCol, endCol));          
        response.status(200).send(JSON.stringify(gLineInfo, null, 2));
    } else{
        response.status(403).send(kInvalidSessionID);
    }
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
        // covJson.writeCoverageJson(sourceName, lineNumber, startCol, endCol);
        covJson.writeCoverageJson2(gLineInfo);
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