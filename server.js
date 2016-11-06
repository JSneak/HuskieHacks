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
    socket.articleObjects = {};
    socket.done = true;
    socket.nextCountryCode = -1;
    socket.shouldStart = false;
    
    socket.on("start", function(data) {
        socket.shouldStart = true;
    });
    
    function translate(str) {
        //var url = "https://www.googleapis.com/language/translate/v2?key=" + api_key + "&q=hello%20world&source=en";
        return str;
    }
    
    function next() {
        if (socket.data.value === undefined) {
            console.log("Error on line 32 of server.js");
            return;
        }
        
        if (socket.first) {
            socket.articleObjects[socket.code] = [];
            socket.first = false;
        }
        var articleObject = socket.data.value[socket.currentIteration];
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
            newObject["sentiment"] = sentiment(articleHTML);
            socket.articleObjects[socket.code][socket.currentIteration] = newObject;
            
            socket.currentIteration++;
            if (socket.currentIteration == socket.data.value.length) {
                var dataObject = {
                    "articleObjects": socket.articleObjects[socket.code],
                    "region": socket.code
                };
                socket.emit("info data", dataObject);
                socket.articleObjects[socket.code] = [];
                console.log("sent");
                socket.done = true;
                socket.currentIteration = 0;
                return;
            } else {
                setTimeout(function() {next();}, 10);
                console.log(socket.currentIteration);
            }
        });
    }
    
    function getArticles(countryCode, callback) {
        var url = "https://api.cognitive.microsoft.com/bing/v5.0/news/?count=10&market=" + countryCode + "&q=";
        
        var options = {
          url: url,
          headers: {
            'Ocp-Apim-Subscription-Key': 'eafc9fb746b14f14800a969b09915c82'
          }
        };
        
        
        request(options, function(error, response, data) {
            
            data = JSON.parse(data);
            socket.code = countryCode;
            socket.data = data;
            socket.first = true;
            next();
        });
        
        
    }
    
    socket.interval = setInterval(function() {
        if (socket.done && socket.shouldStart) {
            console.log("hello");
            socket.nextCountryCode++;
            if (socket.nextCountryCode >= countryCodes.length) {
                socket.done = false;
                return;
            }
            socket.done = false;
            getArticles(countryCodes[socket.nextCountryCode], function(data) {
                console.log(data);
            });
        }
    }, 2000);
    
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