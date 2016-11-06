var url = window.location.href;
var arr = url.split("/");
var result = arr[0] + "//" + arr[2];
var socket = io.connect("https://newsmood.herokuapp.com");

var codeToArticles = [];

socket.on("info data", function(data){
    console.log(data["region"]);
    console.log(data["articleObjects"]);
});

function init() {
}

window.addEventListener('load', init );