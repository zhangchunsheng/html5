var wxManage = typeof Signature == 'function' ? {
    tick: '',
    sig: new Signature(),
    config: {
        title: '', // 分享标题
        desc: '', // 分享描述
        link: window.location.href, // 分享链接
        imgUrl: '', // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: ''// 如果type是music或video，则要提供数据链接，默认为空
    },
    init: function (config) {
        $.extend(this.config, config);
        var that = this;
        this.getTick(function () {
            that.run();
        });
    },
    modifyConfig: function (config) {
        $.extend(this.config, config);
        this.run();
    },
    getTick: function (callback) {
        var that = this;
        $.ajax({
            url: 'http://www.3dbizhi.com/platform/tool/weixin_share/jsticket.php',
            type: 'get',
            crossDomain: true,
            dataType: 'jsonp',
            jsonp: "callback",
            jsonpCallback: 'wxGetTickCallback',
            success: function (res) {
                if (res) {
                    that.tick = res.ticket;
                    that.sig.genSign(that.tick, window.location.href);
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: 'wx642bfac3d22ca908', // 必填，公众号的唯一标识
                        timestamp: that.sig._timeStamp, // 必填，生成签名的时间戳
                        nonceStr: that.sig._nonceStr, // 必填，生成签名的随机串
                        signature: that.sig._signature, // 必填，签名，见附录1
                        jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });
                    callback();
                } else {
                    $.ajax({
                        url: 'http://www.3dbizhi.com/platform/tool/weixin_share/refreshticket.php',
                        type: 'get',
                        crossDomain: true,
                        dataType: 'jsonp',
                        jsonp: "callback",
                        jsonpCallback: 'wxRefreshCallback',
                        success: function (res) {
                            callback();
                        }
                    });
                }
            }
        });
    },
    run: function () {
        var that = this;

        wx.ready(function () {

            wx.onMenuShareTimeline(that.config);
            wx.onMenuShareAppMessage(that.config);
            wx.onMenuShareQQ(that.config);
            wx.error(function (v) {
                $.ajax({
                    url: 'http://www.3dbizhi.com/platform/tool/weixin_share/refreshticket.php',
                    type: 'get',
                    crossDomain: true,
                    dataType: 'jsonp',
                    jsonp: "callback",
                    jsonpCallback: 'wxRefreshCallback',
                    success: function (res) {
                        that.getTick(function () {
                            that.init();
                        });
                    }
                });
            });
        })
    }
} : {};