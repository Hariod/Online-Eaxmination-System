//			var test_id=window.sessionStorage.getItem("test_id");
$(function() {
	var Length = null; //全局变量，用来存储服务器端返回的数据数组长度
	var Allsubject = null; //全局变量用来存储服务器端返回的数据数组
	var btn = document.getElementById("btn"); //交卷按钮
	$.ajax({
		url: " https://www.easy-mock.com/mock/5c0676cbc7333b1980a5d606/startsolutionproblem/start",
		dataType: 'json',
		type: 'get',
		//data:{
		//id:test_id
		//},
		async: false,
		success: function(data) {
			var allsubject = data.data.subject;
			var length = allsubject.length;
			Allsubject = allsubject;
			Length = length;
			for(var i in allsubject) {
				var num = parseInt(i) + 1;
				var str = "";
				str += "<li>";
				str += "<p><strong><span>" + num + "<span/>." + allsubject[i].sub1 + "</strong></p>";
				str += "<ul>";
				str += "<li>";
				str += "<input type='radio' id='selecta' value=" + allsubject[i].a + " />" + allsubject[i].a;
				str += "</li>";
				str += "<li>";
				str += "<input type='radio' id='selectb' value=" + allsubject[i].b + " />" + allsubject[i].b;
				str += "</li>";
				str += "<li>";
				str += "<input type='radio' id='selectc' value=" + allsubject[i].c + " />" + allsubject[i].c;
				str += "</li>";
				str += "<li>";
				str += "<input type='radio' id='selectd' value=" + allsubject[i].d + " />" + allsubject[i].d;
				str += "</li>";
				str += "</ul>";
				str += "</li>";
				$(".choice-question")
					.append(str);
				$(".choice-question>li:nth-child(" + num + ")")
					.attr("id", "Q" + i);
				$(".choice-question>li:nth-child(" + num + ")")
					.children("ul")
					.children("li")
					.children("input")
					.attr("name", "Q" + i);
			}
		},
		error: function() {
			alert("试卷信息加载失败");
		}
	});
	//生成题号
	function CreateTitle_number() {
		for(var i = 1; i <= Length; i++) {
			var c_div = document.createElement("div");
			$(c_div).html(i);
			$(".number").append(c_div);
		}
	};
	//点击题号试卷滚动到相应的题目
	function Scroll() {
		var index = $(this).index();
		var scroll_offset = $(".choice-question>li").eq(index).offset();
		var scroll = scroll_offset.top - 100;
		$("body,html").animate({
			scrollTop: scroll //设置滚动条的位置
		}, 250);
	}

	//提取字符串中的数字
	function getNum(str) {
		var num = str.replace(/[^0-9]/ig, "");
		return num;
	}

	//显示已做题目
	function Showselected() {
		var nameval = $(this).attr("name")
		var index = getNum(nameval);
		$(".number>div").eq(index).css({
			"backgroundColor": "#0000FF",
			"color": "white"
		});
	}
	//交卷函数
	function Submit() {
		var answers = {};
		for(var i = 0; i < Length; i++) {
			if(second > 0) { //判断考试时间是否未到
				if($("input[name=Q" + i + "]:checked").val() == undefined) { //判断是否已完成所有题目
					alert("您还有题目未做完,请不要交卷！");
					break;
				}
			}
			answers[Allsubject[i].sub1] = $("input[name=Q" + i + "]:checked").val();
		}
		console.log(answers);
		$.ajax({
			url: " ",
			dataType: 'json',
			type: 'get',
			data: {
				smt: answers
			},
			async: false,
			success: function() {

			},
			error: function() {
				
			}
		});
	}
	var test_time =0.1 //设置考试时间
	$(".test>header>span:nth-of-type(1)>span").html(test_time);
	var storagesecond = window.sessionStorage.getItem("endsecond");
	var storagenum=window.sessionStorage.getItem("startnum");
	if(storagesecond ==null) {
		second = test_time * 60;
		var num = 0;
	} else {
		second = storagesecond;
		var num=storagenum;
	}
	var timer = setInterval(click, 1000);
	function click() {
		//剩余时间
		second = parseInt(second) - 1;
		var endm = parseInt(second / 60);
		var ends = second - endm * 60;
		window.sessionStorage.setItem("endsecond", second);
		var endtime = endm + "分" + ends + "秒";
		$(".test>header>span:nth-of-type(3)>span").html(endtime);
		//开始时间
		num = parseInt(num) + 1;
		var startm = parseInt(num / 60);
		var starts = num - startm * 60;
		window.sessionStorage.setItem("startnum",num);
		var starttime = startm + "分" + starts + "秒";
		$(".test>header>span:nth-of-type(2)>span").html(starttime);
		if(second <= 0) {
			clearInterval(timer);
			setTimeout(function() {
				alert("考试时间到！请交卷！");
				Submit();
			}, 1000);

		}
	}
	CreateTitle_number();
	$("input").on("click", Showselected);
	$("button").on("click", Submit);
	$(".number>div").on("click", Scroll);
});