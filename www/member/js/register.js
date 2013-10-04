var g_iu = null;
var g_isOpen = false;

function initAll ()
{
    var lh = new LoginHandler ();
    var comszone_url = "http://teamsf.co.kr/~coms/site_list_show.php";

    lh.flushLogin ();
    
    g_iu = new ImageUploader ();
    g_iu.setNavigatorObj ( navigator );
        
    $("#img-profile").attr("imgid",0);
    
    $.ajax({
        type: 'post',
        dataType: 'json',
        url:'http://teamsf.co.kr/~coms/site_list_show.php',
        data: {type:"campus"}      
    }).done(function(data)
    {
        var temp = "";
        for(var i in data) 
        {
            temp += "<option value='"+data[i].id+"'>"+data[i].name+"</option>";       
        }
        $("#select-comszone").append(temp).selectmenu("refresh", true);
    });

    $("#btn-img-modify").on ( "click" , function ()
    {
    	if ( g_isOpen == false )
		{
			g_isOpen = true;
			g_iu.selectImage ( function ( resultObj )
			{
				if ( resultObj.success == false ) { g_isOpen=false; return; }
				
				var imageUri = resultObj.imageUri;
				g_iu.uploadImage ( imageUri , function ( result )
				{
					g_isOpen = false;
					if ( result.success == false ) 
					{ 
						alert ( "프로필 이미지 업로드 실패 : " + result.cause );
						return;
					}
					
					$("#img-profile").attr("src",result.img_full_path)
					.attr("imgid",result.image_id);
				});
			});
		}
    });
    
    $("#btn-register-default").on("click",function()
    {  	
    	var pw = $("#pw").val(); var pwConfirm = $("#pw-re").val();
    	var email = $("#email").val(); var name = $("#name").val();
    	var phone1 = $("#phone1").val(); var phone2=$("#phone2").val();
    	var phone3 = $("#phone3").val();
    	
    	if ( pw.length == 0 ) { alert("패스워드를 입력하세요!"); return; }
    	if ( pw != pwConfirm ) { alert("패스워드가 서로 다릅니다!"); return; }
    	if ( email.length == 0 ) { alert("이메일 아이디를 입력하세요!"); return; }
    	if ( name.length == 0 ) { alert("이름을 입력하세요!"); return; }
    	if ( phone1.length == 0 || phone2.length == 0 || phone3.length == 0 ) 
    	{
    		alert ( "휴대폰 번호를 입력하세요!" ); return; 
    	}
    	
    	$.ajax ({
    		type:"post",
            dataType:"json",
            url: "http://teamsf.co.kr/~coms/member_join_email_check.php",
            data: {email:email},
            success:function ( resultObj )
            {
            	if ( resultObj.success == true ) { $.mobile.changePage("#register2"); }
            	else { alert ( "에러 : 중복되는 이메일입니다." ); }
            }
    	});
    });
    
    $("#btn-register").on("click", function()
    {
    	var nick = $("#nickname").val();
    	var imgid = $("#img-profile").attr("imgid");
    	var zoneId = $("#select-comszone").val();
    	
    	if ( zoneId == null ) { alert("콤스존을 선택해 주세요!"); return; }
    	//if ( nick.length == 0 ) { alert("콤스 닉네임을 입력하세요!"); return; }
    	//if ( parseInt(imgid) == 0 ) { alert("프로실 사진을 선택하세요!"); return; }
    	
        var url = "http://teamsf.co.kr/~coms/member_join.php";
        var params = 
        {
            email:$('#email').val(),
            name:$('#name').val(),            
            phone:$('#phone1').val()+"-"+$('#phone2').val()+"-"+$('#phone3').val(),
            nick:$('#nickname').val(),
            pw:$('#pw').val(),
            zid:$("#select-comszone").val(),
            pimgid:$("#img-profile").attr("imgid")
        };
        
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: url,
            data: params        
        }).done(function(data){
            if ( data.success == true )
            {
            	alert("회원 등록이 완료 되었습니다.");
            	window.location="../mycoms/index.html";
            }
            else { alert ( "에러 : " + data.cause ); }
        });
    });
}

function initPhonegap () 
{
	document.addEventListener("deviceready", initAll , false);
}