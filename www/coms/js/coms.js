var g_gps = null;
var g_lh = null;
var g_zoneId = 0;

function initAll () 
{
	g_gps = new GPSHandler ();
	g_gps.setNavigatorObj ( navigator );
	g_lh = new LoginHandler ();
	
	$(".a-favorite").on ( "tap", function() { g_zoneId=0; initMainPage(); } );
	$(".a-near").on ( "tap", initNearPage );
	
	initMainPage ();
}

function doAlert ( msg , title , callbackFunction )
{
	navigator.notification.alert ( msg , callbackFunction , title , "확인" );
}

//관심지역 상점 리스트 로드
function initMainPage ()
{
	$("#wrapper").css("display","none");
	$("#loading-wrapper").css("display","block");
	$("#loading-msg").html("상점 리스트를 가져옵니다...");
	
	$(".a-favorite").removeClass("ui-btn-active");
	$(".a-near").removeClass("ui-btn-active");
	$(".a-favorite").addClass("ui-btn-active");
	
	$("#coms-title").html("콤스토어");
	
	// inner function : ajax request for shop list loading
	function requestShopList ( param )
	{
		var comboList = new Array ();
		
		$.ajax ({
			url:"http://teamsf.co.kr/~coms/shop_list_show.php",
			data:param,
			dataType:"json",
			type:"post",
			success:function ( shopListObj )
			{
				$("#loading-msg").html("콤스존 리스트를 가져옵니다...");
				
				if ( shopListObj.zone_name != null ) { $("#coms-title").html(shopListObj.zone_name); } 
				
				$.ajax ({
					url:"http://teamsf.co.kr/~coms/site_list_show.php",
					data:{type:"all"},
					dataType:"json",
					type:"post",
					success:function ( siteListObj )
					{
						$("#loading-wrapper").css("display","none");
						$("#wrapper").css("display","block");
						
						$("#wrapper").html("");
						drawShopList ( shopListObj , comboList , "#wrapper" );
						
						$("#list-street").html("");
						var temp = "";
						for(var i in siteListObj) 
						{ 
							temp += "<li data-icon='false' class='site-item' stid='" + siteListObj[i].id + "'>" +
										"<a>"+siteListObj[i].name+"</a></li>"; 
						}
						$("#list-street").append(temp).listview("refresh");
						
					}
				});
			}
		});
	}
	
	var shopListParam = null;
	if ( g_lh.isLogged() == true ) 
	{
		g_lh.doLogin ( function ( loginInfoObj )
		{	
			if ( loginInfoObj.success == true )
			{
				var zid = 1; 
				if ( g_zoneId != 0 ) { zid = g_zoneId; }
				else { zid = loginInfoObj.memberInfo.zone_id; }
				shopListParam = 
				{
					start:0, 
					end:30, 
					zid:zid, 
					mid:loginInfoObj.memberInfo.id
				};
				requestShopList ( shopListParam );
			}
			else { doAlert("사용자 정보 로드 실패","관심지역 로드 실패",function(){}); return;}
		});
	}
	else 
	{
		var zid = 1; if ( g_zoneId != 0 ) { zid = g_zoneId; }
		shopListParam = {start:0, end:30, zid:zid};
		requestShopList ( shopListParam );
	}
}

// 내 근처 상점 리스트 로드
function initNearPage ()
{
	$("#wrapper").css("display","none");
	$("#loading-wrapper").css("display","block");
	$("#loading-msg").html("GPS 정보를 가져옵니다...");
	
	$(".a-favorite").removeClass("ui-btn-active");
	$(".a-near").removeClass("ui-btn-active");
	$(".a-near").addClass("ui-btn-active");
	
	$("#coms-title").html("내 근처 상점");
	
	g_gps.getCoodinate ( function ( coordObj )
	{
		if ( coordObj.success == false ) 
		{ 	
			doAlert ( coordObj.cause , "GPS 수신 오류" , function (){});
			initMainPage ();
			return; 
		}	
		
		$("#loading-msg").html("상점 리스트를 가져옵니다...");
		
		var ajaxParam = null;
		if ( g_lh.isLogged() == true )
		{
			ajaxParam = 
			{
				mid:g_lh.getLocalLoginInfo().id,
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
		
		var comboList = new Array ();
		
		$.ajax ({
			url:"http://teamsf.co.kr/~coms/shop_list_nearest_show.php",
			dataType:"json",
			data:ajaxParam,
			type:"post",
			success:function ( resultObj )
			{
				$("#wrapper").css("display","block");
				$("#loading-wrapper").css("display","none");
				$("#wrapper").html("");
				drawShopList ( resultObj , comboList , "#wrapper" );
			}
		});
	});
}

function initPhoneGap () 
{
	document.addEventListener ( "deviceready", initAll , false );
}

function drawShopList ( data , combo_list , wrapperSelector )
{
    var str = "";
    for(var i in data.list) 
    {
    	var temp = data.list[i];
    	combo_list[i] = temp.member_combo;

		str += "<div class='list-shop'><a class='a-shop-detail' shopid='" + temp.id + "' href='./shop.html?shopId="+temp.id+"' rel='external'>";
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
		str += "<div class='span header-combo'>콤	보<br>할인</div>";
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
    
	$(wrapperSelector).append(str);
	
	for (var i in combo_list)
	{
		var temp = parseInt(i)+1;
		$('.list-shop:nth-child('+temp+') .combo-box:nth-child('+(combo_list[i])+')').addClass('active');
	}
}