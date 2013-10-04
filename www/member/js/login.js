
var g_lh = null;

function initAll ()
{
	g_lh = new LoginHandler ();
	initLoginPage ();
	initLostFoundPage ();
}

function initLoginPage ()
{
	$("#page-login" ). on ( "pagebeforeshow" , function ()
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
	            	alert(resultObj.cause);
	            }
	        });
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