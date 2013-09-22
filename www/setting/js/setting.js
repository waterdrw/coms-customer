
//var myScroll;
var g_lh = null;
var g_iu = null;
var g_isOpen = false;

function initAll ()
{	
	g_lh = new LoginHandler ();
	g_iu = new ImageUploader ();	
	g_iu.setNavigatorObj ( navigator );
	
	//myScroll = new IScroll('#wrapper', { scrollbars: true, mouseWheel: true, interactiveScrollbars: true, click:true });
	//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	
	// 상단 공지 버튼들 이벤트 바인딩
	$(".notice-link").on ( "click" , function ()
	{
		var pageTitle = $(this).attr("title");
		var pageCategory = $(this).attr("category");
		
		$("#page-notice").attr("title",pageTitle)
						.attr("category",pageCategory);
		$.mobile.changePage ( "#page-notice" );
	});
	
	// 페이지별 이벤트 바인딩 
	bindAccountSettingPage ();
	bindLogoutPage ();
	bindAccountDeletePage ();
	bindNoticePage ();
}

function doAlert ( msg , title , callbackFunction )
{
	navigator.notification.alert ( msg , callbackFunction , title , "확인" );
}

function bindNoticePage ()
{
	$(document).on("pagebeforeshow","#page-notice",function()
	{
		var pageTitle = $(this).attr("title");
		var pageCategory = $(this).attr("category");
		$("#notice-title").html(pageTitle);
		
		$.ajax ({
			url:"http://teamsf.co.kr/~coms/notice_list_show.php",
			data:{cat:pageCategory},
			dataType:"json",
			type:"post",
			success:function ( resultObj )
			{
				var i; var wholeExpr = "";
				for ( i = 0 ; i < resultObj.length ; i++ )
				{
					var row = resultObj[i];
					var rowExpr = 
						"<div data-role=\"collapsible\">" +
						"	<h3>" + row.title + "</h3>" +
						"	<p>" + row.content + "</p>";
					if ( row.image_path != null )
					{
						rowExpr += "<img src=\"" + row.image_path + "\" style=\"width:100%;\">";
					}
					
					rowExpr += "</div>";
					wholeExpr += rowExpr;
				}
				$("#notice-list").html(wholeExpr)
				.trigger("create");
			}
		});
	});
}

function bindAccountDeletePage ()
{
	$(document).on("pageinit","#page-account-delete",function ()
	{
		if ( g_lh.getLocalLoginInfo() == null )
		{
			doAlert ( "로그인 되어 있지 않습니다!" , "계정삭제 오류!" , function () {} );
			location.href = "./index.html";
			return;
		}
		
		$("#btn-account-delete").on ( "click" , function ()
		{
			var ajaxParam = 
			{
				mid:g_lh.getLocalLoginInfo().id,
				block:true
			};
			
			$.ajax ({
				url:"http://teamsf.co.kr/~coms/member_block_modify.php",
				data:ajaxParam,
				dataType:"json",
				type:"post",
				success:function ( resultObj )
				{
					g_lh.flushLogin ();
					doAlert ( "계정이 삭제되었습니다." , "계정 삭제" , function () 
					{
						location.href="./index.html";
					});
				}
			});
		});
	});
}

function bindLogoutPage ()
{
	$(document).on("pagebeforeshow","#page-logout",function ()
	{
		if ( g_lh.getLocalLoginInfo() == null )
		{
			doAlert ( "로그인 되어 있지 않습니다!" , "로그아웃 오류!" , function () {} );
			location.href = "./index.html";
			return;
		}
		
		$("#btn-logout").on ( "click" , function ()
		{
			g_lh.flushLogin ();
			doAlert ( "성공적으로 로그아웃하였습니다!" , "로그아웃" , function () {} );
			location.href = "./index.html";
		});
	});
}

