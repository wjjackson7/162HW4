var http  = require('http');
var static = require('node-static');
 
var fileServer = new static.Server('./public');

// global variables
var fs = require('fs');  // file access module
var imgList = [];
loadImageList();

// just for testing, you can cut this out
console.log(imgList.length);

function loadImageList () {
    var data = fs.readFileSync('photoList.json');
    if (! data) {
        console.log("cannot read photoList.json");
    } else {
        listObj = JSON.parse(data);
        imgList = listObj.photoURLs;
    }
}



function handler (request, response) {

    request.addListener('end', function () {
        fileServer.serve(request, response, function (e, res) {

			var url = request.url;
		    url = url.replace("/","");

		    if(url.substring(0, 10) == "query?num=" ){ // valid query 

                // query >989 || < 0
                if(parseFloat(url.substring(10, url.length)) > 988 || parseFloat(url.substring(10, url.length)) < 0) {
                    response.writeHead(404, {"Content-Type": "text/html"});
                    response.write("<p>Bad Query</p>");
                    console.log("bad query");
                    response.end();
                }
                // valid query
                else {
                    response.writeHead(404, {"Content-Type": "text/html"});
                    response.write("<p>Query is <code>" + url.substring(10, url.length) + "</code></p>");  

                    response.write("<p>" + imgList[parseFloat(url.substring(10, url.length))] + "</p>");            
                    console.log(url.substring(10, url.length));
                    response.end();
                }
            }

            else if(e && (e.status === 404)) { // If the file wasn't found
                    response.writeHead(404, {"Content-Type": "text/html"});
				    response.write("<p>404 not found</p>");
				    response.end();
            }


        });
    }).resume();
}

var server = http.createServer(handler);

server.listen(51745);

