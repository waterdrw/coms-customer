$(document).ready(function(){
    var lh = new LoginHandler ();
    var userData = lh.getLocalLoginInfo();
    var compon_list = new Array();

    console.log(userData);

    var url = "http://teamsf.co.kr/~coms/shop_compon_list_show.php";
    var sId = $.getUrlVar("shopId");

    var params = {sid:sId, mid:userData.id};
    
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: params        
    }).done(function(compons){
        console.log(compons);
        compon_list = compons;

        for (var i in compons) {
            var compon = compons[i];
            var temp = parseInt(i)+1;
            $('#compon'+temp).html(compon.price);
        }

        $('.banner-coupon:nth-child(1)').tap();

        myScroll = new IScroll('#wrapper', { scrollbars: true, mouseWheel: true, interactiveScrollbars: true, click:true });

        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    });

    $('.banner-coupon').on('tap',function(e){
        e.preventDefault();
        e.stopImmediatePropagation();

        var index = $(this).attr('value');
        var compon = compon_list[index];
        
        for (var i in compon_list) {
            var temp = parseInt(i);
            $('.banner-coupon:nth-child('+temp+')').removeClass('active');
        }

        var combo = compon.combo_count;
        $('#shop-name').html(compon.shop_name);
        $('#compon-price').html(compon.price);
        $('#limit-date').html(compon.limit_date);

        $('#combo').html(compon.combo_count);
        $('#discount').html(compon.discount_rate);
        $('#buy-discount-price').html(compon.discount_price*10000);
        $('#buy-price').html(compon.price*10000);

        $('#compon-num').val(parseInt(index)+1);
        
        $(this).addClass('active');


        console.log(compon_list[i]);
    });
    $('#btn-phone').click(function(){
        var itemId = $('#compon-num').val();
        window.location = "./buy_result.html?shopId="+sId+"&itemId="+itemId;
    });
    $('#btn-credit').click(function(){
        var itemId = $('#compon-num').val();
        window.location = "./buy_result.html?shopId="+sId+"&itemId="+itemId;
    });

})