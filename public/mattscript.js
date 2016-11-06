var url = window.location.href;
var arr = url.split("/");
var result = arr[0] + "//" + arr[2];
var socket = io.connect("https://newsmood.herokuapp.com");

var codeToArticles = [];

var regionNameToLetters = {"en-us": "US"};
var titles = [];
var sentiment = [];
var country = [];
var table = document.getElementById('tableBoss');

socket.on("info data", function(data){
    region = data["region"];
    objects = data["articleObjects"];
    average = regionAverage(objects);
    showCountry(regionNameToLetters[region], average);

    for(i=0;i<data.length;i++)
    {
    	titles.push(data[i].title);
    	sentiment.push(data[i].sentiment.score);
    	country.push(data[i].category);
    } 
});

function regionAverage(objects) {
    var sum = 0;
    for (var i = 0; i < objects.length; i++) {
        sum += objects[i].sentiment.score;
    }
    return sum / objects.length;
}

function init() {
}

window.addEventListener('load', init );