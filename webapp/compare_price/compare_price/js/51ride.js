$(document).ready(function() {
    function l(o, m, n) {
        c.search(o, m)
    }
    $("#button_compare").click(function() {
        var n = $("#startAddress").val();
        var m = $("#endAddress").val();
        l(n, m, null);
        $.get("http://51ride.duapp.com/compare_price/compare.php", {
            lat: n,
            lng: m
        }, function(p, o) {})
    });

    function j(m) {
        return document.getElementById(m)
    }
    var a = new BMap.Map("l-map");

    function g(m, o) {
        var n = new BMap.Marker(m);
        a.addOverlay(n)
    }
    var b = new BMap.Geocoder();
    var k = new BMap.Autocomplete({
        "input": "startAddress",
        "location": a
    });
    var e = new BMap.Autocomplete({
        "input": "endAddress",
        "location": a
    });
    k.addEventListener("onhighlight", function(o) {
        var p = "";
        var m = o.fromitem.value;
        var n = "";
        if (o.fromitem.index > -1) {
            n = m.province + m.city + m.district + m.street + m.business
        }
        p = "FromItem<br />index = " + o.fromitem.index + "<br />value = " + n;
        n = "";
        if (o.toitem.index > -1) {
            m = o.toitem.value;
            n = m.province + m.city + m.district + m.street + m.business
        }
        p += "<br />ToItem<br />index = " + o.toitem.index + "<br />value = " + n
    });
    e.addEventListener("onhighlight", function(o) {
        var p = "";
        var m = o.fromitem.value;
        var n = "";
        if (o.fromitem.index > -1) {
            n = m.province + m.city + m.district + m.street + m.business
        }
        p = "FromItem<br />index = " + o.fromitem.index + "<br />value = " + n;
        n = "";
        if (o.toitem.index > -1) {
            m = o.toitem.value;
            n = m.province + m.city + m.district + m.street + m.business
        }
        p += "<br />ToItem<br />index = " + o.toitem.index + "<br />value = " + n
    });
    var i;
    k.addEventListener("onconfirm", function(n) {
        var m = n.item.value;
        i = m.province + m.city + m.district + m.street + m.business;
        j("searchResultPanel").innerHTML = "onconfirm<br />index = " + n.item.index + "<br />myValue = " + i;
        h()
    });
    e.addEventListener("onconfirm", function(n) {
        var m = n.item.value;
        i = m.province + m.city + m.district + m.street + m.business;
        j("searchResultPanel").innerHTML = "onconfirm<br />index = " + n.item.index + "<br />myValue = " + i;
        h()
    });
    var d = function(n) {
        if (c.getStatus() != BMAP_STATUS_SUCCESS) {
            return
        }
        var o = n.getPlan(0);
        var m = (o.getDistance(false) / 1000).toFixed(0);
        if (m <= 7.2) {
            $("#weui_dialog_msg").html(o.getDistance(true) + "坐【滴滴】最便宜");
            $("#weui_dialog").css("display", "block")
        } else {
            if (m > 7.2 && m <= 9.2) {
                $("#weui_dialog_msg").html(o.getDistance(true) + "坐【Uber】最便宜");
                $("#weui_dialog").css("display", "block")
            } else {
                if (m >= 9.2) {
                    $("#weui_dialog_msg").html(o.getDistance(true) + "坐【易到】最便宜");
                    $("#weui_dialog").css("display", "block")
                }
            }
        }
    };
    var c = new BMap.DrivingRoute(a, {
        renderOptions: {
            map: a
        },
        onSearchComplete: d
    });

    function h() {
        a.clearOverlays();

        function m() {
            var p = n.getResults().getPoi(0).point;
            a.centerAndZoom(p, 18);
            var o = new BMap.Marker(p);
            o.enableDragging();
            a.addOverlay(o)
        }
        var n = new BMap.LocalSearch(a, {
            onSearchComplete: m
        });
        n.search(i)
    }
    var f = new BMap.Geolocation();
    f.getCurrentPosition(function(n) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var m = new BMap.Marker(n.point);
            m.enableDragging();
            a.addOverlay(m);
            b.getLocation(n.point, function(q) {
                var r = q.addressComponents
            });
            var o = new BMap.Point(n.point.lng, n.point.lat);
            $("#start_point").valueOf(o);
            a.centerAndZoom(o, 17);
            a.enableScrollWheelZoom(true);
            var p = new BMap.Geocoder();
            p.getLocation(o, function(q) {
                if (q) {
                    $("#startAddress").val(q.address)
                }
            })
        } else {}
    }, {
        enableHighAccuracy: false
    })
});