function bindAccountSettingPage ()
{
	// 계정 설정 페이지 initializations
	$(document).on("pagebeforeshow","#page-account-setting", function() 
	{
		if ( g_lh.getLocalLoginInfo () == null ) 
		{ 
			doAlert ( "로그인 되어 있지 않습니다!" , "계정 설정 오류!" , function () {} ); 
			location.href = "./index.html";
			return;
		}
		var id = g_lh.getLocalLoginInfo().id;
		loadPrevAccountSetting ( id );	
		
		// 프로필 이미지 설정 버튼 
		$("#btn-profile-register").on ( "click" , function ()
		{
			if ( g_isOpen == false )
			{
				g_isOpen = true;
				g_iu.selectImage ( function ( resultObj )
				{	
					if ( resultObj.success == false ) 
					{
						g_isOpen = false;
						return;
					}
					
					var imageUri = resultObj.imageUri;
					g_iu.uploadImage ( imageUri , function ( result )
					{
						g_isOpen = false;
						if ( result.success == false ) 
						{ 
							doAlert ( result.cause , "프로필 이미지 변경 오류!" , function () {} );
							return;
						}
		
						$("#profile-img").attr("src",result.img_full_path)
						.attr("imgid",result.image_id);
					});
				});
			}
		});
		
		// 계정 설정 변경완료 버튼 
		$("#btn-account-modify").on ( "click" , function ()
		{
			var memberId = g_lh.getLocalLoginInfo().id;
			var imgid = $("#profile-img").attr("imgid");
			var newPw = $("#edit-pw").val();
			var confirmPw = $("#edit-pw-confirm").val();
			var phoneNum = $("#phone1").val() + "-" + $("#phone2").val() + "-" + $("#phone3").val();
			var authCode = $("#edit-authcode").val();
			var zoneId = $("#zone-selector").val();
			
			if ( newPw.length != 0 )
			{
				if ( newPw != confirmPw ) { alert("두 패스워드를 확인하세요!"); return; }
			}
			
			if ( $("#phone2").val().length == 0 ) { phoneNum = ""; }
			//else if ( authCode.length == 0 ) { alert ( "인증번호를 입력하셔야 합니다!" ); return; }
			
			var ajaxParam = {
				mid:memberId,
				pw:newPw,
				zid:zoneId,
				imgid:imgid,
				phonenum:phoneNum,
				authcode:authCode
			};
			
			$.ajax ({
				url:"http://teamsf.co.kr/~coms/member_info_modify.php",
				data:ajaxParam,
				dataType:"json",
				type:"post",
				success:function ( resultObj )
				{
					if ( resultObj.success == true ) 
					{ 
						if ( resultObj.pw_changed == true )
						{
							g_lh.flushLogin ();
							g_lh.setId ( resultObj.email ); g_lh.setPw ( newPw );
							g_lh.doLogin ( function ( loginResult )
							{
								alert("정보 변경 성공!");
								location.href="./index.html";
							});
						}
						else
						{
							alert("정보 변경 성공!");
							location.href="./index.html";
						}
					}
					else { alert ( "변경 실패! : " + resultObj.cause ); }
				}
			});
		});
	});	
}

function loadPrevAccountSetting ( id )
{	
	$.ajax ({
		url:"http://teamsf.co.kr/~coms/zone_list_show.php",
		type:"post",
		dataType:"json",
		success:function ( zoneListArr )
		{
			var zoneExpr = "";
			var i;
			for ( i = 0 ; i < zoneListArr.length ; i++ )
			{
				var zoneObj = zoneListArr[i];
				zoneExpr += "<option value=\"" + zoneObj.id + "\">" + zoneObj.name + "</option>";
			}
			$("#zone-selector").html(zoneExpr);
			
			var param = {mid:id};
			$.ajax ({
				url:"http://teamsf.co.kr/~coms/member_mycoms_info.php",
				type:"post",
				dataType:"json",
				data:param,
				success:function ( resultObj )
				{
					$("#profile-img").attr("src",resultObj.profile_img_path)
									.attr("imgid",resultObj.profile_img_id);
					$("#account-customer-name").html ( resultObj.name );
					$("#account-customer-email").html ( resultObj.email );
					$("#zone-selector").val(resultObj.zone_id);
					$("#zone-selector").selectmenu("refresh");
				}
			});
		}
	});
}