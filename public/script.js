var url = window.location.href;
var arr = url.split("/");
var result = arr[0] + "//" + arr[2];
var socket = io.connect("https://huskie-hack-bhargav-y.c9users.io/");
var coolCountryCode = "hi";
var codeToArticles = [];
var regionNameToLetters = {"de-de": "DE", "en-au": "AU", "en-ca": "CA", "es-es": "ES", "en-gb": "GB", "en-ie": "IE", "en-in": "IN", "es-mx": "MX", "en-nz": "NZ", "en-us": "US", "fr-ca": "FR", "fr-fr": "FR", "it-it": "IT", "ja-jp": "JP", "nl-nl": "NL", "pt-br": "BR", "zh-cn": "CN"};
var titles = [];
var sentiment = [];
var country = [];
var table = document.getElementById('tableBoss');
var selectedCountry = "";
var articleNumber = 0;
var rowNumber = 0;
var roww;
var usSentColor = 0;
var ruSentColor = 0;
var gbSentColor = 0;
var frSentColor = 0;
var auSentColor = 0;
var brSentColor = 0;
var inSentColor = 0;
var chSentColor = 0;
var jpSentColor = 0;
var caSentColor = 0;
var krSentColor = 0;
var arSentColor = 0;
var zaSentColor = 0;
var mxSentColor = 0;
var esSentColor = 0;
var deSentColor = 0;
var egSentColor = 0;
var grSentColor = 0;
var itSentColor = 0;
var sentColors =  [usSentColor, ]
var countryArray = ['US','RU','GB','FR','AU','BR','IN','CH','JP','CA','KR','AR','ZA','MX','ES','DE','EG','GR','IT'];
    
function tableArticles()
{
    console.log("country: " + country.length);
    for (var i = 0; i < titles.length; i++)
    {
        if (coolCountryCode === country[i])
        {
            articleNumber++;
        } 
    }
    
    //output = "<tr>" + country[i] + "</tr><br>"
    
    for (var w = 0; w <= titles.length; w++)
    {
        $("table").append($("<tr><td>" + titles[w] + "</td><td>" + sentiment[w] + "</td></tr>"))
        /*
        roww = table.insertRow(w);
        titles[w] = roww.insertCell(1);
        sentiment[w] = roww.insertCell(2);
        rowNumber++;
        */
    }
    
    
    
}
    
google.charts.load('current', {
  callback: function () {
    var data = google.visualization.arrayToDataTable([
      ['Country', 'Popularity'],
      ['US', usSentColor,],
      ['RU', ruSentColor,],
      ['GB', gbSentColor,],
      ['FR', frSentColor,],
      ['AU', auSentColor,],
      ['BR', brSentColor,],
      ['IN', inSentColor,],
      ['CH', chSentColor,],
      ['JP', jpSentColor,],
      ['CA', caSentColor,],
      ['KR', krSentColor,],
      ['AR', arSentColor,],
      ['ZA', zaSentColor,],
      ['MX', mxSentColor,],
      ['ES', esSentColor,],
      ['DE', deSentColor,],
      ['EG', egSentColor,],
      ['GR', grSentColor],
      ['IT', itSentColor,],

    ]);

    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1]);
  
    var options = 
    {
      colorAxis: {colors: ['#FF0F00', '#00D4FF']},
      legend:  {textStyle: {color: 'black', fontSize: 20, italic: true}}
    }

    var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

    google.visualization.events.addListener(chart, 'select', function () {
      showNews();
      var selection = chart.getSelection();
      coolCountryCode = countryArray[selection[0].row];
      tableArticles();
      if (selection.length > 0) {
        window.open('http://' + data.getValue(selection[0].row, 2), '_blank');
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
    showCountry(regionNameToLetters[region], average);
    console.log(objects);
    for(var i=0;i<objects.length;i++)
    {
    	titles.push(objects[i].title);
    	sentiment.push(objects[i].sentiment.score);
    	console.log(objects[i].sentiment.score)
    	country.push(region);
    }
    console.log(country);
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

function showNews()
{
        document.getElementById('regions_div').style.display = "none"
        document.getElementById('welcomeDiv').style.display = "block"
}

function hideNews()
{
    document.getElementById('regions_div').style.display = "block"
    document.getElementById('welcomeDiv').style.display = "none"
}

/*
Country Name is the name of the country
countryAverage is the average sum between -500, 500 of the country
*/ 
function showCountry(countryName, countryAverage) 
{
  for (var p = 0; p < countryArray.length; p++)
  {
    if (countryName === countryArray[p])
    {
      countryArray[p].substr(0,2)
    }
  }
}
// '.tbl-content' consumed little space for vertical scrollbar, scrollbar width depend on browser/os/platfrom. Here calculate the scollbar width .
$(window).on("load resize ", function() {
  var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
  $('.tbl-header').css({'padding-right':scrollWidth});
}).resize();

