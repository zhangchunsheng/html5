var R = {};

R.toast = function(message) {
    $("#toast .weui_toast_content").html(message);
    $("#toast").show();
    setTimeout(function () {
        $('#toast').hide();
    }, 2000);
    return;
}

R.calculateFee = function(data, distance, duration, discount) {
    var fee = ((data.start_fee + (data.per_kilometer_fee * distance) + (data.per_minute_fee * duration)) * discount).toFixed(0);
    if(data.min_fee > 0) {
        if(fee < data.min_fee) {
            fee = data.min_fee;
        }
    }
    return parseInt(fee);
}

//快车 舒适 商务 豪华
//Young 舒适 商务 豪华
R.price_data = {
    "didi": [{
        "name": "快车",
        "start_fee": 0,
        "per_kilometer_fee": 1.8,
        "per_minute_fee": 0.5,
        "low_speed_fee": 0.5,
        "min_fee": 10
    }, {
        "name": "舒适车型",
        "start_fee": 12,
        "per_kilometer_fee": 2.9,
        "per_minute_fee": 0,
        "low_speed_fee": 0.8,
        "min_fee": 0
    }, {
        "name": "商务车型",
        "start_fee": 17,
        "per_kilometer_fee": 4.5,
        "per_minute_fee": 0,
        "low_speed_fee": 1.5,
        "min_fee": 0
    }, {
        "name": "豪华车型",
        "start_fee": 20,
        "per_kilometer_fee": 4.6,
        "per_minute_fee": 0,
        "low_speed_fee": 1.8,
        "min_fee": 0
    }],
    "yidao": [{
        "name": "Young车型",
        "start_fee": 7,
        "per_kilometer_fee": 2,
        "per_minute_fee": 0.4,
        "min_fee": 0
    }, {
        "name": "舒适车型",
        "start_fee": 13,
        "per_kilometer_fee": 2.8,
        "per_minute_fee": 0.4,
        "min_fee": 0
    }, {
        "name": "商务车型",
        "start_fee": 16,
        "per_kilometer_fee": 4,
        "per_minute_fee": 0.6,
        "min_fee": 0
    }, {
        "name": "豪华车型",
        "start_fee": 21,
        "per_kilometer_fee": 4.2,
        "per_minute_fee": 0.8,
        "min_fee": 0
    }]
};

function close_dialog() {
    $('#pk_start').css('display', 'none');
    $("#pk_start_content").css('top', '50%');
    $("#pk_start_didi").css('left', '-110px');
    $("#pk_start_yidao").css('right', '-110px');
    $("#pk_start_pk").css('left', '-60px');
    $("#pk_start_pk").css('top', '-140px');
    $("#pk_start_pk img").css('display', 'none');
    $("#pk_start_pk img").css('width', '400px');
    $("#pk_start_pk img").css('height', '400px');

    $('#result').css('display', 'none');
}

