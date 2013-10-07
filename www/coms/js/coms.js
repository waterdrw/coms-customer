var g_gps = null;

function initAll ()
{
	g_gps = new GPSHandler ();
	g_gps.setNavigatorObj ( navigator );
	
    initMainPage ();
    initNearPage ();
}

function doAlert ( msg , title , callbackFunction )
{
	navigator.notification.alert ( msg , callbackFunction , title , "확인" );
}

function initNearPage ()
{
	$("#page-near").on ( "pagebeforeshow" , function()
	{
		$(".a-favorite").removeClass("ui-btn-active");
		$(".a-near").removeClass("ui-btn-active");
		
		$(".a-near").addClass("ui-btn-active");
		
		$("#wrapper-gps-loading").css("display","block");
		$("#wrapper-near").css("display","none");
		
		g_gps.getCoodinate ( function ( coordObj )
		{
			$("#wrapper-gps-loading").css ( "display","none" );
			$("#wrapper-near").css("display","block");
			
			if ( coordObj.success == false ) 
			{ 	
				doAlert ( coordObj.cause , "GPS 수신 오류" , function () 
				{
					$.mobile.changePage("#page-main");
				});
				return; 
			}	
			
			var lh = new LoginHandler ();
			var ajaxParam = null;
			if ( lh.isLogged() == true )
			{
				ajaxParam = 
				{
					mid:lh.getLocalLoginInfo().id,
					lat:coordObj.lat,
					lng:coordObj.lng,
					km:10.0
				};
			}
			else 
			{
				ajaxParam = 
				{
					lat:coordObj.lat,
					lng:coordObj.lng,
					km:10.0
				};
			}
			
			var myScroll;
			var combo_list = new Array ();
			
			$.ajax ({
				url:"http://teamsf.co.kr/~coms/shop_list_nearest_show.php",
				dataType:"json",
				data:ajaxParam,
				type:"post",
				success:function ( resultObj )
				{
					//drawShopList ( myScroll , resultObj , combo_list , "#wrapper-near" , "#scroller-near" );
					drawShopList ( myScroll , resultObj , combo_list , "#wrapper-near" , "#wrapper-near" );
				}
			});
		});
	});
}

function initMainPage ()
{	
	$("#page-main").on ( "pagebeforeshow" , function()
	{
		$(".a-favorite").removeClass("ui-btn-active");
		$(".a-near").removeClass("ui-btn-active");
		
		$(".a-favorite").addClass("ui-btn-active");
	});
	
	var lh = new LoginHandler ();
	var userData = lh.getLocalLoginInfo();

	var myScroll;
	var currentShop;

	var url = "http://teamsf.co.kr/~coms/shop_list_show.php";
	var url2 = "http://teamsf.co.kr/~coms/site_list_show.php";
	
	var list_start = 0;
	var list_end = 30;
	var zid = 1;
	var params;
	var s_params = {type:"street"};
	var store_type = "null";
	var combo_list = new Array();

	if (lh.isLogged() == true)  { params = {start:list_start, end:list_end, zid:zid, mid:userData.id}; }
	else { params = {start:list_start, end:list_end, zid:zid}; }

	$.ajax({
		type: "post",
		dataType: "json",
		url: url2,
		data: s_params		
	}).done(function(data){
		//console.log(data);
		var temp = "";
		for(var i in data) {
			temp += "<li data-icon='false'><a>"+data[i].name+"</a></li>";
		}
		$("#list-street").append(temp).listview("refresh");
	});

	$.ajax({
		type: "post",
		dataType: "json",
		url: url,
		data: params		
	}).done(function(data){
		//drawShopList ( myScroll , data , combo_list , "#wrapper" , "#scroller" );
		drawShopList ( myScroll , data , combo_list , "#wrapper" , "#wrapper" );
	});
}

function drawShopList ( myScroll , data , combo_list , wrapperSelector , scrollerSelector )
{
    var str = "";
    for(var i in data.list) 
    {
    	var temp = data.list[i];
    	combo_list[i] = temp.member_combo;

		str += "<div class='list-shop'><a class='a-shop-detail' href='./shop.html?shopId="+temp.id+"' rel='external'>";
		str += "<div class='row'>";
		str += "<div class='span shop-info'>";
		str += "<img src='"+temp.profile_img_path+"'>";
		str += "<p>"+temp.name+"</p>";
		str += "<p>위치 : "+temp.location+"</p>";
		str += "<p></p>";
		str += "</div>";
		str += "<div class='span combo-timer'>";
		//str += "<i class='icon-time'></i>";
		str += "<p>콤보타임</p>";
		str += "<hr>";
		str += "<p><i class='icon-time'></i> -"+temp.combo_left_day+"일</p>";
		str += "</div>";
		str += "</div>";
		str += "<div class='row'>";
		str += "<hr class='list-divider'>";
		str += "<div class='span header-combo'>콤보<br>할인</div>";
		str += "<div class='span combo-progress with-line'>";
		str += "<div class='combo-box'><i class='icon-heart'></i><span class='combo-text'>"+temp.combo_1+"%</span></div>";
		str += "<div class='combo-box'><i class='icon-heart '></i><span class='combo-text'>"+temp.combo_2+"%</span></div>";
		str += "<div class='combo-box'><i class='icon-heart '></i><span class='combo-text'>"+temp.combo_3+"%</span></div>";
		str += "<div class='combo-box'><i class='icon-heart '></i><span class='combo-text'>"+temp.combo_4+"%</span></div>";
		str += "<div class='combo-box'><i class='icon-gift '></i><span class='combo-text'>"+temp.combo_5+"%</span></div>";
		str += "</div>";
		str += "</div>";                 
		str += "</a></div>";
    }

	$(scrollerSelector).append(str);

	// display combo progress
	for (var i in combo_list){
		var temp = parseInt(i)+1;
		//console.log(temp+" : "+combo_list[i]);
		$('.list-shop:nth-child('+temp+') .combo-box:nth-child('+(combo_list[i])+')').addClass('active');
	}
    //myScroll = new IScroll(wrapperSelector, { scrollbars: true, mouseWheel: true, interactiveScrollbars: true, click:true });
    
    //document.removeEventListener("touchmove");
	//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
}

function initPhonegap ()
{
	document.addEventListener("deviceready", initAll , false);	
}