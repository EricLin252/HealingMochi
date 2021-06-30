function vue_init(){
	Vue.component("question", {
		template: '\
			<span class="question">\
				{{message}}<br v-if="br">\
				<span class="input-text">{{input}}</span>\
				<button class="write" @click="typing" v-if="!flag"></button>\
			</span>\
		',
		props: ['message', 'br', 'initdata', 'seq', 'flag'],
		methods: {
			typing(){
				var k = this;
				open_blocker(true);
				$("#typing").show();
				$("#input-scribe").text(this.message);
				$("#input-area").focus().val(k.input).blur(function(event){
					k.$emit("update", k.seq, $.trim($(this).val()), "seq");
					close_blocker(true);
					$("#typing").hide();
					$(this).unbind(event);
				});
			}
		},
		computed: {
			input(){
				return this.initdata;
			}
		}
	});

	var D = new Date();

	for(var i = 1; i <= 8; i++){
		var element = "#q" + i;
		content[i] = new Vue({
			el: element,
			data: {
				flag: false,
				date: (D.getMonth()+1) + "/" + D.getDate(),
				seq: {seq0: "", seq1: "", seq2: "", seq3: ""},
				img: {img0: ""}
			},
			methods: {
				finish(target){
					if(this.flag){
						$("#infor-content").html(complete_scribe[target]);
						$("#infor-title").text("衛教小語");
						$("#infor-scribe").show("fade");
						open_blocker(true);
						return;
					}
					var f = true;
					var idx = target;
					idx--;
					for(var i = 0; i < nseq[idx]; i++){
						if(this.seq["seq" + i] == ""){
							f = false;
							break;
						}
					}
					for(var i = 0; i < nimg[idx]; i++){
						if(this.img["img" + i] == ""){
							f = false;
							break;
						}
					}
					if(!f){
						window.alert("你還沒完成這頁的手帳內容喔~");
						return;
					}
					open_blocker(true);
					$("#warning").show();
					var k = this;
					$("#submit").click(function(event){
						insert(k.seq, k.img.img0, $("#accept").prop("checked"), k.date, "q"+target);
						k.flag = true;
						var l = $("#q" + target).find(".finish");
						l.addClass("complete");
						l.children("div").text("衛教小語");
						$(".list-column").eq(target).addClass("complete");
						close_blocker(true);
						$("#warning").hide();

						if(obj_len(db_data) == 8){
							$("#end").addClass("page");
							$("#form-link-column").show();
							pages = $(".page");
							total_page = pages.length;
							window.alert("恭喜你已經完成了所有手帳內容，立刻填寫表單參加抽獎吧！");
							goto_page(12);
						}

						$(this).unbind(event);
					});
				},
				update(idx, val, type){
					if(type == "seq") this.seq["seq" + idx] = val;
					else if(type == "img") this.img["img" + idx] = val;
				}
			}
		});
	}

	information = new Vue({
		el: "#information",
		data: {
			state: "login",
			type: "student",
			account: "",
			email: "",
			password: "",
			pwd_type: "password"
		},
		methods: {
			ch_type(){
				if(this.pwd_type == "password") this.pwd_type = "text";
				else this.pwd_type = "password";
			},
			open_infor(){
				if(this.state == "mkaccount"){
					$("#infor-content").html("\
						歡迎參加「小麻糬的療癒之旅－減壓生活的8種練習」線上療癒手帳，這是一本關於自我照顧的手帳，活動方式說明如下：<br>\
						1. 創建帳號成功！<br>\
						2. 不須依順序及時間，開始紀錄減壓生活的練習。<br>\
						3. 只要於期限（110/3/15-110/5/14）內完成八種練習各一次會跳出「紀錄完成抽獎請按我」視窗，點擊後填完問卷，即可參加抽獎！<br>\
						4. 還可到健康心理中心櫃台(活動中心3F)領取限量三層山冰淇淋兌換券（已經兌換完了喔~）<br>\
						5. 除上述外，歡迎多次且隨時紀錄平時的自我照顧練習喔～以及歡迎5/3～5/31 至學生活動中心1F中庭參加實體互動式展覽！<br>\
					");
				}
				else{
					$("#infor-content").html("\
						小麻糬為了調配出最適合自己的口味，開始了他的療癒之旅～<br>\
						在這趟長長的旅途中，有八個休息站，每站都會提供各式補給，<br>\
						幫助小麻糬完成這趟旅程，不需按照順序時間，只要完成八種練習，即可參加抽獎，並有機會兌換限量三層山冰淇淋券喔！<br>\
						<br>\
						活動方式說明如下：<br>\
						1. 創建帳號成功！<br>\
						2. 不須依順序及時間，開始紀錄減壓生活的練習。<br>\
						3. 只要於期限（110/3/15-110/5/14）內完成八種練習各一次會跳出「紀錄完成抽獎請按我」視窗，點擊後填完問卷，即可參加抽獎！<br>\
						4. 還可到健康心理中心櫃台(活動中心3F)領取限量三層山冰淇淋兌換券（已經兌換完了喔~）<br>\
						5. 除上述外，歡迎多次且隨時紀錄平時的自我照顧練習喔～以及歡迎5/3～5/31 至學生活動中心1F中庭參加實體互動式展覽！<br>\
						<br>\
						*抽獎好禮:<br>\
						1. 饗食天堂餐券<br>\
						2. SAMSUNG Galaxy Fit2 智慧手環<br>\
						3. USERWATS  舒壓麻糬熊小夜燈<br>\
						4. 全聯禮券500元<br>\
						<br>\
						*手帳製作：(按姓名筆劃排列)<br>\
						工作人員：林冠宇 陳庭美 陳季瑤 彭思蓉 曾瑞祥 劉庭瑜 羅佩佳<br>\
						美編設計：人間失腦(hgj)\
					");
				}
				$("#infor-title").text("關於手帳");
				$("#infor-scribe").show("fade");
				open_blocker(true);
			},
			input(val_type){
				open_blocker(true);
				$("#change-infor").show();
				if(val_type == "email") $("#change-infor-scribe").text("更新電子郵件：");
				else if(val_type == "account"){
					switch(this.type){
						case "student":
							$("#change-infor-scribe").text("更新學號：");
							break;
						case "teacher":
							$("#change-infor-scribe").text("更新教職員代碼：");
							break;
						default:
							$("#change-infor-scribe").text("更新帳號：");
							break;
					}
				}
				else if(val_type == "password") $("#change-infor-scribe").text("更改密碼：");
				else if(val_type == "forgot") $("#change-infor-scribe").text("請輸入遊戲使用的信箱：");
				var k = "";
				$("#change-infor-input").focus().val("").blur(function(event){
					k = $.trim($(this).val());
					close_blocker(true);
					$("#change-infor").hide();
					$(this).unbind(event);
					if(val_type == "email"){
						if(change_information("", k, "")) email = k;
					}
					else if(val_type == "account"){
						if(change_information(k, "", "")) account = k;
					}
					else if(val_type == "password"){
						change_information("", "", k);
					}
					else if(val_type == "forgot"){
						forgot_pwd(k);
					}
				});
			},
			login(){
				login(this.email, this.password);
			},
			mkaccount(){
				makeAccount(this.type, this.account, this.email, this.password);
			},
			logout(){
				logout();
			}
		}
	});

	var list = new Vue({
		el: "#list",
		methods: {
			gopage(idx){
				goto_page(idx);
			}
		}
	});
}