var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);
var io = require('socket.io').listen(server);
var request = require("request");
var sentiment = require('sentiment');
var googleTranslate = require('google-translate')("AIzaSyCowCpKjO9GzU3xL55Ict4KnUy9PjqyQvE");

var usernameToSocket = {};

var countryCodes = ["en-us", "de-de", "en-au", "en-ca", "es-es", "en-gb", "en-ie", "en-in", "es-mx", "en-nz", "fr-ca", "fr-fr", "it-it", "ja-jp", "nl-nl", "pt-br", "zh-cn"];

io.on('connection', function(socket) {
    console.log("connection");
    
    socket.currentIteration = 0;
    var articleObjects = {};
    
    function translate(str) {
        //var url = "https://www.googleapis.com/language/translate/v2?key=" + api_key + "&q=hello%20world&source=en";
        return str;
    }
    
    function next(code, data, first) {
        if (data.value === undefined) {
            console.log("Error on line 29 of server.js");
            return;
        }
        
        if (first) {
            articleObjects[code] = [];
        }
        var articleObject = data.value[socket.currentIteration];
        var newObject = {};
        
        if (articleObject !== undefined) {
        
        
            newObject["title"] = articleObject["name"];
            newObject["url"] = articleObject["url"];
            newObject["category"] = articleObject["category"];
        
        }
        var articleOptions = {
          url: newObject["url"]
        };
        
            request(articleOptions, function(error, response, articleHTML) {
                newObject["sentiment"] = sentiment(translate(articleHTML));
                articleObjects[code][socket.currentIteration] = newObject;
                
                socket.currentIteration++;
                if (socket.currentIteration == data.value.length) {
                    var dataObject = {
                        "articleObjects": articleObjects[code],
                        "region": code
                    };
                    socket.emit("info data", dataObject);
                    articleObjects[code] = [];
                    return;
                } else {
                    next(code, data, first);
                }
            });
    }
    
    function getArticles(countryCode, callback) {
        var url = "https://api.cognitive.microsoft.com/bing/v5.0/news/?market=" + countryCode + "&q=";
        
        var options = {
          url: url,
          headers: {
            'Ocp-Apim-Subscription-Key': 'c9fd1ddb6fd24e2ead14c004aac22a3e'
          }
        };
        
        request(options, function(error, response, data) {
            
            data = JSON.parse(data);
            
            next(countryCode, data, true);
        });
        
    }
    
    getArticles(countryCodes[1], function(data) {
        console.log(data);
    });
    
    getArticles(countryCodes[0], function(data) {
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
    console.log("Listening on 3000...");
    googleTranslate.translate('Mi perro come toda la comida', 'en', function(err, translation) {
      console.log(translation);
    });
});