var firebaseConfig = {
	apiKey: "AIzaSyCDzwv3_e8alepAAkHmGbjT6f3VXEO1ruk",
	authDomain: "icebrickhunt.firebaseapp.com",
	databaseURL: "https://icebrickhunt.firebaseio.com",
	projectId: "icebrickhunt",
	storageBucket: "icebrickhunt.appspot.com",
	messagingSenderId: "859695415101",
	appId: "1:859695415101:web:3a492972a0e384d73d0f54"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.database();
var st = firebase.storage();

firebase.auth().onAuthStateChanged((user) => {
	if(user){
		$("#login").hide();
		db.ref("/users/").once("value")
		.then((d) => {
			if(d.exists()){
				var data = d.val();
				var uids = Object.keys(data);
				var qs = {
					q1: "",
					q2: "",
					q3: "",
					q4: "",
					q5: "",
					q6: "",
					q7: "",
					q8: ""
				};
				var qsDone = [0, 0, 0, 0, 0, 0, 0, 0, 0];
				var allDone = 0;

				uids.forEach(uid => {
					if(!("HealingMochi" in data[uid])) return;
					var content = data[uid]["HealingMochi"];
					var flag = true;
					for(var i = 1; i <= 8; i++){
						if(!(("q" + i) in content)){
							flag = false;
							continue;
						}
						if(!(content["q" + i].accept)) continue;
						qs["q" + i] += "\
						<div class='q'>\
						Date: " + content["q" + i].date + "<br>\
						UID: " + uid + "<br>"
						+ fillContent(i, content["q" + i].seq, uid)
						+ "</div>";
						qsDone[i]++;
					}
					if(flag) allDone++;
				});

				var footer_text = "";
				for(var i = 1; i <= 8; i++){
					var idx = "q" + i;
					$("#" + idx).html(qs[idx]);
					footer_text += idx + ": " + qsDone[i] + " / ";
				}

				footer_text += "全部完成: " + allDone;
				$("#foot").text(footer_text);
			}
		})
		.catch((err) => {
			window.alert('登入錯誤');
			firebase.auth().signOut();
			console.log(err.code + ": " + err.message);
		});
	}
	else{
		$("#login").show();
	}
});

function fillContent(idx, seq, uid){
	var result = "";
	switch(idx){
	case 1:
		result = "\
		今天我關掉所有手機、電腦的干擾，試著靜下心來，運用視覺、味覺、觸覺、嗅覺、聽覺來品嚐食物，其中...我品嚐到的味道是" + seq.seq0 + "<br>\
		身體感受到" + seq.seq1 + "<br>\
		我的心情是" + seq.seq2 + "<br>\
		";
		return result;
	case 2:
		result = "\
		我上一次自在、盡情大笑的時候是" + seq.seq0 + "，<br>\
		讓我有這種感覺是因為" + seq.seq1 + "<br>\
		我還能嘗試" + seq.seq2 + "，讓生活多一些這種時刻\
		";
		return result;
	case 3:
		result = "\
		我與" + seq.seq0 + "一起" + seq.seq1 + "，<br>\
		我感覺" + seq.seq2 + "<br>\
		如果可以的話，我想嘗試" + seq.seq3 + "，讓我們關係可以維持或更靠近。\
		";
		return result;
	case 4:
		result = "\
		我看到什麼樣的景色？<br>\
		我感覺" + seq.seq0 + "<br>\
		此刻這個景色對我來說有什麼意義？<br>" + seq.seq1 + "<br>\
		如果可以的話，我想要在這裡做什麼？" + seq.seq2 + "<br>\
		";
		return result;
	case 5:
		result = "\
		我幫忙" + seq.seq0 + "做了" + seq.seq1 + "<br>\
		我感覺" + seq.seq2 + "<br>\
		我還想要再嘗試" + seq.seq3 + "<br>\
		";
		return result;
	case 6:
		result = "\
		我想感謝" + seq.seq0 + "，<br>\
		因為" + seq.seq1 + "<br>\
		我想說" + seq.seq2 + "<br>\
		";
		return result;
	case 7:
		result = "\
		我做了" + seq.seq0 + "讓身體變得健康的運動<br>\
		運動過後，我的身體/心理/心情有什麼變化？<br>" + seq.seq1 + "<br>\
		如果可以的話，我想再嘗試" + seq.seq2 + "<br>\
		";
		return result;
	case 8:
		result = "\
		我因為" + seq.seq0 + "感覺到有些壓力，還有一些" + seq.seq1 + "的感覺<br>\
		我做了" + seq.seq2 + "來讓自己放鬆/靜下來<br>\
		我感覺" + seq.seq3 + "<br>\
		";
		return result;
	}
}

function download_img(target, uid){
	return new Promise((resolve, reject) => {
		st.ref().child("users/" + uid + "/HealingMochi/" + target).listAll()
		.then((res) => {
			res.items.forEach((i) => {
				i.getDownloadURL().then((url) => {
					resolve(url);
				})
				.catch((err) => {
					console.log(err.code + ": " + err.message);
					reject("Failed");
				});
			});
		})
		.catch((err) => {
			console.log(err.code + ": " + err.message);
			reject("Failed");
		});
	});
}

function login(){
	var email = $("#account").val(), password = $("#pwd").val();
	firebase.auth().signInWithEmailAndPassword(email, password)
	.catch((err) => {
		if(err.code == "auth/invalid-email") window.alert("email格式錯誤");
		else if(err.code == "auth/user-not-found") window.alert("你還沒創建帳號喔！");
		else if(err.code == "auth/wrong-password") window.alert("密碼錯誤");
		else if(err.code == "auth/network-request-failed") window.alert("網路錯誤");
		else window.alert('登入或是創建帳號時資料發生錯誤，請聯絡工作人員，或是使用 "遊戲發生問題嗎？請點我"');
		console.log(err.code + ": " + err.message);
	});
}

function changeState(){
	var new_state = $("#selectQ").val();
	console.log("change to " + new_state);
	for(var i = 1; i <= 8; i++) $("#q" + i).hide();
	$("#q" + new_state).show();
}