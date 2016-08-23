$(document).ready(function() {
    function drawRoute(startAddress, endAddress) {
        drivingRoute.search(startAddress, endAddress)
    }
    $("#button_compare").click(function() {
        var startAddress = $("#startAddress").val();
        var endAddress = $("#endAddress").val();
        drawRoute(startAddress, endAddress);
        /*$.get("http://51ride.duapp.com/compare_price/compare.php", {
            startAddress: startAddress,
            endAddress: endAddress
        }, function(status, ret) {

        });*/
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
            return
        }
        var plan = results.getPlan(0);
        var distance = (plan.getDistance(false) / 1000).toFixed(0);
        if (distance <= 7.2) {
            $("#weui_dialog_msg").html(plan.getDistance(true) + "坐【滴滴】最便宜");
            $("#weui_dialog").css("display", "block");
        } else {
            $("#weui_dialog_msg").html(plan.getDistance(true) + "坐【易到】最便宜");
            $("#weui_dialog").css("display", "block");
        }
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
            $("#start_point").valueOf(point);
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