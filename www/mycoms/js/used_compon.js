$(document).ready(function(){
    var lh = new LoginHandler ();
    var userData = lh.getLocalLoginInfo();

    console.log(userData);

    var url = "http://teamsf.co.kr/~coms/member_compon_list_show.php";

    var params = {mid:userData.id, used:true};

    $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: params        
    }).done(function(data){
        console.log(data);
        
        var compons_html = "<div class='area-padding'>";

        for(var i in data) {

            if (data[i].ok_date == null) {data[i].ok_date = "승인 대기 중"};

            compons_html += "<div class='list-mycompon used-compon' value='"+data[i].id+"'><div class='list-inner'>";
            compons_html += "<img class='img' src='"+data[i].shop_profile_img_path+"'>";
            compons_html += "<p class='name'>"+data[i].shop_name+" ["+data[i].ok_date+"] "+"</p>";
            compons_html += "<p class='price'>"+data[i].price*1000+" 원 이상 이용시 "+(data[i].price*1000 - data[i].discount_price*1000)+" 원 할인권";            
            compons_html += "</p>";
            compons_html += "<p class='limit-date'>"+data[i].limit_date+" 까지";
            compons_html += "</p>";
            compons_html += "<p class='foo'><span class='combo-left used-compon'><i class='icon-time'></i> "+data[i].combo_left_day+"일</span><span class='compon-code'>콤폰번호 : "+data[i].coupon_code+"</span>";
            compons_html += "</p>";            
            compons_html += "</div></div>";
        }
        compons_html += "</div>";

        $('#container').html(compons_html);
        myScroll = new IScroll('#wrapper', { scrollbars: true, mouseWheel: true, interactiveScrollbars: true, click:true });
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

        $('.list-mycompon').on('click tap', function(){
            var cId = $(this).attr('value');

            console.log(cId);

            window.location = "./detail_used_compon.html?cId="+cId;
            
        })

    });
    
    

})