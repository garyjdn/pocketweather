var express = require('express');
var app = express();

var $;
require("jsdom").env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }

    $ = require("jquery")(window);
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.send("hello world!");
});

app.get('/:lat/:lon', function (req, res) {
  console.log("hello world");
  var resp;
 	var _url = 'http://api.openweathermap.org/data/2.5/forecast?lat='+req.params.lat+'&lon='+req.params.lon+'&appid=761aeba58339a5ad8ac2b75e91ef26de&units=metric';
 		$.ajax({
			url: _url,
			type: "GET",
			cache:false,
			success: function(resp){
				var listArr = [];
				var currentDate = new Date();
				var pointer = new Date();
				var today = [];
				var tomorrow = [];
				var newList = []
				var flag = 0;


				for(var i = 0; i < resp.list.length; i++){

					var date = new Date(resp.list[i].dt_txt);
					if(date.getDate() == currentDate.getDate()){
						if((date.getHours()+3) >= currentDate.getHours()){

							//console.log("its Today");
							listArr.push({day: "today", date: resp.list[i].dt_txt,temp: resp.list[i].main.temp, weather: resp.list[i].weather[0].main});
              //console.log(today);
						}
					} else if(date.getDate() == (currentDate.getDate() + 1)){
						//console.log("its tomorrow");
						listArr.push({day: "tomorrow", date: resp.list[i].dt_txt,temp: resp.list[i].main.temp, weather: resp.list[i].weather[0].main});
            //console.log(tomorrow);
					} else {
            var dateDay = date.getDay();
            //console.log("lalalalalallalala = "+dateDay);
            switch(dateDay){
              case 0:
                var thisDayName =  "Sunday";
                break;
              case 1:
                var thisDayName =  "Monday";
                break;
              case 2:
                var thisDayName =  "Tuesday";
                break;
              case 3:
                var thisDayName =  "Wednesday";
                break;
              case 4:
                var thisDayName =  "Thursday";
                break;
              case 5:
                var thisDayName =  "Friday";
                break;
              case 6:
                var thisDayName =  "Saturday";
                break;
            }

						//console.log("pointer : "+pointer.getDate()+" and loop date : "+date.getDate());
						//console.log("i : "+i+" & "+"len :"+(resp.list.length-1));
						//if(pointer.getDate() < date.getDate()){
						//	console.log("pointer will change");
						//	if(flag != 0){
						//		listArr.push(newList);
								//console.log("pushing new list");
						//	}
						//	pointer = date;
							//newList = [];
						//	flag = 1;
						//}
						listArr.push({day: thisDayName, date: resp.list[i].dt_txt,temp: resp.list[i].main.temp, weather: resp.list[i].weather[0].main});
						//if(i == (resp.list.length-1)){
							//listArr.push(newList);
            //  console.log(newList);
							//console.log("pushing new list");
						//}

					}
          console.log("listArr--------------------------------------------------------------------");
          console.log(listArr);
					//console.log(date);
					//listArr.push({date: resp.list[i].dt_txt, temp: resp.list[i].main.temp, weather: resp.list[i].weather[0].main});
				}
				var obj = {city:resp.city.name, list:listArr};
        console.log("obj----------------------------------------------------------------------------");
				console.log(obj);
				resp = JSON.stringify(obj);
        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
			}
		});

  //console.log(resp);
 	//res.setHeader('Content-Type', 'application/json');
 	//res.send(resp);
  //res.send('hello world')
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
