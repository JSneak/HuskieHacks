var url = window.location.href;
var arr = url.split("/");
var result = arr[0] + "//" + arr[2];
var socket = io.connect("https://huskie-hack-bhargav-y.c9users.io");

var codeToArticles = [];

function getArticles(countryCode, callback) {
}

socket.on("info data", function(data){
    console.log(data["region"]);
    console.log(data["articleObjects"]);
});

function sentiment(url) {
    $.ajax({url: url, success: function(data){
        socket.emit("sentiment", data);
    }});
}

function loaded() {
    // called once all articles are loaded
    console.log(codeToArticles);
    sentiment(codeToArticles["en-us"][0].url);
}

var nextCountryCodeIndice = 0;
function next() {
    country = countryCodes[nextCountryCodeIndice];
    getArticles(country, function(data) {
        codeToArticles[country] = data;
        nextCountryCodeIndice++;
        if (nextCountryCodeIndice !== countryCodes.length) {
            setTimeout(function() {next()}, 500);
        } else {
            loaded();
        }
    });
}

function init() {
    //next();
}

window.addEventListener('load', init );