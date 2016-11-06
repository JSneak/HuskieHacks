var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);
var io = require('socket.io').listen(server);
var request = require("request");
var sentiment = require('sentiment');

var usernameToSocket = {};

var countryCodes = ["en-us", "de-de", "en-au", "en-ca", "es-es", "en-gb", "en-ie", "en-in", "es-mx", "en-nz", "fr-ca", "fr-fr", "it-it", "ja-jp", "nl-nl", "pt-br", "zh-cn"];

var cache = {};

io.on('connection', function(socket) {
    console.log("connection");
    
    socket.currentIteration = 0;
    var articleObjects = [];
    
    function next(code, data) {
        var articleObject = data.value[socket.currentIteration];
        
        var newObject = {};
        
        newObject["title"] = articleObject["name"];
        newObject["url"] = articleObject["url"];
        newObject["category"] = articleObject["category"];
        
        var articleOptions = {
          url: newObject["url"]
        };
        
        if (!cache.hasOwnProperty(newObject["url"]) && false) {
            request(articleOptions, function(error, response, articleHTML) {
                newObject["sentiment"] = sentiment(articleHTML);
                articleObjects[socket.currentIteration] = newObject;
                
                socket.currentIteration++;
                if (socket.currentIteration == data.value.length) {
                    var dataObject = {
                        "articleObjects": articleObjects,
                        "region": code
                    };
                    socket.emit("info data", dataObject)
                } else {
                    next(code, data);
                }
            });
        } else {
            var articleHTML = cache[newObject["url"]];
            newObject["sentiment"] = sentiment(articleHTML);
            articleObjects[socket.currentIteration] = newObject;
            
            socket.currentIteration++;
            if (socket.currentIteration == data.value.length) {
                var dataObject = {
                    "articleObjects": articleObjects,
                    "region": code
                };
                socket.emit("info data", dataObject)
            } else {
                next(code, data);
            }
        }
    }
    
    function getArticles(countryCode, callback) {
        var url = "https://api.cognitive.microsoft.com/bing/v5.0/news/?market=" + countryCode + "&q=";
        
        var options = {
          url: url,
          headers: {
            'Ocp-Apim-Subscription-Key': 'c9fd1ddb6fd24e2ead14c004aac22a3e'
          }
        };
        
        if (!cache.hasOwnProperty(url) && false) {
            request(options, function(error, response, data) {
                console.log(data);
                
                cache[url] = data;
                
                data = JSON.parse(data);
                
                next(countryCode, data);
            });
        } else {
            console.log("opened cache");
            var data = JSON.parse(cache[url]);
                
            next(countryCode, data);
        }
        
    }
    
    getArticles(countryCodes[0], function(data) {
        console.log(data);
    });
    
    io.on("sentiment", function(data) {
        console.log(data);
    });
});

function send404Response(response) {
    response.writeHead(404, {
        "Content-Type": "text/plain"
    });
    response.write("Error 404: Page not found!");
    response.end();
};


app.use(express.static(__dirname + '/public'));

server.listen(process.env.PORT, function() {
    console.log('Server listening at port 3000');
});