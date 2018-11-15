/**************************************************************************
 * Author:          Bob Delamater
 * Date:            11/15/2018
 * Description:     Main entry for Express application to write 
 *                  This is an input to istanbul. To consume run the following
 *                  command:
 *                    istanbul report
 * Documentation: https://github.com/gotwarlost/istanbul/blob/master/coverage.json.md
 *************************************************************************/


const express = require('express');
const app = express();
const port = 3000;
var bodyParser = require('body-parser');
var fs = require('fs');
var url = require('url');

// Validation
const { check, validationResult } = require('express-validator/check');


app.get('/', (req,res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Listening on port ${port}!`))


app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // Support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true})); //support encoded bodies

app.post('/ValidatedWriteJson', 
[
    check('sourceName').isLength({ min:1 }),
    check('lineNumber').isNumeric(),
    check('startCol').isNumeric(),
    check('endCol').isNumeric()    
], 
(request, response) => {
    // Find validation errors in this request
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.array() });
    }

    var covJson = require("./modules/makeIstanbulInput.js");
    var sourceName = request.body.sourceName;
    var lineNumber = request.body.lineNumber;
    var startCol   = request.body.startCol;
    var endCol     = request.body.endCol;

    covJson.writeCoverageJson(sourceName, lineNumber, startCol, endCol);

    response.send("Written successfully");

    
});

app.post('/WriteCoverageJson',  function(request,respond){
    var covJson = require("./modules/makeIstanbulInput.js");
    var sourceName = request.body.sourceName;
    var lineNumber = request.body.lineNumber;
    var startCol   = request.body.startCol;
    var endCol     = request.body.endCol;

    covJson.writeCoverageJson(sourceName, lineNumber, startCol, endCol);

    respond.send("Written successfully");
});

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

    // respond.send("Source: "     + sourceName);
    respond.send("line: "       + lineNumber);
    // respond.send("startCol: "   + startCol);
    // respond.send("endCol: "     + endCol);
    // request.on('end', function(){
    //     fs.appendFile(filePath, body, function(){
    //         respond.send("File appended successfully");
    //         respond.end();
    //     });
    // });
});