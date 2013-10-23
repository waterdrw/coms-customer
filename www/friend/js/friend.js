
var myScroll;
var g_isOpen = false;

// Page Entry Point
function initAll ()
{
	myScroll = new IScroll('#wrapper', { scrollbars: true, mouseWheel: true, interactiveScrollbars: true, click:true });
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	
	bindBackButton ();
}

function bindBackButton ()
{
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

function initPhoneGap () 
{
	document.addEventListener ( "deviceready", initAll , false );
}