function open_blocker(flag = false){
	$("#next").hide();
	$("#prev").hide();
	if(flag) $("#blocker").addClass("black").show();
	$("#blocker").show();
}

function close_blocker(flag = false){
	if(flag) $("#blocker").removeClass("black").hide();
	$("#blocker").hide();
	if(now_page < total_page && information.state == "user") $("#next").show();
	if(now_page > 2 && information.state == "user") $("#prev").show();
}

function page(from, to){
	if(from < to){
		var p = pages.eq(-from);
		p.addClass("page_shadow page_down");
		from += 1;
	}
	else{
		from -= 1;
		var p = pages.eq(-from);
		p.removeClass("page_down");
		setTimeout(function(){
			p.removeClass("page_shadow");
		}, 300);
	}

	if(from != to){
		setTimeout(function(){
			page(from, to);
		}, 100);
	}
	else{
		now_page = to;
		setTimeout(function(){
			close_blocker();
		}, 500);
	}
}

function goto_page(idx){
	open_blocker();
	page(now_page, idx);
}

function obj_len(obj){
	var L = 0;
    $.each(obj, function(i, elem) {
        L++;
    });
	return L;
}

function readURL(input){
	if(input.files && input.files[0]){
		var regex = /^.+\.(jpe?g|png)$/;
		if(!regex.test(input.files[0]["name"])){
			window.alert("上傳格式錯誤，請上傳圖片檔案");
			return;
		}
		var reader = new FileReader();
		reader.onload = function (e) {
			$(input).next().attr('src', e.target.result);
		}
		reader.readAsDataURL(input.files[0]);
		var target = input.id[3];
		target = parseInt(target, 10);
		content[target].img["img0"] = input.files[0];
	}
}