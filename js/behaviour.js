$(document).ready(function(){
	vue_init();

	pages = $(".page");
	total_page = pages.length;
	open_blocker();

	$("#next").click(function(){goto_page(now_page+1);});
	$("#prev").click(function(){goto_page(now_page-1);});
	$(".cancel").click(function(){
		var k = $(this).parent().find("#infor-content");
		if(k[0]) k.scrollTop(0);
		$(this).parent().hide("fade");
		close_blocker(true);
	});
	$(".upload-btn").click(function(){$(this).next().click();});
	$("input[type='file']").change(function(){readURL(this);});
	$(".goback").click(function(){goto_page(2);});

	window.onload = () => {database_init();}
});