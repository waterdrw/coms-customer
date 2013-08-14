$(document).ready(function(){
    var lh = new LoginHandler ();
    var userData = lh.getLocalLoginInfo();

    console.log(userData);

	var myScroll;
	var currentShop;

	var url = "http://teamsf.co.kr/~coms/shop_list_show.php";
	var url2 = "http://teamsf.co.kr/~coms/site_list_show.php";
	
	var list_start = 0;
	var list_end = 30;
	var zid = 1;
	var params;
	var s_params = {type:"street"};
	var store_type = "null";
	var combo_list = new Array();

	if (lh.isLogged() == true) {
		params = {start:list_start, end:list_end, zid:zid, mid:userData.id};
	}

	else {
		params = {start:list_start, end:list_end, zid:zid};
	}

	$.ajax({
		type: 'post',
		dataType: 'json',
		url: url2,
		data: s_params		
	}).done(function(data){
		console.log(data);
		var temp = "";
		for(var i in data) {
			temp += "<li data-icon='false'><a>"+data[i].name+"</a></li>";		

		}
		$("#list-street").append(temp).listview("refresh");
	});

	$.ajax({
		type: 'post',
		dataType: 'json',
		url: url,
		data: params		
	}).done(function(data){
	    var str = "";

	    for(var i in data.list) {
   	    	var temp = data.list[i];
   	    	console.log(temp);
   	    	combo_list[i] = temp.member_combo;

			str += "<div class='list-shop'><a class='a-shop-detail' href='./shop.html?shopId="+temp.id+"' rel='external'>";
			str += "<div class='row'>";
			str += "<div class='span shop-info'>";
			str += "<img src='"+temp.profile_img_path+"'>";
			str += "<p>"+temp.name+"</p>";
			str += "<p>위치 : "+temp.location+"</p>";
			str += "<p></p>";
			str += "</div>";
			str += "<div class='span combo-timer'>";
			//str += "<i class='icon-time'></i>";
			str += "<p>콤보타임</p>";
			str += "<hr>";
			str += "<p><i class='icon-time'></i> -"+temp.combo_left_day+"일</p>";
			str += "</div>";
			str += "</div>";
			str += "<div class='row'>";
			str += "<hr class='list-divider'>";
			str += "<div class='span header-combo'>콤보할인</div>";
			str += "<div class='span combo-progress with-line'>";
			str += "<div class='combo-box'><i class='icon-heart'></i><span class='combo-text'>"+temp.combo_1+"%</span></div>";
			str += "<div class='combo-box'><i class='icon-heart '></i><span class='combo-text'>"+temp.combo_2+"%</span></div>";
			str += "<div class='combo-box'><i class='icon-heart '></i><span class='combo-text'>"+temp.combo_3+"%</span></div>";
			str += "<div class='combo-box'><i class='icon-heart '></i><span class='combo-text'>"+temp.combo_4+"%</span></div>";
			str += "<div class='combo-box'><i class='icon-gift '></i><span class='combo-text'>"+temp.combo_5+"%</span></div>";
			str += "</div>";
			str += "</div>";                 
			str += "</a></div>";
	    }

		$('#scroller').append(str);

		// display combo progress
		for (var i in combo_list){
			var temp = parseInt(i)+1;
			console.log(temp+" : "+combo_list[i]);
			$('.list-shop:nth-child('+temp+') .combo-box:nth-child('+(combo_list[i])+')').addClass('active');
		}
	    myScroll = new IScroll('#wrapper', { scrollbars: true, mouseWheel: true, interactiveScrollbars: true, click:true });

		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	});
	
})