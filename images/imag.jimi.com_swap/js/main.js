(function () {
    var mobile = {
        platform: '',
        version: 0,
        Android: function () {
            return this.platform === 'Android';
        },
        iOS: function () {
            return this.platform === 'iOS';
        },
        init: function () {
            var ua = navigator.userAgent;
            if (ua.match(/Android/i)) {
                this.platform = 'Android';
                this.version = parseFloat(ua.slice(ua.indexOf("Android") + 8));
            }
            else if (ua.match(/iPhone|iPad|iPod/i)) {
                this.platform = 'iOS';
                this.version = parseFloat(ua.slice(ua.indexOf("OS") + 3));
            }
        }
    };
    mobile.init();
    this.mobile = mobile;
} ());

(function (App) {
    $.ajaxSettings.cache = false;
    App.refreshCaptcha = function (dom) {
        var root = $(dom || document.body);
        $.getJSON(config.serviceDomain + '/captcha', function (data) {
            root.find('.CaptchaDeText').val(data.CaptchaDeText);
            root.find('.CaptchaImage').attr('src', config.serviceDomain + data.CaptchaImageUrl);
            var rbtn = root.find('.refresh');
            if (!rbtn.attr('refreshCaptcha')) {
                rbtn.click(function () {
                    rbtn.attr('refreshCaptcha', true);
                    App.refreshCaptcha(dom);
                })
            }
        });
    };
    App.showLoading = function (flag) {
        var loading = $('.imag-global-loading');
        flag ? loading.show() : loading.hide();
    };
    App.ajax = function (opts) {
        opts = opts || {};
        App.showLoading(true);
        var completeFunc = opts.complete;
        var errorFunc = opts.error;
        var ajaxObj = $.extend({
            cache: false,
            error: function () {
                App.showLoading(true);
                if (errorFunc) {
                    errorFunc.call(this);
                }
            },
            complete: function () {
                App.showLoading(false);
                if (completeFunc) {
                    completeFunc.call(this);
                }
            }
        }, opts);
        $.ajax(ajaxObj);
        if (_hmt)
            _hmt.push(['_trackPageview', '/App.ajax?url=' + opts.url]);
    };
    App.loadPageHtml = function (page, onComplete) {
        var url = config.contentPath + page.index + '.html?v=' + config.version;
        $(page).addClass('loading');
        $(page).load(url, function () {
            $(page).removeClass('loading').css('height', 'auto');
            if ($(page).height() <= $('.imag').height()) {
                $(page).css('height', '100%');
            } else {
                $(page).css('height', 'auto');
            }
            if (onComplete) onComplete.call(page);
        });
        if (_hmt)
            _hmt.push(['_trackPageview', window.location.pathname + config.contentPath + page.index + '.htm']);
    };

    var popup = {
        body: $('.imag-body'),
        popbox: $('.imag-popup-box'),
        content: $('.imag-popup-content'),
        closeBtn: $('.imag-popup-close'),
        mask: $('.imag-popup-mask'),
        init: function (opts) {
            var self = this;
            self.opts = {
                elem: null,
                fullscreen: true,
                width: 260,
                height: 400,
                top: 50,
                contentMargin: '10px'
            },
                $.extend(self.opts, opts);
            self.popbox.height(window.innerHeigh);
            self.mask.height(window.innerHeigh);

            $(self.closeBtn, self.content).on('touchstart', function (e) {
                e.preventDefault();
            });
            self.closeBtn.on('ontouchend' in window ? 'touchend' : 'click', function (e) {
                self.hide();
            });
        },
        pop: function (opts) {
            var self = this;
            $.extend(self.opts, opts);
            if (self.opts && self.opts.elem)
                self.content.append(self.opts.elem);
            self.show();
            if (self.opts.onShow)
                self.opts.onShow.call(this, this.content[0]);
        },
        show: function () {
            this.mask.show();
            this.popbox.show();
        },
        hide: function () {
            this.popbox.hide();
            this.mask.hide();
        }
    };
    var indexPage = {
        onInit: function () {
            var page = this;
            App.loadPageHtml(this, function () {
                if ((navigator.platform === 'iPhone' || navigator.platform === 'iPod') && (navigator.userAgent.indexOf('Safari') > -1 && navigator.userAgent.indexOf('Chrome') < 0)) {
                    if (!window.navigator.standalone) {
                        $('.imag-tip-box').addClass('imag-share-to-screen-box-animation').click(function () {
                            $(this).remove();
                        });
                    } else {
                        $('.imag-tip-box').remove();
                    }
                }
            })
        }
    };
    
    var scratchLotteryPage = {//刮刮乐
        tryYourGoodLuck:function(){
            var page = this;
            App.ajax({
                url: config.serviceDomain + '/luckyDraw/index/' + config.luckyDrawId,
                data: { vid:$.cookie('vid')||'' },
                type: 'POST',
                dataType: 'json',//fix for weixin
                error: function(){
                    alert("请检查网络连接，或稍后再试");
                    $('.again-btn',page).show();
                },
                success: function (r) {
                    if(!r || !r.status) return; //service bug!!
                    switch(r.status){
                        case 'PrizeLimitExceeded':
                        case 'OK':
                            //没vid则设置vid
                            if(!/[0-9]+/.test($.cookie('vid')) && r.result && r.result.vid){
                                var date = new Date();
                                date.setFullYear(2199);
                                $.cookie('vid', r.result.vid, { expires:date });
                            }
                            //超过中奖次数当做未中奖处理
                            if(r.status == 'PrizeLimitExceeded'){
                                r.result = { prize: null };
                            }
                            var opts = {
                                width: 200,
                                height: 40,
                                lotteryReward: r.result.prize ? r.result.prize.name : '',
                                lotteryGrade: r.result.prize ? r.result.prize.grade : '',
                                onScratchComplete: function () {
                                    $(this.opts.lotteryReward ? '.prize-btn' : '.again-btn').show();
                                }
                            };
                            if(!page.game){
                                page.game = new scratchLottery(opts);
                            }else{
                                page.game.playAgain(opts);
                            }
                            break;
                        case 'InvalidCaptcha':
                            captchaInput.val('').focus();
                            App.refreshCaptcha();
                            alert('验证码不正确');
                            break;
                        case 'DrawLimitExceeded':
                            alert('已经超过刮奖次数了，谢谢参与！');
                            break
                        case 'NotFound':
                        case 'Ended':
                            alert('活动已结束');
                            break;
                        case 'NotStarted':
                            alert('活动还没开始');
                            break;
                        //当前没有这种状态
                        case 'Ineligible':
                        default:
                            break;
                    }
                }
            });
        },
        getPrizeCode:function(){
            var page = this;
            var box = $('.imag-shield-box',page);
            var errMsg = $('.emsg',page);
            var phoneInput = $('.phone',page);
            var captchaInput = $('.CaptchaInputText',page);
            if(!/^(1(([35][0-9])|(47)|[8][01236789]))\d{8}$/.test(phoneInput.val())){
                errMsg.text('手机号码格式不正确').css('visibility','visible');
                return;
            }
            else if(!/[0-9]{4}/.test(captchaInput.val())){
                errMsg.text('无效的验证码');
                return;
            }else{
                errMsg.text('');
            }
            App.ajax({
                url: config.serviceDomain + '/luckyDraw/SendSMSVerificationCode',
                data: { 
                    id:config.luckyDrawId, 
                    mobile:phoneInput.val(),
                    CaptchaDeText:$('.CaptchaDeText',page).val(),
                    CaptchaInputText:captchaInput.val(),
                    vid:$.cookie('vid')
                },
                dataType: 'json',//fix for weixin
                type: 'POST',
                error: function(){
                    alert("请检查网络连接，或稍后再试");
                    $('.luckyDraw-submit', page).show();
                },
                success: function (r) {
                    switch(r.status)
                    {
                        case 'OK':
                            $.cookie('phone',phoneInput.val());
                            box.hide();
                            alert('您的领奖验证码已经发送到手机'+phoneInput.val()+'，请注意查收。');
                            break;
                        case 'InvalidCaptcha':
                            captchaInput.val('').focus();
                            App.refreshCaptcha();
                            errMsg.text('验证码不正确');
                            break;
                        case 'InvalidMobile':
                            phoneInput('').focus();
                            errMsg.text('手机号码格式不正确');
                            break;
                        case 'LimitExceeded':
                            box.hide();
                            alert('已经超过短信发送限制，请明日再试');
                            break
                        default:
                        case 'UnexpectedUser':
                            box.hide();
                            page.tryYourGoodLuck();
                            break;
                    }
                }
            });
        },
        onInit: function () {
            var page = this;
            LazyLoad.loadAll([
                [
                    'img/scratch-bk.png',
                    'img/scratch-bk2.png',
                    'img/scratch-again-btn.png',
                    'img/scratch-prize-btn.png',
                    config.pluginPath + 'scratch-lottery/img/pattern.png',
                    config.pluginPath + 'scratch-lottery/img/lottery_opened_bk.png'
                ]
            ], null, function () {
                App.loadPageHtml(page, function () {
                    App.imag.refresh();
                    $('.imag-page-return', page).click(function () {
                        $('.imag-shield-box', page).hide();
                    });
                    $('.prize-btn,.again-btn', page).hide();
                    $('.prize-btn').click(function () {
                        $('.again-btn', page).hide();
                        $('.imag-shield-box', page).show();
                        App.refreshCaptcha(page);
                        if($.cookie('phone')){
                            $('.phone',page).val($.cookie('phone'));
                        }
                    });
                    $('.luckyDraw-submit', page).click(function (e) {
                        page.getPrizeCode();
                    })
                    $('.again-btn').click(function () {
                        $('.again-btn', page).hide();
                        page.tryYourGoodLuck();
                    });
                    page.tryYourGoodLuck();
                })
            });
        }
    };
    App.main = function () {
        $('.page').addClass('loading');
        popup.init();

        $(document).on('ontouchstart' in window ? 'touchend' : 'click','.home-btn',function () {
            App.imag.changeToPage(0);
        });

        $(document).on({
            'touchstart': function () {
                $(this).addClass('touch-active');
            },
            'touchcancel': function () {
                $(this).removeClass('touch-active');
            },
            'touchend': function () {
                $(this).removeClass('touch-active');
            }
        }, '.touchable');

        $(document).on('click', '.mapLink', function (e) {
            e.preventDefault();
            var item = $(this).parent().parent();
            var floor = $(this).attr('floor');
            var id = $(this).attr('id');
            popup.pop({
                fullscreen: true,
                onShow: function (container) {
                    var url = config.contentPath + 'data/floor/' + floor + '.json';
                    cw.indoormap.loadMap(container, {
                        url: url,
                        targetEntity: id,
                        floorNumber: floor,
                        onMapMissing: function (svg) {
                            svg.viewer.insertAdjacentHTML('beforeEnd', '<div style="text-align:center;position:absolute;top:0;left:0;padding-top:200px;width:100%;">囧，没有找到资源</div>');
                        }
                    });
                    if (_hmt)
                        _hmt.push(['_trackPageview', window.location.pathname + 'indoorMap?url=' + url]);
                }
            });
        });

        App.imag = new iMAGViewer('.imag-body', {
            onPageChange: function (pre, curr) {
                if (pre != curr) {
                    $('.imag-header')[curr == 0 ? 'hide' : 'show']();
                }
            },
            pageDefinitions: {
                defaultSettings: {
                    onInit: function () {
                        App.loadPageHtml(this);
                    }
                },
                0: indexPage,
                9: scratchLotteryPage
            }
        });
    }
})(App);
