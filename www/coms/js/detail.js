
var g_lh = null;

function initAll ()
{
	var shopId = $.getUrlVar("shopId");
	g_lh = new LoginHandler ();
	
	initMenuPage ();
	initLocationPage ();
	
	$("#inner-wrapper").css("display","none");
	$("#loading-wrapper").css("display","block");
	
	$("#btn-buy").on ( "tap" , function()
	{
		if ( g_lh.isLogged() == true ) { location.href = "./buy.html?shopId=" + shopId; }
		else { location.href = "../member/index.html"; }
	});
	
	var param = null;
	if ( g_lh.isLogged () == true ) 
	{
		param = { sid:shopId, mid:g_lh.getLocalLoginInfo().id };
	}
	else { param = { sid:shopId }; }
	
	$.ajax ({
		url:"http://teamsf.co.kr/~coms/shop_detail_show.php",
		type:"post",
		dataType:"json",
		data:param,
		success:function ( currentShop )
		{
			var openTime = currentShop.start_time + " ~ " + currentShop.end_time;
			
			$("#name").html(currentShop.name);
	        $("#location").html(currentShop.location);
	        $("#time").html(openTime);
	        $("#closed").html(currentShop.closed);
	        $("#phone").html(currentShop.phone);
	        $("#profile-img").attr("src", currentShop.profile_img_path);

	        $("#combo1").html(currentShop.combo_1);
	        $("#combo2").html(currentShop.combo_2);
	        $("#combo3").html(currentShop.combo_3);
	        $("#combo4").html(currentShop.combo_4);
	        $("#combo5").html(currentShop.combo_5);

	        $(".currentCombo").html(currentShop.member_combo-1);
	        $(".currentCombo2").html(currentShop.member_combo);
	        $("#left-comboday").html(currentShop.combo_left_day);

	        $("#title").html(currentShop.name);
	        $("#tag-phone").attr("href", "tel:"+currentShop.phone);
	        $(".combo-box:nth-child("+parseInt(currentShop.member_combo)+")").addClass("active");

			$("#inner-wrapper").css("display","block");
			$("#loading-wrapper").css("display","none");
			
			// Passing shop variables to sub pages
			$("#page-location").attr("lat",currentShop.latitude)
			.attr("lng",currentShop.longitude)
			.attr("sname",currentShop.name);
			
			$("#page-menu").attr("imgaddr",currentShop.menu_img_path)
			.attr ( "sname",currentShop.name);
		}
	});
}

function initMenuPage ()
{
	$("#page-menu").on ( "pagebeforeshow" , function ()
	{
		var imgPath = $(this).attr("imgaddr");
		var shopName = $(this).attr("sname");
		
		$("#menu-inner-wrapper").css("display","none");
		$("#menu-loading-wrapper").css("display","block");
		
		$("#title-menu").html(shopName);
		$("#menu-img").attr({
			"src":imgPath,
			"width":"100%"
		});
	});
	
	$("#page-menu").on ( "pageshow" , function ()
	{
		$("#menu-inner-wrapper").css("display","block");
		$("#menu-loading-wrapper").css("display","none");
	});
}

function initLocationPage ()
{
	$("#page-location").on ( "pagebeforeshow" , function ()
	{
		navigator.notification.activityStart("위치보기", "지도 정보를 가져오는 중...");
		$("#content-location").css("display","invisible");
		
		var lat = $("#page-location").attr("lat");
		var lng = $("#page-location").attr("lng");
		var shopName = $("#page-location").attr("sname");
		
		var latlng = new google.maps.LatLng (lat, lng);
        var options = { 
            zoom : 15, 
            center : latlng, 
            mapTypeId : google.maps.MapTypeId.ROADMAP 
        };
        
        var $content = $("#page-location div:jqmData(role=content)");
        $content.height (screen.height-60);
        
        var map = new google.maps.Map ($content[0], options);
        new google.maps.Marker ( 
	    { 
	    	map : map, 
	    	animation : google.maps.Animation.DROP,
	    	position : latlng  
	    }); 
        
        $("#title-location").html(shopName);
	});
	
	$("#page-location").on ( "pageshow" , function ()
	{
		navigator.notification.activityStop ();
		$("#content-location").css("display","block");
	});
}

function initPhoneGap () 
{
	document.addEventListener ( "deviceready", initAll , false );
}