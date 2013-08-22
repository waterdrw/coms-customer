$(document).ready(function(){

	navigator.geolocation.getCurrentPosition (function (pos)
	{
	  var lat = pos.coords.latitude;
	  var lng = pos.coords.longitude;
	  
	  var latlng = new google.maps.LatLng (lat, lng);
	  var options = { 
	    zoom : 15, 
	    center : latlng, 
	    mapTypeId : google.maps.MapTypeId.ROADMAP 
	  };
	  var $content = $("div:jqmData(role=content)");
	  $content.height (screen.height-60);
	  var map = new google.maps.Map ($content[0], options);
	  //$.mobile.changePage ($("#win2"));
	  
	  new google.maps.Marker ( 
	  { 
	    map : map, 
	    animation : google.maps.Animation.DROP,
	    position : latlng  
	  });  
	});



});