$(document).ready(function(){
    var lh = new LoginHandler ();
    lh.flushLogin ();

    $('#btn-register').on('click', function(){

        var url = "http://teamsf.co.kr/~coms/member_join.php";
        var params = {
            email:$('#email').val(),
            name:$('#name').val(),            
            phone:$('#phone1').val()+"-"+$('#phone2').val()+"-"+$('#phone3').val(),
            nick:$('#nickname').val(),
            pw:$('#pw').val(),
            zid:0 };

        console.log(params);


        $.ajax({
            type: 'post',
            dataType: 'json',
            url: url,
            data: params        
        }).done(function(data){
            console.log(data);
            alert("회원 등록이 완료 되었습니다.");
        });
    });


})