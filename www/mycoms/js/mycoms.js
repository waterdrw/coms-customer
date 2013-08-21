$(document).ready(function(){
    var lh = new LoginHandler ();
    var userData = lh.getLocalLoginInfo();

    lh.doLogin ( function ( resultObj ) {
        if ( resultObj.success == false ) { 
            window.location = "../member/index.html";
        }
    });


    console.log(userData);

    var url = "http://teamsf.co.kr/~coms/member_mycoms_info.php";

    var params = {mid:userData.id};

    $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: params        
    }).done(function(data){
        console.log(data);
        $('#giving1').html(data.giving_1.giving_count);
        $('#giving2').html(data.giving_2.giving_count);
        $('#giving3').html(data.giving_3.giving_count);
        $('#giving4').html(data.giving_4.giving_count);
      
        $('#profile').attr('src', data.profile_img_path);  
        $('#grade').html(data.grade_name);  
        $('.member-name').html(data.name);
        $('#zone-name').html(data.zone_name);
        $('#heart-cash').html(data.heart_cash);
      
        $('#compon-num').html(data.unused_compon_count);


        myScroll = new IScroll('#wrapper', { scrollbars: true, mouseWheel: true, interactiveScrollbars: true, click:true });

        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    });



})