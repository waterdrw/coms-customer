$(document).ready(function(){
    var lh = new LoginHandler ();
    var userData = lh.getLocalLoginInfo();

    console.log(userData);

    var url = "http://teamsf.co.kr/~coms/member_compon_purchase.php";
    var sId = $.getUrlVar("shopId");
    var itemId = $.getUrlVar("itemId");

    var params = {sid:sId, mid:userData.id, item:itemId};

    $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: params        
    }).done(function(data){
        console.log(data);
        $('#shop-name').html(data.shop_name);
        $('#limit-date').html(data.limit_date);
        $('#left-date').html(data.combo_left_day);
        //$('#compon-num').html(data.compon_num);
        $('#shop-img').attr('src', data.shop_profile_img_path);
        $('#buy-price').html(data.price*10000);
        $('#buy-discount-price').html(data.price*10000-data.discount_price*10000);
        
        $('#pid').val(data.purchase_id);
                


        //myScroll = new IScroll('#wrapper', { scrollbars: true, mouseWheel: true, interactiveScrollbars: true, click:true });

        //document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    });

    $('#btn-use').on('click tap', function(){

        var url = "http://teamsf.co.kr/~coms/member_compon_use.php";
        var pid = $('#pid').val();
        
        var params = {pid:pid}
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: url,
            data: params        
        }).done(function(data){
            
            window.location.replace("../mycoms/used_compon.html");
            
        });
    });
    $('#btn-unuse').on('click tap', function(){
        
        window.location.replace("../mycoms/compon.html");     
    });

})