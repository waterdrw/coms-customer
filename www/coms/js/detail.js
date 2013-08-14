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

        $('.currentCombo').html(currentShop.member_combo);
        $('#left-comboday').html(currentShop.combo_left_day);

        $('#title').html(currentShop.name);
        $('#tag-phone').attr('href', 'tel:'+currentShop.phone);
        $('.combo-box:nth-child('+parseInt(currentShop.member_combo)+')').addClass('active');

        myScroll = new IScroll('#wrapper', { scrollbars: true, mouseWheel: true, interactiveScrollbars: true, click:true });

        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    });


    $('#btn-buy').click(function(){

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



})