$(document).ready(function(){
    var lh = new LoginHandler ();


    $('#btn-login').click(function(){
        var email = $('#usr-email').val();
        var pwd = $('#usr-passwd').val();

        console.log(email+":"+pwd);

        lh.setId(email);
        lh.setPw(pwd);

        lh.doLogin ( function ( resultObj )
        {
            if ( resultObj.success == true ) { 
                history.back();
            }
            else {
                alert(resultObj.cause);
            }
        });

    });



})