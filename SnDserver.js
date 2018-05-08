var http  = require('http');
var static = require('node-static');
 
var fileServer = new static.Server('./public');
function handler (request, response) {

    request.addListener('end', function () {
        fileServer.serve(request, response, function (e, res) {

			var url = request.url;
		    url = url.replace("/","");

		    if(url.substring(0, 5) == "query" ){ // valid query 
            	response.writeHead(404, {"Content-Type": "text/html"});
				response.write("<p>Query is <code>" + url.substring(5, url.length-1) + "</code></p>");				response.end();
            }

            else if (e && (e.status === 404)) { // If the file wasn't found
                    response.writeHead(404, {"Content-Type": "text/html"});
				    response.write("<p>404 not found</p>");
				    response.end();
            }

        });
    }).resume();
}

var server = http.createServer(handler);

server.listen(51745);

