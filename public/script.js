var url = window.location.href;
var arr = url.split("/");
var result = arr[0] + "//" + arr[2];
var socket = io.connect("https://newsmood.herokuapp.com");
socket.emit("start", {});
var coolCountryCode = "hi";
var codeToArticles = [];
var regionNameToLetters = {"de-de": "DE", "en-au": "AU", "en-ca": "CA", "es-es": "ES", "en-gb": "GB", "en-ie": "IE", "en-in": "IN", "es-mx": "MX", "en-nz": "NZ", "en-us": "US", "fr-ca": "FR", "fr-fr": "FR", "it-it": "IT", "ja-jp": "JP", "nl-nl": "NL", "pt-br": "BR", "zh-cn": "CN"};
var countryObject = function() {
  this.titles = [];
  this.sentiment = [];
  this.urls = [];
}
var countries = {};
var table = document.getElementById('tableBoss');
var selectedCountry = "";
var articleNumber = 0;
var rowNumber = 0;
var roww;
var WORLD_SENTIMENT = 250;
var countries_loaded = 0;
var colors = {
  "US": 0,
  "RU": 0,
  "GB": 0,
  "FR": 0,
  "AU": 0,
  "BR": 0,
  "IN": 0,
  "CH": 0,
  "JP": 0,
  "CA": 0,
  "KR": 0,
  "AR": 0,
  "ZA": 0,
  "MX": 0,
  "ES": 0,
  "DE": 0,
  "EG": 0,
  "GR": 0,
  "IT": 0,
};
var countryArray = ['US','RU','GB','FR','AU','BR','IN','CH','JP','CA','KR','AR','ZA','MX','ES','DE','EG','GR','IT'];
    
function tableArticles()
{
    
    var countryObj = countries[coolCountryCode];
    $("table").html("<thead><tr><th>Title</th><th>Sentiment</th></tr></thead>"); //reset table
    for (var w = 0; w <= countryObj.titles.length-1; w++)
    {
        $("table").append($("<tr><td><a style='color:white;text-decoration:underline;font-size:16px;' target='_blank' href='" + countryObj.urls[w] + "'>" + countryObj.titles[w] + "</a></td><td>" + countryObj.sentiment[w] + "</td></tr>"));
    }
    
    
    
}
    
refreshMap();

function updateWorldHappiness() {
  var sum = 0;
  for (var countryName in countries) {
    sum += countries[countryName].overall_sentiment;
  }
  var average = (sum) / countries_loaded; // subtract 500 for the country that stays at 500
  $(".overall").text("Overall World Happiness(-250 to 250): " + Math.ceil(average));
}

socket.on("info data", function(data){
    region = regionNameToLetters[data["region"]];
    objects = data["articleObjects"];
    average = regionAverage(objects);
    showCountry(region, average);
    countries_loaded++;
    
    var newObject = new countryObject();
    newObject.overall_sentiment = average;
    console.log("received region: " + region);
    
    for(var i=0;i<objects.length;i++)
    {
    	newObject.titles.push(objects[i].title);
    	newObject.sentiment.push(objects[i].sentiment.score);
    	newObject.urls.push(objects[i].url);
    }
    countries[region] = newObject;
    
    updateWorldHappiness();
});

function regionAverage(objects) {
    var sum = 0;
    for (var i = 0; i < objects.length; i++) {
        if (objects[i] !== undefined) {
          sum += objects[i].sentiment.score;
        }
    }
    return sum / objects.length;
}

function init() {
}

window.addEventListener('load', init );

function showNews()
{
        document.getElementById('regions_div').style.display = "none"
        document.getElementById('welcomeDiv').style.display = "block"
}

function hideNews()
{
    document.getElementById('regions_div').style.display = "block"
    document.getElementById('welcomeDiv').style.display = "none";
}

function refreshMap() {
  google.charts.load('current', {
  callback: function () {
    var data = google.visualization.arrayToDataTable([
      ['Country', 'Happiness'],
      ['US', colors["US"],],
      ['RU', colors["RU"],],
      ['GB', colors["GB"],],
      ['FR', colors["FR"],],
      ['AU', colors["AU"],],
      ['BR', colors["BR"],],
      ['IN', colors["IN"],],
      ['CH', colors["CH"],],
      ['JP', colors["JP"],],
      ['CA', colors["CA"],],
      ['KR', colors["KR"],],
      ['AR', colors["AR"],],
      ['ZA', colors["ZA"],],
      ['MX', colors["MX"],],
      ['ES', colors["ES"],],
      ['DE', colors["DE"],],
      ['EG', colors["EG"],],
      ['GR', colors["GR"]],
      ['IT', colors["IT"],],
      ['KSM', 40,],
      ['KSJ', -40,]
    ]);

    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1]);
  
    var options = 
    {
      colorAxis: {colors: ['red', 'orange', 'yellow', 'green', '#3872d1']},
      legend:  {textStyle: {color: 'white', fontSize: 20, italic: true}},
      backgroundColor: '#000000'
    }

    var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

    google.visualization.events.addListener(chart, 'select', function () {
      showNews();
      var selection = chart.getSelection();
      coolCountryCode = countryArray[selection[0].row];
      tableArticles();
      if (selection.length > 0) {
        //window.open('http://' + data.getValue(selection[0].row, 2), '_blank');
      }
    });

    chart.draw(view, options);
  },
  packages:['geochart']
});
}

/*
Country Name is the name of the country
countryAverage is the average sum between -500, 500 of the country
*/ 
function showCountry(countryName, countryAverage) 
{
  console.log(countryName + ": " + countryAverage);
  colors[countryName] = countryAverage;
  
  refreshMap();
  
}
// '.tbl-content' consumed little space for vertical scrollbar, scrollbar width depend on browser/os/platfrom. Here calculate the scollbar width .
$(window).on("load resize ", function() {
  var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
  $('.tbl-header').css({'padding-right':scrollWidth});
}).resize();

setInterval(refreshMap, 10000);

