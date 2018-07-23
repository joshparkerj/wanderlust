// Foursquare API Info
const clientId = '3K3LZ4EXLMDAMUCGTBTGCKSOARKFIMSS5R4OJBKNOPPYP22O';
const clientSecret = 'TQE3FF3JLHBZ2PNCR2QSP0SVSVZKW0TXW2RFYTTU5DDCCWLR';
const url = 'https://api.foursquare.com/v2/venues/explore';
const param = '?near=';

// APIXU Info
const apiKey = '84ece35a0ed340f8b43185829182307';
const forecastUrl = 'https://api.apixu.com/v1/forecast.json?key=';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
const $weatherDivs = [$("#weather1"), $("#weather2"), $("#weather3"), $("#weather4")];
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function fyShuffle(arr){
	for (var i = 0; i < arr.length -1;i++){
		let j = i + Math.floor(Math.random()*arr.length-i);
		var temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}
	return arr;
};

// Add AJAX functions here:
const getVenues = async () => {
  const city = $input.val();
  const urlToFetch = url+param+city+'&limit=10'+'&client_id='+clientId+'&client_secret='+clientSecret+'&v=20180723';
  try{
    const response = await fetch(urlToFetch);
    if (response.ok){
      const jsonResponse = await response.json();
      const venues = jsonResponse.response.groups[0].items.map(e=>e.venue);
      return fyShuffle(venues);
    }
  }catch(error){
    console.log(error);
  }
}

const getForecast = async () => {
	const urlToFetch = forecastUrl+apiKey+'&q='+$input.val()+'&days=4'+'&hour=11';
	try{
		const response = await fetch(urlToFetch);
		if (response.ok){
			const jsonResponse = await response.json();
			const days = jsonResponse.forecast.forecastday;
			return days;
		}
	}catch(error){
		console.log(error);
	}
	  
}


// Render functions
const renderVenues = (venues) => {
  $venueDivs.forEach(($venue, index) => {
    // Add your code here:
    const venue = venues[index];
    const venueIcon = venue.categories[0].icon;
    const venueImgSrc = venueIcon.prefix+'bg_64'+venueIcon.suffix;
    console.log(venue);
    let venueContent = '<h2>'+venue.name+'</h2><img class="venueimage" src="'+venueImgSrc+'" title="'+venue.categories[0].name+'"/><h3>Address:</h3><p>'+venue.location.address+'</p><p>'+venue.location.city+'</p><p>'+venue.location.country+'</p>';
    $venue.append(venueContent);
  });
  $destination.append(`<h2>${venues[0].location.state}, ${venues[0].location.country}</h2>`);
}

const renderForecast = (days) => {
  $weatherDivs.forEach(($day, index) => {
    // Add your code here:
    const currentDay = days[index];
    let weatherContent = '<h2>High: '+currentDay.day.maxtemp_f+'</h2><h2> Low: '+currentDay.day.mintemp_f+'</h2><h2>UV Index: '+currentDay.day.uv+'</h2><h2>'+currentDay.day.totalprecip_in+' in. precip.</h2><img src="http:'+currentDay.day.condition.icon+'" class="weathericon" /><h2>'+weekDays[(new Date(currentDay.date)).getDay()]+'</h2>';
    $day.append(weatherContent);
  });
}

const executeSearch = () => {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDivs.forEach(day => day.empty());
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues().then(venues=>renderVenues(venues));
  getForecast().then(days=>renderForecast(days));
  return false;
}

$submit.click(executeSearch)
