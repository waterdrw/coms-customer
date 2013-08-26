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
<<<<<<< HEAD
        url:'http://teamsf.co.kr/~coms/site_list_show.php',
        data: {type:"campus"}      
    }).done(function(data)
    {
=======
        url: url2,
        data: s_params      
    }).done(function(data){
        alert(data);
>>>>>>> 426fe2501a514471309f2c18825aa27b04769c25
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
            zid:$("#select-comszone").val(),
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