var g_iu = null;
var g_isOpen = false;

function initAll ()
{
    var lh = new LoginHandler ();
    lh.flushLogin ();
    
    g_iu = new ImageUploader ();
    g_iu.setNavigatorObj ( navigator );
    
    
    $("#img-profile").attr("imgid",0);
    
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
    
    $("#btn-register").on("click", function()
    {
        var url = "http://teamsf.co.kr/~coms/member_join.php";
        var params = 
        {
            email:$('#email').val(),
            name:$('#name').val(),            
            phone:$('#phone1').val()+"-"+$('#phone2').val()+"-"+$('#phone3').val(),
            nick:$('#nickname').val(),
            pw:$('#pw').val(),
            zid:1,
            pimgid:$("#img-profile").attr("imgid")
        };
        
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: url,
            data: params        
        }).done(function(data){
            console.log(data);
            alert("회원 등록이 완료 되었습니다.");
            window.location="../mycoms/index.html";
        });
    });
}

function initPhonegap () 
{
	document.addEventListener("deviceready", initAll , false);
}