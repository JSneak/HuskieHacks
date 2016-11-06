var url = window.location.href;
var arr = url.split("/");
var result = arr[0] + "//" + arr[2];
var socket = io.connect("https://huskie-hack-bhargav-y.c9users.io/");
socket.emit("start", {});
var coolCountryCode = "hi";
var codeToArticles = [];
var regionNameToLetters = {"de-de": "DE", "en-au": "AU", "en-ca": "CA", "es-es": "ES", "en-gb": "GB", "en-ie": "IE", "en-in": "IN", "es-mx": "MX", "en-nz": "NZ", "en-us": "US", "fr-ca": "FR", "fr-fr": "FR", "it-it": "IT", "ja-jp": "JP", "nl-nl": "NL", "pt-br": "BR", "zh-cn": "CN"};
var countryObject = function() {
  this.titles = [];
  this.sentiment = [];
}
var countries = {};
var table = document.getElementById('tableBoss');
var selectedCountry = "";
var articleNumber = 0;
var rowNumber = 0;
var roww;
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
  "IT": 500,
};
var countryArray = ['US','RU','GB','FR','AU','BR','IN','CH','JP','CA','KR','AR','ZA','MX','ES','DE','EG','GR','IT'];
    
function tableArticles()
{
    
    var countryObj = countries[coolCountryCode];
    $("table").html("<thead><tr><th>Title</th><th>Sentiment</th></tr></thead>"); //reset table
    for (var w = 0; w <= countryObj.titles.length-1; w++)
    {
        $("table").append($("<tr><td>" + countryObj.titles[w] + "</td><td>" + countryObj.sentiment[w] + "</td></tr>"));
    }
    
    
    
}
    
google.charts.load('current', {
  callback: function () {
    var data = google.visualization.arrayToDataTable([
      ['Country', 'Popularity'],
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

    ]);

    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1]);
  
    var options = 
    {
      colorAxis: {colors: ['#FF0F00', '#00FFD4']},
      legend:  {textStyle: {color: 'black', fontSize: 20, italic: true}}
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

socket.on("info data", function(data){
    region = regionNameToLetters[data["region"]];
    objects = data["articleObjects"];
    average = regionAverage(objects);
    showCountry(region, average);
    
    var newObject = new countryObject();
    console.log("received region: " + region);
    
    for(var i=0;i<objects.length;i++)
    {
    	newObject.titles.push(objects[i].title);
    	newObject.sentiment.push(objects[i].sentiment.score);
    }
    countries[region] = newObject;
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
      ['Country', 'Happiness(0-500)'],
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

    ]);

    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1]);
  
    var options = 
    {
      colorAxis: {colors: ['#FF0F00', '#00FFD4']},
      legend:  {textStyle: {color: 'black', fontSize: 20, italic: true}}
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
  colors[countryName] = countryAverage + 250;
  
  refreshMap();
  
}
// '.tbl-content' consumed little space for vertical scrollbar, scrollbar width depend on browser/os/platfrom. Here calculate the scollbar width .
$(window).on("load resize ", function() {
  var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
  $('.tbl-header').css({'padding-right':scrollWidth});
}).resize();

