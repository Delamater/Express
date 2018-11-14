/**************************************************************************
 * Author:          Bob Delamater
 * Date:            10/22/2018
 * Description:     Write coverage.json file
 *                  This is an input to istanbul. To consume run the following
 *                  command:
 *                    istanbul report
 * Documentation: https://github.com/gotwarlost/istanbul/blob/master/coverage.json.md
 *************************************************************************/

var i;
var rootFolder;
var subfolders = ['Supervisor', 'Financials', 'AP-AR accounting', 'External', 'Sales',
                    'Purchasing', 'Stock', 'Manufacturing', 'Common Data', 'Development',
                    'Sage X3 Internals', 'Help-Desk', 'CRM activities', 'Fixed Assets',
                    'Human Resources administration', 'Module Spe 1', 'Module Spe 2', 
                    'Module Spe 3', 'Module Spe 4', 'Human Capital management']
rootFolder = "C:\\WorkingFolder\\X3\\Istanbul\\Examples\\4GL\\"
for (var j = 0; j < subfolders.length; j++)
{
    for (i=0; i<10; i++)
    {
        // Write coverage file for each source file
        var name;
        name = "ZISTANBUL" + i + ".src";
        var x = makeJsonObject( rootFolder + "TRT\\" + subfolders[j] + "\\"+ name, 
                                rootFolder + "TRT\\" + subfolders[j] + "\\"+ name);
    
        // console.log(x);
        var fs = require('fs');

        if (fs.existsSync(rootFolder + "TRT\\" + subfolders[j]) == false)
        {
            fs.mkdirSync(rootFolder + "TRT\\" + subfolders[j])
        }

        // Write corresponding 4GL source file
        fs.copyFile(rootFolder + "ZISTANBUL.src", "./TRT/" + subfolders[j] + "/ZISTANBUL" + i + ".src", function(err) {
            if(err) {
                return console.log(err);
            }
        });        

        if (fs.existsSync(rootFolder + "coverage\\TRT\\" + subfolders[j]) == false)
        {
            fs.mkdirSync(rootFolder + "coverage\\TRT\\" + subfolders[j])
        }


        fs.writeFile("./coverage/TRT/" + subfolders[j] + "/coverageZistanbul" + i + ".json", x, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("File was saved");
        });          
    }    
}

function ensureDirectoryExists(filePath){
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname))
    {
        return true;
    }
    ensureDirectoryExists(dirname);
    fs.mkdirSync(dirname);
}



function makeJsonObject(testName, fileName)
{
    // var o = {"C:\\WorkingFolder\\X3\\Istanbul\\Examples\\Polish\\ZISTANBUL.src":
    var o = {[fileName]:
        {
            path:fileName,
            s:{"1":1, "2": 1, "3": 0, "4":1, "5":1},
            b:{"1":[0,1]},
            f:{
                
            },

            fnMap:{

            },
            statementMap:{
                "1":{
                    start:{
                        line:2,
                        column:0
                    },
                    end:{
                        line:2,
                        column:6
                    }
                },
                "2":{
                    start:{
                        line:3,
                        column:0
                    },
                    end:{
                        line:3,
                        column:7
                    }
                },
                "3":{
                    start:{
                        line:3,
                        column:7
                    },
                    end:{
                        line:3,
                        column:25
                    }
                },
                "4":{
                    start:{
                        line:3,
                        column:26
                    },
                    end:{
                        line:3,
                        column:55
                    }
                },
                "5":{
                    start:{
                        line:3,
                        column:56
                    },
                    end:{
                        line:3,
                        column:61
                    }
                }
            },

            branchMap:{
                "1":{
                    line:3,
                    type:"if",
                    locations:[
                        {
                            start:{line:3,column:0},
                            end:{line:3,column:0}
                    },
                        {
                            start:{line:3,column:0},
                            end:{line:3,column:0}
                    }            
                    ]
                }
            }                 
        }
    };
    

    
    // o.b = [];
    // o.b.push({
    //     "1":[1,0]
    // })

    return JSON.stringify(o,null,4);
}


