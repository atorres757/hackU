$(document).ready(function () {
	var map, count, markers=[], listings=[], infoWindow = new google.maps.InfoWindow;

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

	function getLatLong(locationString)	{
				
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode({address:locationString}, function(results, status){
				locate = results[0];
				var latlongObject = {};
				latlongObject.lat = locate.geometry.location.lat();
				latlongObject.lng = locate.geometry.location.lng();
				
				$.ajax({
				   type: "GET",
				   url: "http://204.154.41.98/hackuFE/search-by-latlong.php",
				   data: latlongObject,
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
						var image = "http://maps.google.com/mapfiles/kml/pal2/icon61.png";
						var marker = new google.maps.Marker({'position': latlng, 'map':map, 'icon': image});
						listings.push(result);
						markers.push(marker);
						google.maps.event.addListener(marker, 'click', function () {
							var idx = markers.indexOf(this), listing = listings[idx];			
							infoWindow.setOptions({"position": this.position, "content": "<div id='total'><img src=\"" + listing.images.url[0] + '" style="width:50px;height:50px;float:left; margin: 0 10px 0 0;" /><div id="textform">' + listing.name + '<br>' + listing.phone + '<br><a href="#profile-page" align=" right;">More Details</a></div></div>'}); 
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
		getLatLong(sval);
		map.setZoom(12);
	});
	
	initializeMap();
});

