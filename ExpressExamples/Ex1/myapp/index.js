const express = require('express')
const app = express()
const port = 3000
var bodyParser = require('body-parser');

var fs = require('fs');
var url = require('url');


app.get('/', (req,res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // Support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true})); //support encoded bodies

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