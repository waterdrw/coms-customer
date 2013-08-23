var current;


$( document ).on( "mobileinit", function() {
  $.mobile.loader.prototype.options.text = "loading...";
  $.mobile.loader.prototype.options.textVisible = true;
  $.mobile.loader.prototype.options.theme = "a";
  $.mobile.loading( 'show');

});

$(document).ready(function(){

    var lh = new LoginHandler ();
    var userData = lh.getLocalLoginInfo();

    var url = "http://teamsf.co.kr/~coms/shop_detail_show.php";
    var sId = $.getUrlVar("shopId");
    var params;
    
    
    if (lh.isLogged() == true) {
        params  = {sid:sId, mid:userData.id};
    }

    else {
        params = {sid:sId};
    }

    
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: params        
    }).done(function(currentShop){
        console.log(currentShop);
        current = currentShop;

        var openTime = currentShop.start_time + " ~ " + currentShop.end_time;

        $('#name').html(currentShop.name);
        $('#location').html(currentShop.location);
        $('#time').html(openTime);
        $('#closed').html(currentShop.closed);
        $('#phone').html(currentShop.phone);
        $('#profile-img').attr('src', currentShop.profile_img_path);

        $('#combo1').html(currentShop.combo_1);
        $('#combo2').html(currentShop.combo_2);
        $('#combo3').html(currentShop.combo_3);
        $('#combo4').html(currentShop.combo_4);
        $('#combo5').html(currentShop.combo_5);

        $('.currentCombo').html(currentShop.member_combo-1);
        $('.currentCombo2').html(currentShop.member_combo);
        $('#left-comboday').html(currentShop.combo_left_day);

        $('#title').html(currentShop.name);
        $('#tag-phone').attr('href', 'tel:'+currentShop.phone);
        $('.combo-box:nth-child('+parseInt(currentShop.member_combo)+')').addClass('active');

        myScroll = new IScroll('#wrapper', { scrollbars: true, mouseWheel: true, interactiveScrollbars: true, click:true });

        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    });

    $('#btn-buy').on('tap', function(){

        lh.doLogin ( function ( resultObj )
        {
            if ( resultObj.success == true ) { 
                window.location = "./buy.html?shopId="+sId;
            }
            else {
                window.location = "../member/index.html";
            }
        });

    });

    
    $( "#page-location" ).on( "pagecreate", function( event ) {
        //console.log(current);
        $.mobile.loading( 'show');
        var lat = current.latitude;
        var lng = current.longitude;
          
        var latlng = new google.maps.LatLng (lat, lng);
        var options = { 
            zoom : 15, 
            center : latlng, 
            mapTypeId : google.maps.MapTypeId.ROADMAP 
        };
    
        var $content = $("#page-location div:jqmData(role=content)");
        $content.height (screen.height-60);
        var map = new google.maps.Map ($content[0], options);
          //$.mobile.changePage ($("#win2"));
          
        new google.maps.Marker ( 
        { 
          map : map, 
          animation : google.maps.Animation.DROP,
          position : latlng  
        });  

        $('#l-title').html(current.name);
        $.mobile.loading( 'hide');
    });

    $( "#page-menu" ).on( "pagecreate", function( event ) {
        //console.log(current);
        $('#m-title').html(current.name);
        $('#img-menu').attr({'src':current.menu_img_path, 'width':'100%'});

    });


    $.mobile.loading( "hide" );
})