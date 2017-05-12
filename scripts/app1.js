
// To Do:

// optionally put a marker at users current location 
// Solve the 404 Not Found Error


$(function() {
	//alert("helooooo");
	var position = new google.maps.LatLng(40.993436, -95.070279);
	var output = $('#output');
	var errorMessage = "";
	var coords = [];
	var markerData = [];
	var map;

	// constructor for markerObjects
	function markerObject(lat, lng, name) {
		this.lat = lat;
		this.lng = lng;
		this.name = name;
	}

	get_location();

	init_map(position);

	//Add listeners on search buttons
	$('#city-btn').click(function() {
		// event.preventDefault();
		search_city();
	});
	$('#zip-btn').click(function() {
		search_zip();
	});
	$('#locate').click(function(){
		auto_search();

	});
/**
 * Make ajax call to lookup.php,
 * @param  city name or zip code.
 * @return | print to console, for now a list of breweries local to info.
 * 
 */
function find_brewery(search_param, data) {
	// alert(search_param)
	$.get("lookup.php", { info: data, method: search_param, dataType: "json"})
		.done(function(response){
			//console.log(response);
			var data_arr = JSON.parse(response).data;
			console.log(data_arr);
			if (data_arr) {
				clear_fields();
				var outputString = '';
				//console.log(response);
				var table = document.createElement('table');
				var top_row = document.createElement('tr');
	
				var name_head = document.createElement('th');
				name_head.innerHTML = "Brewery";
				var desc_head = document.createElement('th');
				desc_head.innerHTML = "Description";
				

				//var web_head = document.createElement('th');
				//web_head.innerHTML = "Site";
				

				var icon_head = document.createElement('th');
				//icon_head.innerHTML = "Image";
 				top_row.appendChild(name_head);
				top_row.appendChild(desc_head);
				
				//top_row.appendChild(web_head);
				
				top_row.appendChild(icon_head);
				table.appendChild(top_row);
				$('#output').append(table);
				
				// Clear the markerData so it doesn't accumulate.   
				markerData = [];
				for(var i = 0;i<data_arr.length;i++){

					var name = data_arr[i].brewery.name;
					var website = "";
					var websiteTrimmed ="";
					
					if(data_arr[i].brewery.hasOwnProperty('website') && data_arr[i].brewery.website != null) {
						
						website = data_arr[i].brewery.website;
						websiteTrimmed = website.substring(11, website.length-1);
					}	
					else { website = "No site available"; }

					var icon = null;
					var picture = null;
					var lat = data_arr[i].latitude;
					var lng = data_arr[i].longitude;
					var description;
					
					// if(!website){website = "No site available";}
					
					if(data_arr[i].brewery.hasOwnProperty('images') ) {
						if(data_arr[i].brewery.images.hasOwnProperty("icon") && data_arr[i].brewery.images.icon != null){
							icon = data_arr[i].brewery.images.icon;
						}
					}	
					if(data_arr[i].brewery.hasOwnProperty('description') && data_arr[i].brewery.description != null) {
						description = data_arr[i].brewery.description;
					}
					else { description = "Sorry, no description is available"
					}
					
					var tr = document.createElement('tr');
					var tdName = document.createElement('td');
					

					var tdWebsite = document.createElement('td');
					

					var tdDescription = document.createElement('td');
					var tdIcon = document.createElement('td');
					var tdImg = document.createElement('img');
					var tda = document.createElement('a');

					tdName.setAttribute('class', 'name-col')
					tdName.innerHTML = "<p><a href='"+website+"'>"+name+"</a></p>";
					

					tda.href = website;
					

					tda.innerHTML = websiteTrimmed;
					

					tdWebsite.appendChild(tda);
					tdDescription.setAttribute('class', 'desc-text');
					tdDescription.innerHTML = description;
					tdImg.src = icon;
					tdIcon.appendChild(tdImg);
					// attach column data to row
					tr.appendChild(tdName);
					tr.appendChild(tdDescription);
					

					//tr.appendChild(tdWebsite);
					tr.appendChild(tdIcon);
					tr.appendChild(tdIcon);
					table.appendChild(tr);
					//console.log(tr)
					var markerObj = new markerObject(lat, lng, name);
					markerData.push(markerObj);
				
				}
				// alert(markerData)
				init_map2({
					lat: coords[0],
					lng: coords[1]
				});
			}	
			else {
				errorMessage = "Try a different zip code or city name";
				show_errors();
				clear_fields();
			}
		});
}

// Geolocation functions //
function get_location() {
	if(navigator.geolocation) {
		// alert("nav.geo is ture");
		navigator.geolocation.getCurrentPosition(function(position) {
			coords[0] = position.coords.latitude;
			coords[1] = position.coords.longitude;
		});
	}
	else {
		errorMessage = "FYI: Auto-locate not supported";
		show_errors();
		return false;
	}
}
function show_position(position) {
	var lat = position.coords.latitude;
	var lng = position.coords.longitude;
	alert(lat);
	alert(lng);
	coords.push(lat, lng);
	alert(coords)
}
function auto_search() {
	get_location();
	if(coords.length > 0){
		show_errors();
		
		find_brewery("auto", coords);
	}
	else { 
		alert("Did not recieve coord_arr from get_location");
	}
}

/**
 * [search_city description]
 * @return {[type]} [description]
 */
function search_city() {
	var city = $('#city-name').val();
	if(check_city(city)) {
		if(coords.length > 0){
		show_errors();
		
		find_brewery("city", city);
		}
	}
	else { 
		alert("Did not recieve coord_arr from get_location");
	}

}



function search_zip() {
	var zip = $('#zip').val();
	var patt2 = /^[0-9]{5}(-[0-9]{4})?$/;
	if(!patt2.test(zip)){
		errorMessage = "<p class='errText'>Please use '#####' or '#####-####'</p>";
		show_errors();
	}
	else find_brewery("zip", zip);
	
}


function show_errors() {
	var output = document.getElementById('output');
	output.innerHTML = "";
	output.innerHTML = errorMessage;
	errorMessage = "";
}
function clear_fields() {
	$('#city-name').val("");
	$('#zip').val("");
}
/**
 * Helper - Validates contents of city field
 * @param  String - looks for a valid city name as recognized by BreweryDB API
 * @return - boolean - if error is found, writes message to error array.
 */
function check_city(input) {
	var ok = false;
	var patt1 = /^[a-zA-Z0-9',._ -]+$/g;
	if(input.trim() == 0){
		//alert('ok1');
		errorMessage = "<p class='errText'>Please enter a valid city name</p>";
	}

	else if(!patt1.test(input)) {
		//alert('ok2');
		errorMessage = "<p class='errText'>Please no special characters</p>";
	}
	else {
		//alert('ok3');
		ok = true;
	}
	show_errors();
	return ok;
}

function init_map(loc) {
	var map_properties = {center: loc, zoom: 3 };
	map = new google.maps.Map($('#map').get(0), map_properties);
	// Removed property scrollwheel: false
	var center;
    google.maps.event.addDomListener(map, 'idle', function() {
		center = map.getCenter();
	});
	google.maps.event.addDomListener(window, 'resize', function() {
		map.setCenter(center);
	});
}
function init_map2(loc) {

	var map_properties = {center: loc, zoom: 9 };
	map = new google.maps.Map($('#map').get(0), map_properties);
	// Removed property scrollwheel: false
	
	var center;
    google.maps.event.addDomListener(map, 'idle', function() {
		center = map.getCenter();
	});
	google.maps.event.addDomListener(window, 'resize', function() {
		map.setCenter(center);
	});
	
	// create new info window
	 infoWindow = new google.maps.InfoWindow();

	// Need to populate array before disp_markers. 
	display_markers();
	
	// Event that closes the InfoWindow with a click on the map
   	google.maps.event.addListener(map, 'click', function() {
       infoWindow.close();
    });
}
// This function will iterate over markersData array
// creating markers with createMarker function
function display_markers() {
    // this variable sets the map bounds and zoom level according to markers position
	var bounds = new google.maps.LatLngBounds();
	//alert("marker data"+markerData);
	var latlng
	for (var i = 0;i < markerData.length;i++) {
		var name = markerData[i].name;
		var lat = markerData[i].lat;
		var lng = markerData[i].lng;
		var latlng = new google.maps.LatLng(lat, lng);
		create_marker(latlng, name);

		// Marker’s Lat. and Lng. values are added to bounds variable
      	bounds.extend(latlng); 
		
	}
	// alert(latlng);
	// Most excellent, this worked to center map on a group of markers. 
	map.setCenter(latlng);
	// Bounds variable is used to set the map bounds
    // with API’s fitBounds() function
	

	//map.fitBounds(bounds);
}
// This function creates each marker and sets their Info Window content
function create_marker(latlng, name) {
	var marker = new google.maps.Marker({
		map: map,
		position: latlng,
		title: name
	});
	// This event expects a click on a marker
	
	var winContent = "";
	google.maps.event.addListener(marker, 'click', function() {
		winContent = "<div><p>"+name+"</p></div>";
		// alert(name)
		infoWindow.setContent(winContent);

     	// open infowindow in the current map and at the current marker location
    	infoWindow.open(map, marker);
		
	});
	google.maps.event.addListener(marker, 'hover', function() {
		winContent = "<div><p>"+name+"</p></div>";
		infoWindow.setContent(winContent);
		infoWindow.open(map, marker);
		//alert(name);
	});
		
	winContent = "<div><p>"+name+"</p></div>";
	infoWindow.setContent(winContent);
	infoWindow.open(map, marker);

}






});











