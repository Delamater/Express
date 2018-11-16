/**************************************************************************
 * Author:          Bob Delamater
 * Date:            11/15/2018
 * Description:     Write coverage.json file
 *                  This is an input to istanbul. To consume run the following
 *                  command:
 *                    istanbul report
 * Documentation: https://github.com/gotwarlost/istanbul/blob/master/coverage.json.md
 *************************************************************************/

 module.exports = {
    writeCoverageJson:
    function writeCoverageJson(sourceFileName, lineNumber, colStart, colEnd)
    {
        var fs = require('fs');
        var filePath = __dirname + "/../public/output/coverage.json";
        var crlf = "\r\n";
        var myFileData = "";

        
        myFileData = "sourceFileName: " + sourceFileName + crlf;
        myFileData += "Line Number: " + lineNumber + crlf;
        myFileData += "Column Start: " + colStart + crlf;
        myFileData += "Column End: " + colEnd + crlf;
        

        // Overwrite file if it exists
        fs.writeFile(filePath, "", function(err) {
            if(err){
                // TODO: Implement line number in trace log
                return console.log(err);
            }
            console.log("File created");
        });

        // Append input 
        fs.appendFile(filePath, myFileData, function(err){
            if(err){
                // TODO: Implement line number in trace log
                return console.log(err);
            }
        });

        // var st = "";
        // st = makeStatement();
        fs.appendFile(filePath, makeStatement(), function(err){
            if(err){
                // TODO: Implement line number in trace log
                return console.log(err);
            }
        })

        console.log("File appended to successfully");
    },

    writeCoverageJson2:
    function writeCoverageJson2(lineInfo){
        console.log(JSON.stringify(lineInfo));

        var fs = require('fs');
        var filePath = __dirname + "/../public/output/coverage.json";
        fs.writeFile(filePath,JSON.stringify(lineInfo, null, 2), function(err){
            if(err){
                // TODO: Implement line number in trace log
                return console.log(err);
            }            
        })

    }
 }

 

 function makeHeader(fileName, path)
{
    var result = {fileName:{"path":path}};
    return JSON.stringify(result);
    
}
function makeBranchMap()
{

}

function makeBranch()
{

}

function makeStatementMap()
{

}

function makeStatement()
{
    var sm = "s:{";
    var i;
    for (i = 0; i<10;i++) {
        sm += '"' + i + '":1,';
        sm += '"' + i+1 + '":1';
    }
    sm += "},"

    return sm;

}

function makeFunctionMap()
{

}

function makeFunction()
{
    
}
