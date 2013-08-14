$(document).ready(function(){
    var lh = new LoginHandler ();
    var userData = lh.getLocalLoginInfo();
    var pid = $.getUrlVar('cId');

    var url = "http://teamsf.co.kr/~coms/member_compon_detail_show.php";

    var params = {pid:pid};

    $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: params        
    }).done(function(data){
        console.log(data);
        
        $('.name').html(data.shop_name);
        $('.price').html(data.price+"원권");
        $('.limit-date').html(data.limit_date+"까지");
        $('.icon-time').html(" "+data.combo_left_day+"일");
        $('.compon-code').html("콤폰번호 : "+data.compon_code);
        $('.img').attr('src', data.shop_profile_img_path);


        myScroll = new IScroll('#wrapper', { scrollbars: true, mouseWheel: true, interactiveScrollbars: true, click:true });
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    });

    $('#btn-use').on('click', function(){

        var url = "http://teamsf.co.kr/~coms/member_compon_use.php";
        var params = {pid:pid}
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: url,
            data: params        
        }).done(function(data){
            alert("사용신청이 완료되었습니다.");
        });
    });

    
    

})