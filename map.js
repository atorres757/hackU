$(document).ready(function () {
	var map, count, markers=[], listings=[], infoWindow = new google.maps.InfoWindow, listing;

	function initializeMap() {
		var mapOptions = {
			center: new google.maps.LatLng(36.88, -76.25),
			zoom: 12,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		// Pop a map on the page
		map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
		google.maps.event.trigger(map, 'resize');
	}


	
	function placeBayouMarkers(results){
		for(idx in results){
			var result = results[idx];
			var pos = new google.maps.LatLng(result.geometry.location.kb, result.geometry.location.lb);
			var icon = {};
			icon.url = result.icon;
			icon.scaledSize = new google.maps.Size(30, 30);
			var marker = new google.maps.Marker({'position': pos, 'map':map, 'icon':icon});
		}
	}
				
	function getLatLong(locationString, placesNearString){
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode({address:locationString}, function(results, status){
				locate = results[0];
				locationLatLon = new google.maps.LatLng(locate.geometry.location.lat(), locate.geometry.location.lng());
				
				google.maps.event.trigger(map, 'resize');
				map.setCenter(locationLatLon);
				
				if(typeof placesNearString === "string" && placesNearString != ""){
				    var request = {
			    		location: locationLatLon,
					    radius: '500',
					    query: placesNearString
				    };
					service = new google.maps.places.PlacesService(map);
					service.textSearch(request, function(results, status){
						placeBayouMarkers(results);
					});
				}
				
				
				$.ajax({
				   type: "GET",
				   url: "http://204.154.41.98/hackuFE/search-by-latlong.php",
				   data: {lat : locationLatLon.lat(), lon:locationLatLon.lng()},
				   cache: false,
				   dataType: 'jsonp',
				   error: function () {
					console.log('error');
				   },
				   success: function(response) {
					for (var i = 0; i < markers.length; i++ ) {
						markers[i].setMap(null);
					}
					var results = response.results, listings = [], bounds = new google.maps.LatLngBounds();
					for(var idx in results){
						var result = results[idx], latlng = new google.maps.LatLng(result.latitude, result.longitude);
						var image = "http://png.findicons.com/files/icons/951/google_maps/32/apartment.png";
						var marker = new google.maps.Marker({'position': latlng, 'map':map, 'icon': image});
						listings.push(result);
						markers.push(marker);
						google.maps.event.addListener(marker, 'click', function () {
							var idx = markers.indexOf(this);
							listing = listings[idx];			
							infoWindow.setOptions({"position": this.position, "content": "<div id='total'><img src=\"" + listing.images.url[0] + '" style="width:50px;height:50px;float:left; margin: 0 10px 0 0;" /><div id="textform">' + listing.name + '<br>' + '<a href="tel:' + $.trim(listing.phone) + '">' + $.trim(listing.phone) + '</a>' + '<br><a href="#profile-page" align=" right;">More Details</a></div></div>'}); 
							infoWindow.open(map, this);
						});
						bounds.extend(latlng);
					}
					
					google.maps.event.trigger(map, 'resize');
					map.fitBounds(bounds);
				   }
				 });
				 });	
	}
	$('#map-page').live('pageinit', initializeMap);

	$('#sbutton').bind("click", function (){
		var sval = $('#searchfield').val();
		getLatLong(sval);
		map.setZoom(12);
	});
	
	$('#mapSearchBox').bind("click change", function (){
		var sval = $(this).val();
		var nearVal = $('#searchfieldBy').val();
		getLatLong(sval, nearVal);
		map.setZoom(12);
	});
	
	$("#profileButton").live('click', function(){
		$('#profile-data').html("<img src=\"" + listing.images.url[0] + '" style="width:80%;margin: 0 10px 0 10px;" /><div id="ptextForm">' + listing.name + '<br>'+ listing.address1 + '<br>' + ' ' + listing.zip + '<br>' + listing.phone + '<br></div></div>');
	});
	
	initializeMap();
});

