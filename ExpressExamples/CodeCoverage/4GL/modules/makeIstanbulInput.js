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
            console.log("File was saved");
        });

        // Append input 
        fs.appendFile(filePath, myFileData, function(err){
            if(err){
                // TODO: Implement line number in trace log
                return console.log(err);
            }
        });

        console.log("File written to successfully");
    }


 }