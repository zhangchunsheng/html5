! function() {
    function a(a) {
        document.getElementById("canvas").addEventListener("touchstart", function(b) {
            1 == b.touches.length ? a(0, 0, b.touches[0].clientX, b.touches[0].clientY) : 2 == b.touches.length && a(5, 1, b.touches[1].clientX, b.touches[1].clientY)
        }), document.getElementById("canvas").addEventListener("touchmove", function(b) {
            1 == b.touches.length ? a(2, 0, b.touches[0].clientX, b.touches[0].clientY) : 2 == b.touches.length && (a(2, 0, b.touches[0].clientX, b.touches[0].clientY), a(2, 1, b.touches[1].clientX, b.touches[1].clientY))
        }), document.getElementById("canvas").addEventListener("touchend", function(b) {
            1 == b.touches.length ? a(1, 0, b.touches[0].clientX, b.touches[0].clientY) : 2 == b.touches.length && a(6, 1, b.touches[1].clientX, b.touches[1].clientY)
        })
    }
    var b = function(a, b, c) {
        this.root = a, this.mGroupId = b, this.onTouchManage(a), this.root.setAppEventDelegate(this), this.root.setFrameEventDelegate(this), this.rippleImpulseParams = a.getMaterialManager().getByName("material_ripple_impulse", b).getPass(0).getFragmentProgramParameters(), this.impulsePos = new Vector2(-1, -1), this.rippleBlendParams = a.getMaterialManager().getByName("material_ripple_blend", b).getPass(0).getFragmentProgramParameters(), this.viewportScale = new Vector2(1, 1), this.rtSourceTex = a.getTextureManager().getByName("rt_source", b)
    };
    b.prototype.getObjHandler = function(a) {
        var b = arguments[1] ? arguments[1] : "scene8",
            c = this.root.getSceneManager(b).getSceneNode(a);
        return c
    }, b.prototype.getAniHandler = function(a) {
        var b = this.root.getAnimationManager().findAnimation(a);
        return b
    }, b.prototype.getDistance = function(a, b) {
        return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y))
    }, b.prototype.objRotateWithFinger = function(a, b) {
        b = a.Sensitivity.e * b;
        var c = a.FromAngle[a.RotateAxis] + b * a.AngleRange[a.RotateAxis];
        a.ObjHandler.getTransform().resetOrientation(), "x" == a.RotateAxis ? a.ObjHandler.getTransform().pitch(c) : "y" == a.RotateAxis ? a.ObjHandler.getTransform().yaw(c) : "z" == a.RotateAxis && a.ObjHandler.getTransform().roll(c), a.Progress = b
    }, b.prototype.objScaleWithFinger = function(a, b) {
        b = 10 * b / this.DeviceInfoLength;
        var c = a.ObjHandler.getTransform().getScale().x;
        c += b, c > a.MaxScale && (c = a.MaxScale), c < a.MinScale && (c = a.MinScale), a.ObjHandler.getTransform().setScale(c, c, c)
    }, b.prototype.limiteProgress = function(a) {
        return a - Math.floor(a)
    }, b.prototype.limiteProgress2 = function(a) {
        return a > 1 ? a = 1 : 0 > a && (a = 0), a
    }, b.prototype.init = function() {
        this.root.setFrameEventDelegate(this), this.root.setAppEventDelegate(this), this.DeviceInfoLength = Math.sqrt(this.root.getScreenWidth() * this.root.getScreenWidth() + this.root.getScreenHeight() * this.root.getScreenHeight()), this.FrameListener = !1, this.TouchEventListener = !0, this.FingerCount = 0, this.MinDeltaFingerProgress = 1e-4, this.touch_flag = !0, this.suipian_flag = !0, this.uvani_flag = !0, this.isGyroRunning = !1, this.speedDeviceAngle = 0, this.speedDeviceBeta = 0, this.deviceAngle = 0, this.realDeviceAngle = 0, this.FirstFinger = {
            DirectionCtrl: {
                x: -1,
                y: 1
            },
            DownPosition: {
                x: null,
                y: null
            },
            DownTime: null,
            UpTime: null,
            MaxUpSpeed: {
                x: 50,
                y: 30
            },
            UpDuration: {
                mini: 10,
                maxi: 5e3
            },
            UpPosition: {
                x: null,
                y: null
            },
            MovePosition: {
                x: null,
                y: null
            },
            PreMovePosition: {
                x: null,
                y: null
            },
            Sensitivity: {
                x: 1,
                y: 1.6
            },
            DeltaProgress: {
                x: 0,
                y: 0
            },
            DampingSpeed: {
                x: .8,
                y: .7
            },
            IsMoving: !1
        }, this.SecondFinger = {
            DirectionCtrl: {
                x: 1,
                y: 1
            },
            DownPosition: {
                x: null,
                y: null
            },
            UpPosition: {
                x: null,
                y: null
            },
            MovePosition: {
                x: null,
                y: null
            },
            PreMovePosition: {
                x: null,
                y: null
            },
            Sensitivity: {
                x: 10.4,
                y: 1
            },
            ScaleDeltaProgress: 0,
            ScaleDampingSpeed: .9,
            PreDistance: null,
            IsMoving: !1
        }, this.PI = Math.PI, this.ObjectEvent = {
            ObjHandler: null,
            IsMoving: !1,
            ActiveFrame: !1,
            SwitchEnable: {
                move: !1,
                rotate: !0,
                scale: !1
            },
            FromAngle: {
                x: 0,
                y: 0,
                z: 0
            },
            ToAngle: {
                x: 0,
                y: 2 * this.PI,
                z: 0
            },
            AngleRange: {
                x: 0,
                y: -2 * this.PI,
                z: 0
            },
            RotateAxis: "y",
            Sensitivity: {
                w: 1,
                e: 1,
                r: 1
            },
            Progress: 0
        }, this.Object2Event = {
            ObjHandler: null,
            IsMoving: !1,
            ActiveFrame: !1,
            SwitchEnable: {
                move: !1,
                rotate: !0,
                scale: !0
            },
            FromAngle: {
                x: 2 * this.PI,
                y: 0,
                z: 0
            },
            ToAngle: {
                x: 0,
                y: 0,
                z: 0
            },
            AngleRange: {
                x: 2 * this.PI,
                y: 0,
                z: 0
            },
            RotateAxis: "x",
            MaxScale: 1.3,
            MinScale: .6,
            Sensitivity: {
                w: 1,
                e: 1,
                r: 2
            },
            Progress: 0
        };
        var a = this.getObjHandler("groupScene");
        this.ObjectEvent.ObjHandler = a;
        var b = this.getObjHandler("group2Scene");
        this.Object2Event.ObjHandler = b, this.groupScene = this.root.getSceneManager("scene8").getSceneNode("groupScene"), this.group_zi = this.root.getSceneManager("scene8").getSceneNode("group_zi"), this.pPlane3 = this.root.getSceneManager("scene8").getSceneNode("pPlane3"), this.pPlane4 = this.root.getSceneManager("scene8").getSceneNode("pPlane4"), this.flyToRotateAniX = this.root.getAnimationManager().findAnimation("flyToRotateAniX"), this.flyToRotateAniX.setAnimationDelegate(this), this.flyToRotateAniY = this.root.getAnimationManager().findAnimation("flyToRotateAniY"), this.flyToRotateAniY.setAnimationDelegate(this), this.lambert9_uv_rotate = this.root.getAnimationManager().findAnimation("lambert9_uv_rotate"), this.lambert9_uv_rotate.setAnimationDelegate(this), this.suipian_AniSet = this.root.getAnimationManager().findAnimation("suipian_AniSet"), this.suipian_AniSet.setAnimationDelegate(this), this.wenzi_AniSet = this.root.getAnimationManager().findAnimation("wenzi_AniSet"), this.wenzi_AniSet.setAnimationDelegate(this);
        var c = this,
            d = this.root.getSceneManager("scene8").getSceneNode("group_touch");
        d.setTapCallback(function(a) {
            1 == c.touch_flag && 1 == a.action && (c.touch_flag = !1, console.log("111"), c.flyToRotateAniX.startPlay(0, 0), c.flyToRotateAniY.startPlay(0, 0), c.pPlane3.setVisible(!1), c.pPlane4.setVisible(!1), c.suipian_AniSet.stopPlay(799, 0), c.suipian_AniSet.startPlay(0, 0), c.TouchEventListener = !1)
        }), this.OnAnimationEnd = function(a) {
            switch (a.getName()) {
                case "suipian_AniSet":
                    1 == this.suipian_flag ? (this.groupScene.setVisible(!1), this.suipian_flag = !1, this.wenzi_AniSet.startPlay(0, 0)) : 0 == this.suipian_flag && (this.TouchEventListener = !0, this.pPlane3.setVisible(!0), this.pPlane4.setVisible(!0), $("#aniu").show(), $("#logo").show(), this.ObjectEvent.Progress = 0, this.Object2Event.Progress = 0);
                    break;
                case "wenzi_AniSet":
                    this.groupScene.setVisible(!0), this.group_zi.setVisible(!1), this.suipian_AniSet.startPlay(0, 1)
            }
        }, this.initialGystoral()
    }, b.prototype.OnFrameStarted = function() {
        this.isGyroRunning && (this.speedDeviceAngle = .1 * (this.deviceAngle - this.realDeviceAngle), this.speedDeviceBeta = .1 * (this.device_beta - this.real_device_beta), this.realDeviceAngle = this.realDeviceAngle + this.speedDeviceAngle, this.real_device_beta = this.real_device_beta + this.speedDeviceBeta, this.persp1_father_tran.resetOrientation(), this.persp1_father_tran.yaw(this.realDeviceAngle), this.persp1_father_port_tran.resetOrientation(), this.persp1_father_port_tran.pitch(this.real_device_beta), this.speedDeviceAngle < this.minDeviceSpeed && this.speedDeviceAngle > -this.minDeviceSpeed && this.speedDeviceBeta < this.minDeviceSpeed && this.speedDeviceBeta > -this.minDeviceSpeed && (this.isGyroRunning = !1))
    }, b.prototype.OnTouchScreen = function(a, b, c, d, e) {
        2 == b || 0 == b ? (isTouched = !0, this.impulsePos.x = d / a.mPhoneWidth, this.impulsePos.y = 1 - e / a.mPhoneHeight, this.rippleImpulseParams.setNamedConstant("impulsePos", this.impulsePos)) : 1 == b && (isTouched = !1, this.impulsePos.x = -1, this.impulsePos.y = -1, this.rippleImpulseParams.setNamedConstant("impulsePos", this.impulsePos))
    }, b.prototype.onTouchManage = function(b) {
        a(function(a, c, d, e) {
            if (this.TouchEventListener) {
                if (0 == c)
                    if (0 == a) this.FrameListener = !1, this.FirstFinger.DownTime = b.getTimer().getMilliseconds(), this.FingerCount = 1, this.FirstFinger.DownPosition.x = d, this.FirstFinger.DownPosition.y = e, this.FirstFinger.MovePosition.x = null, this.FirstFinger.MovePosition.y = null;
                    else if (2 == a) {
                    null == this.FirstFinger.MovePosition.x ? this.FirstFinger.PreMovePosition.x = d : this.FirstFinger.PreMovePosition.x = this.FirstFinger.MovePosition.x, null == this.FirstFinger.MovePosition.y ? this.FirstFinger.PreMovePosition.y = e : this.FirstFinger.PreMovePosition.y = this.FirstFinger.MovePosition.y, this.FirstFinger.MovePosition.x = d, this.FirstFinger.MovePosition.y = e;
                    var f = this.FirstFinger.MovePosition.x - this.FirstFinger.PreMovePosition.x,
                        g = this.FirstFinger.MovePosition.y - this.FirstFinger.PreMovePosition.y;
                    this.FirstFinger.DeltaProgress.x = f / this.root.getScreenWidth(), this.FirstFinger.DeltaProgress.y = g / this.root.getScreenHeight(), this.FirstFinger.IsMoving = !0
                } else if (1 == a) {
                    this.FirstFinger.UpTime = b.getTimer().getMilliseconds(), this.FirstFinger.UpPosition.x = d, this.FirstFinger.UpPosition.y = e;
                    var h = this.FirstFinger.UpTime - this.FirstFinger.DownTime;
                    0 >= h ? h = this.FirstFinger.UpDuration.mini : h > this.FirstFinger.UpDuration.maxi && (h = this.FirstFinger.UpDuration.maxi);
                    var i = this.FirstFinger.UpPosition.x - this.FirstFinger.DownPosition.x,
                        j = this.FirstFinger.UpPosition.y - this.FirstFinger.DownPosition.y;
                    this.FirstFinger.IsMoving = !1, this.FirstFinger.DeltaProgress.x = -i / h / this.FirstFinger.MaxUpSpeed.x, this.ObjectEvent.ActiveFrame = !0, this.FirstFinger.DeltaProgress.y = j / h / this.FirstFinger.MaxUpSpeed.y, this.Object2Event.ActiveFrame = !0, this.FingerCount = 0, this.FrameListener = !0
                }
                if (1 == c)
                    if (5 == a) this.FingerCount = 2, this.SecondFinger.DownPosition.x = d, this.SecondFinger.DownPosition.y = e;
                    else if (2 == a) this.SecondFinger.MovePosition.x = d, this.SecondFinger.MovePosition.y = e, this.SecondFinger.IsMoving = !0;
                else if (6 == a) {
                    this.SecondFinger.PreDistance = null, this.FingerCount = 1, this.SecondFinger.IsMoving = !1;
                    var k = this.SecondFinger.ScaleDeltaProgress * this.SecondFinger.Sensitivity.x;
                    Math.abs(k) < this.MinDeltaFingerProgress ? this.Object2Event.ActiveScaleFrame = !1 : (this.FirstFinger.DeltaProgress.y = k, this.Object2Event.ActiveScaleFrame = !0), this.FrameListener = !0
                }
                if (1 == this.FingerCount) {
                    if (this.FirstFinger.IsMoving) {
                        if (this.ObjectEvent.SwitchEnable.rotate) {
                            var l = this.FirstFinger.DeltaProgress.x * this.FirstFinger.DirectionCtrl.x * this.FirstFinger.Sensitivity.x;
                            this.ObjectEvent.Progress = this.ObjectEvent.Progress + l;
                            var m = this.limiteProgress(this.ObjectEvent.Progress);
                            this.objRotateWithFinger(this.ObjectEvent, m)
                        }
                        if (this.Object2Event.SwitchEnable.rotate) {
                            var n = this.FirstFinger.DeltaProgress.y * this.FirstFinger.DirectionCtrl.y * this.FirstFinger.Sensitivity.y;
                            this.Object2Event.Progress = this.Object2Event.Progress + n;
                            var o = this.limiteProgress(this.Object2Event.Progress);
                            this.objRotateWithFinger(this.Object2Event, o)
                        }
                    }
                } else if (2 == this.FingerCount && this.Object2Event.SwitchEnable.scale && this.FirstFinger.IsMoving && this.SecondFinger.IsMoving) {
                    var p = this.getDistance(this.FirstFinger.MovePosition, this.SecondFinger.MovePosition);
                    null == this.SecondFinger.PreDistance && (this.SecondFinger.PreDistance = p);
                    var q = p - this.SecondFinger.PreDistance;
                    Math.abs(q) >= 10 && (q = 0), this.objScaleWithFinger(this.Object2Event, q), this.SecondFinger.PreDistance = p
                }
            }
        }.bind(this))
    };
    var c = function(a) {
        this.callee = a
    };
    b.prototype.OnSize = function(a, b, c) {
        this.viewportScale.x = b / this.rtSourceTex.getWidth(), this.viewportScale.y = c / this.rtSourceTex.getHeight(), this.rippleBlendParams.setNamedConstant("viewportScale", this.viewportScale)
    }, b.prototype.OnDestroy = function() {
        this.impulsePos["delete"](), this.viewportScale["delete"](), this.root.removeFrameEventDelegate(this), this.root.removeAppEventDelegate(this), this.callee && this.callee.clear()
    }, window.postCreateScene = function(a, d, e) {
        window.mainLogic = new b(a, d), mainLogic.init();
        var f = new c(this);
        a.addOnDestroyCallback(f.OnDestroy, f, this.mGroupId)
    }, b.prototype.initialGystoral = function() {
        var a = this;
        switch (this.persp1_father = this.root.getSceneManager("scene8").getSceneNode("persp1_father"), this.persp1_father_tran = this.root.getSceneManager("scene8").getSceneNode("persp1_father").getTransform(), this.persp1_father_port = this.root.getSceneManager("scene8").getSceneNode("persp1_father_ret"), this.persp1_father_port_tran = this.root.getSceneManager("scene8").getSceneNode("persp1_father_ret").getTransform(), this.last_gamma = 0, this.now_gamma = 0, this.last_beta = 0, this.now_beta = 0, this.device_beta = 0, this.real_device_beta = 0, this.direction = window.orientation, this.isIos = window.gg.util.browserVersion.ios, this.isAndroid = window.gg.util.browserVersion.android, this.lon = 0, this.lat = 0, this.direction = 0, this.fix = 0, this.lon = 0, this.lat = 0, this.direction = window.orientation || 0, this.direction) {
            case 0:
                this.fix = 0;
                break;
            case 90:
                this.fix = -270;
                break;
            case -90:
                this.fix = -90
        }
        this.orientHandler = function(b) {
            if (a.isIos) switch (a.direction) {
                    case 0:
                        a.lon = b.alpha + b.gamma, b.beta > 0 && (a.lat = b.beta - 90);
                        break;
                    case 90:
                        b.gamma < 0 ? a.lon = b.alpha - 90 : a.lon = b.alpha - 270, b.gamma > 0 ? a.lat = 90 - b.gamma : a.lat = -90 - b.gamma;
                        break;
                    case -90:
                        b.gamma < 0 ? a.lon = b.alpha - 90 : a.lon = b.alpha - 270, b.gamma < 0 ? a.lat = 90 + b.gamma : a.lat = -90 + b.gamma
                } else if (a.isAndroid) switch (a.direction) {
                    case 0:
                        a.lon = b.alpha + b.gamma + 30, b.gamma > 90 ? a.lat = 90 - b.beta : a.lat = b.beta - 90;
                        break;
                    case 90:
                        a.lon = b.alpha - 230, b.gamma > 0 ? a.lat = 270 - b.gamma : a.lat = -90 - b.gamma;
                        break;
                    case -90:
                        a.lon = b.alpha - 180, a.lat = -90 + b.gamma
                }
                if (a.lon += a.fix, a.lon %= 360, a.lon < 0 && (a.lon += 360), a.lon = Math.round(a.lon), a.lat = Math.round(a.lat), null != a.lon) {
                    a.now_gamma = a.lon / 180 * 3.14159;
                    var c = a.now_gamma - a.last_gamma;
                    a.now_beta = b.beta / 180 * 3.14159, Math.abs(c) > .005 && 1 == a.TouchEventListener && Math.abs(c) < .3 && (a.isGyroRunning = !0, a.deviceAngle -= 1.2 * c), a.last_gamma = a.now_gamma
                }
            if (null != a.lat) {
                var c = a.now_beta - a.last_beta,
                    d = a.device_beta - .5 * c;
                Math.abs(c) > .005 && Math.abs(c) < .3 && Math.abs(d) < .55 && 1 == a.TouchEventListener && (a.device_beta -= .7 * c, a.isGyroRunning = !0), a.last_beta = a.now_beta
            }
        }, window.addEventListener("deviceorientation", function(b) {
            a.orientHandler(b)
        }, !1)
    }
}();