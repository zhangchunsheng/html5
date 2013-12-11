
/**
 * HTML5 通过 geolocation 实现天气预报功能
 * @author yangjinjin
 * @date 2013-07-20
*/

$(document).ready(function() {
	init(); //加载
	
	//初始化城市下拉菜单
	$("#cityList").bind("change", function() {
		initSelectOptList($(this).val());
	});
	
	//取消按钮
	$(".cancel").bind("click", function() {
		$("#showBox, #showSelectCity").hide();
	});
	
	//返回按钮
	$(".back").bind("click", function() {
		$("#showSelectCity").hide(); 
		$("#showBox").show();
	});
	
	//确定按钮
	$(".ok").bind("click", function() {
		if ($("#cityList").val() == "auto") {
			geolocation();
		} else {
			loadWeather(false, "", "set");
		}
	});
});


//获取用户地理位置
function geolocation() {
	if (navigator.geolocation) {
		//获取当前地理位置
		navigator.geolocation.getCurrentPosition(function (position) {
			var coords = position.coords;
			//指定一个google地图上的坐标点，同时指定该坐标点的横坐标和纵坐标
			var latlng = new google.maps.LatLng(coords.latitude, coords.longitude);
			
			//获取具体地理位置
			var geocoder = new GClientGeocoder();
			geocoder.getLocations(latlng.lat() + "," + latlng.lng(), function(response) {
				if (!response || response.Status.code != 200) {
					alert("对不起，不能解析该地址。");
				} else {
					try {
						var address = response.Placemark[0].AddressDetails.Country.AdministrativeArea.AdministrativeAreaName;
						loadWeather(false, address, "set");
					} catch (e) {
						throw e;
					}
				}
			});
		}, function (error) { //处理错误
			switch (error.code) {
				case 1:
					alert("位置服务被拒绝。");
					break;
				case 2:
					alert("暂时获取不到位置信息。");
					break;
				case 3:
					alert("获取信息超时。");
					break;
				default:
					alert("未知错误。");
					break;
			}
		});
	} else {
		alert("你的浏览器不支持HTML5来获取地理位置信息。");
	}
}

//主动加载
function init() {
	var citydata = getCookie("cityjson") ? $.parseJSON(getCookie("cityjson")) : {};
	
	//自动加载用户地理位置
	if (citydata.pyName == undefined || citydata.subquName == undefined) {
		geolocation();
	} else {
		loadWeather(true); //载入天气数据
	}
}

//组装显示界面
function getBoxHTML(weatherinfo) {
	var shtml = "",
		img = [weatherinfo.img1, weatherinfo.img2, weatherinfo.img3],
		temp = [weatherinfo.temp1, weatherinfo.temp2, weatherinfo.temp3],
		weather = [weatherinfo.weather1, weatherinfo.weather2, weatherinfo.weather3],
		date = new Date(),
		day = date.getDay();
		
	for (var i = 0; i < 3; i ++) {
		shtml += '<div class="fl list">\
			<span class="date cen '+ (i == 0 ? "datecol" : "") +'">' + GetDateStr(i) + '</span>\
			<span class="ico cen"><img src="images/a' + (img[i] > 35 ? 0 : img[i]) + '.jpg"/></span>\
			<span class="temper cen">' + temp[i] + '</span>\
			<span class="wea cen">' + weather[i] + '</span>\
		</div>';
	}
	shtml += '<div class="clr footset"><a href="javascript:;" onclick="cityLink();">城市设置</a></div>';
	
	return shtml;
}

//获取日期
function GetDateStr(AddDayCount) {
	var date = new Date(), day,
		arr_week = new Array("周日", "星期一", "星期二", "星期三", "星期四", "星期五", "周六"),
		dayinfo = ["今天", "明天", "后天"];
		
	date.setDate(date.getDate() + AddDayCount); //获取AddDayCount天后的日期
	day = date.getDay();
	
	return dayinfo[AddDayCount] + "(" + arr_week[day] + ")";
}

//封装的ajax
function getAjaxData(url, type, params) {
	var result = "";
	console.log(url);
	$.ajax({
		url: url,
		type: type,
		async: false,
		data: params,
		success: function(data) {
			result = data;
		}
	});
	return result;
}

//得到城市的名称标识
function getCityFlag(city) {
	var pyName = "";
	var _result = getAjaxData("xml/city.xml", "get", {});
	$(_result).find("city").each(function() {
		if ($(this).attr("quName") == city) {
			pyName = $(this).attr("pyName");
		}
	});
	return pyName;
}

//加载城市下拉列表
function initSelectOptList(city) {
	city = city || "";
	var _defOpt = '<option value="auto">自动</option>';
	if (city == "") {
		var _opt = "";
		var _result = getAjaxData("xml/city.xml", "get", {});
		$(_result).find("city").each(function() {
			_opt += '<option value="' + $(this).attr("pyName") + '">' + $(this).attr("quName") + "</option>\n";
		});
		$("#cityList").append(_defOpt + _opt);
		$("#subCityList").empty().append(_defOpt);
	} else {
		$.getJSON("data/citys_json.js", {}, function(json) {
			var _opt = city != "auto" ? "" : _defOpt;
			for (var item in json) {
				if (item == city) {
					var subCityList = json[item].subCity;
					for (var n in subCityList) {
						_opt += '<option value="' + subCityList[n].pyName + '">' + subCityList[n].zwName + "</option>\n";
					}
				}
			}
			$("#subCityList").empty().append(_opt);
		});
	}
}

function cityLink() {
	$("#showBox").hide();
	$("#showSelectCity").show();
}

/**
 * 设置天气
 * @param isReadCache	是否读取缓存的标识
 * @param cityName		所要加载的城市名称
*/ 
function loadWeather(isReadCache, cityName, type) {
	cityName = cityName || "";
	type = type || "read";
	var citydata = getCookie("cityjson") ? $.parseJSON(getCookie("cityjson")) : {},
		pyName = isReadCache ? citydata.pyName : $("#cityList").val(),
		pySubName = isReadCache ? citydata.subpyName : $("#subCityList").val(),
		cityText = isReadCache ? (citydata.subquName || citydata.quName) : $("#subCityList").find("option:selected").text();
	
	if (cityName != "") {
		pyName = getCityFlag(cityName);
		pySubName = "";
		cityText = cityName;
	}
	
	var _result = getAjaxData("http://localhost/github/html5/webapp/weather/ajax.php", "post", {"pyName": pyName, "subpyName": pySubName});
	if (_result == "" || _result == undefined) {
		alert("获取天气数据失败!");
		return false;
	}
	var weatherinfo = $.parseJSON(_result);
	if (weatherinfo == null || weatherinfo == "") {
		alert("获取数据出错，请稍后再访问。");
		return false;
	}
	
	//初始化载入城市下拉列表
	initSelectOptList();
	
	$("#city").html(cityText + "："); //显示城市名称
	$("#pic").html('<img src="images/a' + weatherinfo.img1 + '.jpg" />');
	$("#temperature").html(weatherinfo.temp1);
	$("#showBox").html(getBoxHTML(weatherinfo));
	if (type == "set") {
		$("#showSelectCity").hide();
		$("#showBox").show();
	}
	$("#layout").hover(function() {
		$("#showBox").slideDown();
		$("#showSelectCity").hide();
	});
	$("#showBox").hover(function() {
		$(this).show();
	}, function() {
		$(this).slideUp();
	});
}

//取Cookie
function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if(arr != null)
		return unescape(arr[2]);
	return null;
}
