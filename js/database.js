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
db = firebase.database();
st = firebase.storage();

function database_init(){
	firebase.auth().onAuthStateChanged((user) => {
		if(user){
			loginUser = user;
			db_email = loginUser.email;
			db.ref("/users/" + loginUser.uid).once("value")
			.then((d) => {
				if(d.exists()){
					db_type = d.child("type").val();
					db_account = d.child("account").val();
					if(d.child("HealingMochi").exists()){
						db_data = d.child("HealingMochi").val();
						for(var i = 1; i <= 8; i++){
							if(db_data["q" + i]){
								content[i].seq = db_data["q" + i].seq;
								content[i].date = db_data["q" + i].date;
								content[i].flag = true;
								var l = $("#q" + i).find(".finish");
								l.addClass("complete");
								l.children("div").text("衛教小語");
								$(".list-column").eq(i).addClass("complete");
							}
						}
						console.log(db_data);
						download_img("q1");
						download_img("q4");
						if(obj_len(db_data) == 8){
							$("#end").addClass("page");
							$("#form-link-column").show();
							pages = $(".page");
							total_page = pages.length;
						}
						else{
							$("#end").removeClass("page");
							$("#form-link-column").hide();
							pages = $(".page");
							total_page = pages.length;
						}
					}
				}
				else{
					db.ref("/users/" + loginUser.uid).set({
						type: db_type,
						account: db_account
					});
				}
				information.state = "user";
				information.type = db_type;
				information.account = db_account;
				information.email = db_email;
				goto_page(2);
			})
			.catch((err) => {
				window.alert('登入或是創建帳號時資料發生錯誤，請聯絡工作人員');
				firebase.auth().signOut();
				console.log(err.code + ": " + err.message);
			});
		}
		else{
			goto_page(3);
		}
		$("#loading").hide();
	});
}

function login(email, password){
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

function makeAccount(type, account, email, password){
	firebase.auth().createUserWithEmailAndPassword(email, password)
	.then(() => {
		db_account = account;
		db_type = type;
	})
	.catch((err) => {
		console.log(err.code + ": " + err.message);
		if(err.code == "auth/email-already-in-use") window.alert("email已經被使用過了，請改用其他email");
		else if(err.code == "auth/invalid-email") window.alert("email格式錯誤");
		else if(err.code == "auth/weak-password") window.alert("密碼強度太弱了，建議換其他密碼喔！");
		else window.alert('創建帳號時資料發生錯誤，請聯絡工作人員，或是使用 "遊戲發生問題嗎？請點我"');
	});
}

function forgot_pwd(email){
	var result = true;
	if(email == "") window.alert("請先填入遊戲使用的信箱，密碼重置連結會送至此信箱");
	else{
		firebase.auth().sendPasswordResetEmail(email)
		.then(() => {
			window.alert("密碼重置連結已送至你的信箱，請至信箱更改新密碼");
		})
		.catch((err) => {
			if(err.code == "auth/invalid-email") window.alert("email格式錯誤");
			else if(err.code == "auth/user-not-found") window.alert("無此信箱紀錄");
			else window.alert('登入或是創建帳號時資料發生錯誤，請聯絡工作人員，或是使用 "遊戲發生問題嗎？請點我"');
			console.log(err.code + ": " + err.message);
			result = false;
		});
	}
	
	return result;
}

function logout(){
	firebase.auth().signOut()
	.then(() => {
		information.state = "login";
		information.type = "student";
		information.account = "";
		information.email = "";
		information.password = "";
	})
	.catch((err) => {
		window.alert('出現問題，請聯絡遊戲工作人員，或是使用 "遊戲發生問題嗎？請點我"');
		console.log(err.code + ": " + err.message);
	});
}

function change_information(new_account, new_email, new_password){
	var result = true;
	if(new_account != ""){
		db.ref("/users/" + loginUser.uid + "/account").set(new_account)
		.then(() => {
			window.alert("帳號更改成功！");
			db_account = new_account;
		})
		.catch(() => {
			window.alert('出現問題，請聯絡遊戲工作人員，或是使用 "關於遊戲" 頁面的 "遊戲發生問題嗎？請點我"');
			result = false;
		});
	}

	if(new_email != ""){
		loginUser.updateEmail(new_email)
		.then(() => {
			window.alert("email更改成功！");
			db_email = new_email;
		})
		.catch((err) => {
			if(err.code == "auth/email-already-in-use") window.alert("email已經被使用過了，請改用其他email");
			else if(err.code == "auth/invalid-email") window.alert("email格式錯誤");
			else if(err.code == "auth/requires-recent-login"){
				window.alert("需要重新登入，請跳轉至登入頁面後重新登入後，再修改密碼。");
				logout();
			}
			else window.alert('出現問題，請聯絡遊戲工作人員，或是使用 "關於遊戲" 頁面的 "遊戲發生問題嗎？請點我"');
			console.log(err.code + ": " + err.message);
			result = false;
		});
	}

	if(new_password != ""){
		loginUser.updatePassword(new_password)
		.then(() => {
			window.alert("密碼更改成功！");
		})
		.catch((err) => {
			if(err.code == "auth/weak-password") window.alert("密碼強度太弱了，建議換其他密碼喔！");
			else if(err.code == "auth/requires-recent-login"){
				window.alert("需要重新登入，請跳轉至登入頁面後重新登入後，再修改密碼。");
				logout();
			}
			else window.alert('出現問題，請聯絡遊戲工作人員，或是使用 "關於遊戲" 頁面的 "遊戲發生問題嗎？請點我"');
			console.log(err.code + ": " + err.message);
			result = false;
		});
	}

	return result;
}

function insert(seq, img, accept, date, target){
	db_data[target] = {};
	db_data[target].date = date;
	db_data[target].seq = seq;
	db_data[target].accept = accept;
	db.ref("/users/" + loginUser.uid + "/HealingMochi/" + target).set(db_data[target])
	.catch((err) => {console.log(err.code + ": " + err.message);});
	if(img != ""){
		db_image[target] = img;
		st.ref().child("users/" + loginUser.uid + "/HealingMochi/" + target + "/" + img.name).put(img)
		.catch((err) => {console.log(err.code + ": " + err.message);});
	}
}

function download_img(target){
	st.ref().child("users/" + loginUser.uid + "/HealingMochi/" + target).listAll()
	.then((res) => {
		res.items.forEach((i) => {
			i.getDownloadURL().then((url) => {
				$("#" + target).find(".preview").attr("src", url);
			})
			.catch((err) => {console.log(err.code + ": " + err.message);});
		});
	})
	.catch((err) => {console.log(err.code + ": " + err.message);});
}