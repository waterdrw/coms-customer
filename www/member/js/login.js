
var g_lh = null;

function initAll ()
{
	g_lh = new LoginHandler ();
	initLoginPage ();
	initLostFoundPage ();
}

function doAlert ( msg , title , callbackFunction )
{
	navigator.notification.alert ( msg , callbackFunction , title , "확인" );
}

function initLoginPage ()
{
	$("#btn-login").click ( function ()
	{
        var email = $("#usr-email").val();
        var pwd = $("#usr-passwd").val();

        g_lh.setId(email); g_lh.setPw(pwd);
        g_lh.doLogin ( function ( resultObj )
        {
            if ( resultObj.success == true ) 
            { 
                history.back();
            }
            else 
            {
            	doAlert ( resultObj.cause , "로그인 오류" , function (){} );
            }
        });
    });
}

function initLostFoundPage ()
{
	$("#page-lost-found-id").on ( "pagebeforeshow" , function ()
	{
		
	});
	
	$("#page-lost-found-pw").on ( "pagebeforeshow" , function ()
	{
				
	});
}

function initPhonegap ()
{
	document.addEventListener("deviceready", initAll , false);	
}