function WriteJson(fileName, isMinimized, myObj)
{
    var fs = require("fs");
    switch (isMinimized)
    {
        case true:
            fs.writeFile("./coverage/" + fileName + ".json", JSON.stringify(myObj,null,4),(err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("File has been created");
            });

        case false:
            fs.writeFile("./" + fileName + ".json", JSON.stringify(myObj),(err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("File has been created");
            });
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

}

function makeFunctionMap()
{

}

function makeFunction()
{
    
}


var sampleObject = {
    a: 1,
    b: 2,
    c: {
        x: 11,
        y: 22
    }
};


var coverageJson = {  
    "C:\\WorkingFolder\\X3\\Istanbul\\Examples\\Polish\\test.js":{  
       "path":"C:\\WorkingFolder\\X3\\Istanbul\\Examples\\Polish\\test.js",
       "s":{  
          "1":1,
          "2":1,
          "3":1,
          "4":1,
          "5":1,
          "6":1,
          "7":1,
          "8":3,
          "9":1,
          "10":1,
          "11":0,
          "12":1,
          "13":0
       },
       "b":{  
          "1":[  
             1,
             1,
             0,
             1
          ]
       },
       "f":{  
          "1":1,
          "2":3
       },
       "fnMap":{  
          "1":{  
             "name":"getNumber",
             "line":7,
             "loc":{  
                "start":{  
                   "line":7,
                   "column":0
                },
                "end":{  
                   "line":8,
                   "column":0
                }
             }
          },
          "2":{  
             "name":"myFunc1",
             "line":11,
             "loc":{  
                "start":{  
                   "line":11,
                   "column":0
                },
                "end":{  
                   "line":12,
                   "column":0
                }
             }
          }
       },
       "statementMap":{  
          "1":{  
             "start":{  
                "line":1,
                "column":0
             },
             "end":{  
                "line":1,
                "column":23
             }
          },
          "2":{  
             "start":{  
                "line":2,
                "column":0
             },
             "end":{  
                "line":2,
                "column":19
             }
          },
          "3":{  
             "start":{  
                "line":3,
                "column":0
             },
             "end":{  
                "line":3,
                "column":19
             }
          },
          "4":{  
             "start":{  
                "line":4,
                "column":0
             },
             "end":{  
                "line":4,
                "column":20
             }
          },
          "5":{  
             "start":{  
                "line":7,
                "column":0
             },
             "end":{  
                "line":10,
                "column":1
             }
          },
          "6":{  
             "start":{  
                "line":9,
                "column":4
             },
             "end":{  
                "line":9,
                "column":27
             }
          },
          "7":{  
             "start":{  
                "line":11,
                "column":0
             },
             "end":{  
                "line":25,
                "column":1
             }
          },
          "8":{  
             "start":{  
                "line":13,
                "column":4
             },
             "end":{  
                "line":23,
                "column":5
             }
          },
          "9":{  
             "start":{  
                "line":16,
                "column":12
             },
             "end":{  
                "line":16,
                "column":21
             }
          },
          "10":{  
             "start":{  
                "line":18,
                "column":12
             },
             "end":{  
                "line":18,
                "column":21
             }
          },
          "11":{  
             "start":{  
                "line":20,
                "column":12
             },
             "end":{  
                "line":20,
                "column":21
             }
          },
          "12":{  
             "start":{  
                "line":22,
                "column":12
             },
             "end":{  
                "line":22,
                "column":21
             }
          },
          "13":{  
             "start":{  
                "line":24,
                "column":4
             },
             "end":{  
                "line":24,
                "column":13
             }
          }
       },
       "branchMap":{  
          "1":{  
             "line":13,
             "type":"switch",
             "locations":[  
                {  
                   "start":{  
                      "line":15,
                      "column":8
                   },
                   "end":{  
                      "line":16,
                      "column":21
                   }
                },
                {  
                   "start":{  
                      "line":17,
                      "column":8
                   },
                   "end":{  
                      "line":18,
                      "column":21
                   }
                },
                {  
                   "start":{  
                      "line":19,
                      "column":8
                   },
                   "end":{  
                      "line":20,
                      "column":21
                   }
                },
                {  
                   "start":{  
                      "line":21,
                      "column":8
                   },
                   "end":{  
                      "line":22,
                      "column":21
                   }
                }
             ]
          }
       }
    }
 }