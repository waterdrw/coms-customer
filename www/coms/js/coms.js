var g_gps = null;
var g_lh = null;
var g_zoneId = 0;
var g_isOpen = false;
var g_panelOpen = false;

var g_prevNavigator = null;

function initAll () 
{
	g_gps = new GPSHandler ();
	g_gps.setNavigatorObj ( navigator );
	g_lh = new LoginHandler ();
	
	$(".a-favorite").on ( "tap", function() { g_zoneId=0; initMainPage(); } );
	$(".a-near").on ( "tap", initNearPage );
	
	bindPanelEvent ();
	bindBackButton ();
	initMainPage ();
}

function bindPanelEvent ()
{
	$("#panel-street").panel ({
		beforeopen:function ( event , ui ) { g_panelOpen=true; },
		close:function ( event , ui ) { g_panelOpen=false; }
	});
}

function bindBackButton ()
{
	var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
	if ( deviceType != "Android" ) { return; }

	navigator.app.overrideBackbutton(true);
	document.addEventListener("backbutton", function ()
	{
		if ( g_isOpen == true ) { return; }
    	g_isOpen = true;
    	
		navigator.notification.confirm ( "콤스를 종료하시겠습니까?", function ( btnIndex )
    	{	
    		g_isOpen = false;
    		if ( btnIndex == 1 ) { navigator.app.exitApp(); }
    	}, "콤스 종료" ,"확인,취소" );
	}, true );
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
						
						$(".site-item").off().on ( "tap" , function ()
						{
							var siteId = $(this).attr("stid");
							g_zoneId = parseInt(siteId);
							initMainPage ();
							$("#panel-street").panel ( "close" );
						});
						
						$("#loading-wrapper").css("display","none");
						$("#wrapper").css("display","block");
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
			else 
			{
				// 사용자 정보 로드 실패시 -> 비로그인시 
				//doAlert("사용자 정보 로드 실패","관심지역 로드 실패",function(){}); return;
				
				shopListParam = 
				{
					start:0, 
					end:30, 
					zid:1
				};
				requestShopList ( shopListParam );
			}
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
	
	g_prevNavigator.geolocation.getCurrentPosition ( function ( position )
	{
		$("#loading-msg").html("상점 리스트를 가져옵니다...");
		var ajaxParam = null;
		if ( g_lh.isLogged() == true )
		{
			ajaxParam = 
			{
				mid:g_lh.getLocalLoginInfo().id,
				lat:position.coords.latitude,
				lng:position.coords.longitude,
				km:20.0
			};
		}
		else 
		{
			ajaxParam = 
			{
				lat:position.coords.latitude,
				lng:position.coords.longitude,
				km:20.0
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
	},
	function ( error )
	{
		doAlert ( "현재 위치 수신에 실패했습니다." , "GPS 수신 오류" , function (){});
		initMainPage ();
		return;
	});
}

function initPhoneGap () 
{
	g_prevNavigator = navigator;
	document.addEventListener ( "deviceready", initAll , false );
}

function drawShopList ( data , combo_list , wrapperSelector )
{
    var str = "";
    for(var i in data.list) 
    {
    	var temp = data.list[i];
    	combo_list[i] = temp.member_combo;

		//str += "<div class='list-shop'><a class='a-shop-detail' shopid='" + temp.id + "' href='./shop.html?shopId="+temp.id+"' rel='external'>";
		str += "<div class='list-shop'><a class='a-shop-detail' shopid='" + temp.id + "'>";
		str += "<div class='row'>";
		str += "<div class='span shop-info'>";
		str += "<img src='"+temp.profile_img_path+"'>";
		str += "<p>"+temp.name+"</p>";
		str += "<p>위치 : "+temp.location+"</p>";
		
		if ( temp.is_near == true ) 
		{ 
			str += "<p style='color:#DA443F;'>판매 종료 임박 -" + temp.near_left_day + "</p>"; 
		}
		else { str += "<p></p>"; }
		
		str += "</div>";
		str += "<div class='span combo-timer'>";
		//str += "<i class='icon-time'></i>";
		str += "<p>콤보타임</p>";
		str += "<hr>";
		str += "<p><i class='icon-time'></i> -"+temp.combo_left_day+ "일</p>";
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
    
	$(wrapperSelector).append(str);
	
	for (var i in combo_list)
	{
		var temp = parseInt(i)+1;
		$('.list-shop:nth-child('+temp+') .combo-box:nth-child('+(combo_list[i])+')').addClass('active');
	}
	
	$(".a-shop-detail").off().on ( "tap" , function ()
	{
		if ( g_panelOpen == true ) { return; }
		var shopId = $(this).attr("shopid");
		location.href = "./shop.html?shopId=" + shopId;
	});
}