$(document).ready(function() {
    function drawRoute(startAddress, endAddress) {
        drivingRoute.search(startAddress, endAddress);
    }

    $("#button_compare").click(function() {
        var startAddress = $("#startAddress").val();
        var endAddress = $("#endAddress").val();
        if(startAddress == '') {
            R.toast("请输入下车地点");
        }
        if(endAddress == '') {
            R.toast("请输入下车地点");
        }

        drawRoute(startAddress, endAddress);
        /*$.get("http://51ride.duapp.com/compare_price/compare.php", {
            startAddress: startAddress,
            endAddress: endAddress
        }, function(status, ret) {

        });*/
    });

    var clickCount = 0;
    var event = 'click';
    if('ontouchstart' in window) {
        event = 'touchstart'
    }
    $('#container').on(event, '#title', function () {
        clickCount++;
        if(clickCount >= 6) {
            $("#tip").show();
            clickCount = 0;
        }
    });

    $(".weui_mask_can_close").on('click', function(e) {
        $(this).parent().hide();
    });

    function getEl(m) {
        return document.getElementById(m);
    }

    var map = new BMap.Map("l-map");

    function addMarker(point) {
        var marker = new BMap.Marker(point);
        map.addOverlay(marker)
    }

    var geocoder = new BMap.Geocoder();

    var autoCompleteStartAddress = new BMap.Autocomplete({
        "input": "startAddress",
        "location": map
    });
    var autoCompleteEndAddress = new BMap.Autocomplete({
        "input": "endAddress",
        "location": map
    });

    autoCompleteStartAddress.addEventListener("onhighlight", function(e) {
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
    });

    autoCompleteEndAddress.addEventListener("onhighlight", function(e) {
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
    });

    var myValue;

    autoCompleteStartAddress.addEventListener("onconfirm", function(e) {
        var _value = e.item.value;
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
        getEl("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
        setPlace();
    });

    autoCompleteEndAddress.addEventListener("onconfirm", function(e) {
        var _value = e.item.value;
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
        getEl("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
        setPlace();
    });

    var searchComplete = function(results) {
        if (drivingRoute.getStatus() != BMAP_STATUS_SUCCESS) {
            R.toast("地图出错了");
            return;
        }
        $("#pk_start").show();
        $("#pk_start_didi").animate({
            left:'10px',
        }, "slow");
        $("#pk_start_yidao").animate({
            right:'10px',
        }, "slow", function(e) {
            $("#pk_start_pk").show();
            $("#pk_start_pk").animate({
                left:'105px',
                top:'20px',
            }, "slow");
            $("#pk_start_pk img").animate({
                width:'60px',
                height:'60px',
            }, "slow", function(e) {
                $("#pk_start_content").animate({
                    top:'100px',
                }, "slow");

                var plan = results.getPlan(0);
                var distance = (plan.getDistance(false) / 1000).toFixed(0);
                var duration = (plan.getDuration(false) / 60).toFixed(0);

                var html = {
                    'didi': '',
                    'yidao': ''
                };
                $("#result .driverDetail").html("本次行程:" + plan.getDistance(true) + "，" + plan.getDuration(true));

                var didiCostPay = 0;
                var yidaoCostPay = 0;
                var didiWinNum = 0;
                var yidaoWinNum = 0;
                var didiWinHtml = '';
                var yidaoWinHtml = '';
                var winHtml = '<i class="weui_icon_success_circle win_circle"></i>';
                html.didi = '<div>滴滴</div><div class="result_line">';
                html.yidao = '<div>易到（充返后）</div><div class="result_line">';
                for(var i in R.price_data.yidao) {
                    didiWinHtml = '';
                    yidaoWinHtml = '';

                    didiCostPay = R.calculateFee(R.price_data.didi[i], distance, duration, 1);
                    yidaoCostPay = R.calculateFee(R.price_data.yidao[i], distance, duration, 0.67);
                    if(yidaoCostPay <= didiCostPay) {
                        yidaoWinNum++;
                        yidaoWinHtml = winHtml;
                    } else {
                        didiWinNum++;
                        didiWinHtml = winHtml;
                    }
                    html.didi += '<div>' + R.price_data.didi[i].name + '</div>';
                    html.didi += '<div>' + didiCostPay + '元' + didiWinHtml + '</div>';
                    html.yidao += '<div>' + R.price_data.yidao[i].name + '</div>';
                    html.yidao += '<div>' + yidaoCostPay + '元' + yidaoWinHtml + '</div>';
                }
                html.didi += '</div>';
                html.yidao += '</div>';

                var title = "";
                if (yidaoWinNum >= didiWinNum) {
                    title = "The winner is【易到】";
                } else {
                    title = "The winner is【滴滴】";
                }
                $("#result .weui_dialog_title").html(title);
                $("#result_didi").html(html.didi);
                $("#result_yidao").html(html.yidao);
                $("#result").css("display", "block");
            });
        });
    };

    var drivingRoute = new BMap.DrivingRoute(map, {
        renderOptions: {
            map: map
        },
        onSearchComplete: searchComplete
    });

    function setPlace() {
        map.clearOverlays();

        function myFun() {
            var point = local.getResults().getPoi(0).point;
            map.centerAndZoom(point, 18);
            var marker = new BMap.Marker(point);
            marker.enableDragging();
            map.addOverlay(marker);
        }
        var local = new BMap.LocalSearch(map, {
            onSearchComplete: myFun
        });
        local.search(myValue);
    }

    var geolocation = new BMap.Geolocation();

    geolocation.getCurrentPosition(function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var marker = new BMap.Marker(r.point);
            marker.enableDragging();
            map.addOverlay(marker);
            
            var point = new BMap.Point(r.point.lng, r.point.lat);
            $("#current_point").valueOf(point);
            map.centerAndZoom(point, 17);
            map.enableScrollWheelZoom(true);
            
            geocoder.getLocation(point, function(rs) {
                if (rs) {
                    $("#startAddress").val(rs.address);
                }
            })
        } else {

        }
    }, {
        enableHighAccuracy: false
    });
});