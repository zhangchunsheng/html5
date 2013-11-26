/// <reference path="../TheShodo.js" />
/// <reference path="../TheShodo.Shodo.Core.js" />
/// <reference path="../TheShodo.Shodo.Resources.js" />
/// <reference path="kazari.js" />

TheShodo.Shodo.Write = {
    // -- Settings
    videoFadeOutDuration  : 600,
    videoFadeOutTiming    : 15.5,
    alwaysSkipIntro       : false,
    isUAInlineSVGSupported: false,
    preloadImages         : [
        '/shared/img/write/icon_checkbox_01.png',
        '/shared/img/write/icon_checkbox_01_o.png',
        '/shared/img/write/icon_checkbox_02.png',
        '/shared/img/write/icon_checkbox_02_o.png',
    ].map(function (e) { return TheShodo.sharedBaseUrl + e; }),
    
    // -- Variables
    CurrentPlayer: null
};

//
// -- EntryPoint --------------------------------------------------------------
//
$(document).ready(function () {
    if (!TheShodo.UA.isCanvasSupported) {
        $('.block-notice-dummy-canvas').css('display', 'block');
        return;
    }
    
    TheShodo.Shodo.Write.launch();
});

//
// -- Setup -------------------------------------------------------------------
//
// Setup flow: prepareStage -> launch -> loading(waiting for all resources) -> intro -> initialize -> stand by ready! 
//
TheShodo.Shodo.Write.launch = function () {
    this.prepareStage();

    $('.write-stage').show();

    this.showLoading();

    this.skipIntro = TheShodo.Shodo.Write.alwaysSkipIntro ||
                     Kazari.SessionStorage.getItem('TheShodo.Shodo.Write.skipIntro', false) ||
                     Kazari.LocalStorage.getItem('TheShodo.Shodo.Write.skipIntro', false);
}


TheShodo.Shodo.Write.prepareStage = function (ratio, mode) {
    var ratio, mode;
    if (window.innerHeight >= 896) {
        // SXGA
        ratio = 1.33;
        mode = 'sxga';
    } else if (window.innerHeight >= 681) {
        // WXGA
        ratio = 1.08;
        mode = 'wxga';
    } else {
        // Default
        TheShodo.Shodo.Write.preloadImages.push(TheShodo.sharedBaseUrl + '/shared/img/write/frame.png');
        return;
    }

    TheShodo.Shodo.Write.preloadImages.push(TheShodo.sharedBaseUrl + '/shared/img/write/' + mode + '/frame.png');
    $('body').addClass('screen-mode-' + mode);
    $('#layered-canvas, #write-canvas, #hand-canvas').each(function (i, e) {
        e.width *= ratio;
        e.height *= ratio;
    });
    $('#hanshi-image, #write-bunchin, #write-shitajiki').each(function (i, e) {
        var node = $(e);
        node.attr('src', node.attr('src').replace(/(.*\/)/, "$1" + mode + "/"));
    });
}

TheShodo.Shodo.Write.showLoading = function () {
    // Loading...
    TheShodo.Shodo.Write.LoadingPanel.show();
//    var loadingPanel = new TheShodo.FloatingPanel('Loading',
//                                                  '<div>Loading Resources... (<span class="loadedCount">0</span> / <span class="totalCount">0</span>)</div>',
//                                                  { hasClose: false });

    var loadingWatcher = new Kazari.ResourceLoadingWatcher();
    loadingWatcher
        .register($('.write-container img').get().filter(function (e) { return e.tagName != 'image'; })) // filter [SVGImageElement]
        .register($('#top-menu img').get().filter(function (e) { return e.tagName != 'image'; })) // filter [SVGImageElement]
        .register(document.getElementById('write-tools-movie'))
        .register(this.preloadImages.map(function (e) { var img = document.createElement('img'); img.src = e; return img; }))
        .onProgress(function (loadedCount, totalCount) {
            if (window.console && window.console.log) {
                console.log('Resources: '+ loadedCount + '/' + totalCount + '; ' + loadingWatcher.watchTargets.map(function (e) { return (e.src || e.href || e.data || '<'+e.tagName+'>').toString().replace(/.*\//, ''); }).join(', '));
            }
        })
        .onComplete($.proxy(function () {
            TheShodo.Shodo.Write.LoadingPanel.close();
            TheShodo.Shodo.Write.onLoadingComplete();
        }, this))
        .start();
    ;
}

TheShodo.Shodo.Write.onLoadingComplete = function () {
    $('#write-shitajiki').fadeIn('fast', function () {
        $('#write-hanshi').fadeIn('slow', function () {
            $('#write-bunchin').fadeIn('slow', function () {
                if (TheShodo.Shodo.Write.skipIntro) {
                    // skip intro
                    TheShodo.Shodo.Write.initialize();
                } else {
                    // at first time (with introduction movie)
                    TheShodo.Shodo.Write.playIntro();
                }
            })
        })
    });
}

TheShodo.Shodo.Write.playIntro = function () {
    var blocker = function (e) {
        e.preventDefault(); e.stopPropagation();
        $('.playing-movie-notice').hide().remove();

        var offset = $(this).offset();
        var x = e.pageX - offset.left;
        var y = e.pageY - offset.top;

        $('<span class="playing-movie-notice" />')
            .html('<span>Preparing ink.</span><br /><span>Please wait a moment.</span>')
            .css('left', (x - 162/2) + 'px')
            .css('top', (y - 56) +'px')
            .appendTo($('.content'))
            .fadeIn()
            .delay(1000)
            .fadeOut()
        ;
    }

    $('body .content').click(blocker);

    var videoE = $('#write-tools-movie')
        //.bind('ended', function(e) { $('#write-tools').fadeIn(); })
        .fadeIn()
        .bind('timeupdate', function(e) {
            if ($(this).attr('currentTime') > TheShodo.Shodo.Write.videoFadeOutTiming) {
                $(this).unbind('timeupdate', arguments.callee);
                
                $('body .content').unbind('click', blocker);

                // skip intro at next time
                Kazari.SessionStorage.setItem('TheShodo.Shodo.Write.skipIntro', true);
                // prepare
                TheShodo.Shodo.Write.initialize();
            }
        })
        .get(0)
    ;
    videoE.volume = 0;
    videoE.play();
}

TheShodo.Shodo.Write.initialize = function () {
    this.commandHooker = new Kazari.CommandHooker();

    // Check Inline SVG
    if (TheShodo.UA.isSVGSupported) {
        if ($('svg').eq(0).attr('namespaceURI') == 'http://www.w3.org/2000/svg') {
            this.isUAInlineSVGSupported = true;
        }
    }

    // show all elements & setup
    $('#write-tools-movie').fadeOut(this.videoFadeOutDuration, $.proxy(function () {
        // prepare
        if (this.isUAInlineSVGSupported) {
            this.prepareCopybookSelection();
        }

        this.attachButtonEvents();
        this.setupKeyEvents();
        this.initializeStrokeEngine();
    },this));


    // show tools
    if (this.isUAInlineSVGSupported) {
        $('#top-menu .menu-copybook').css('display', 'inline-block');
    }
    $('#top-menu').animate({ top: '0px' }, 'fast');
    $('#write-fude-medium').css('visibility', 'hidden');
    $('#write-tools-ink').fadeIn('fast');
    $('#write-tools-stage').fadeIn('fast', function () { $('body').addClass('write-ready'); });

    // Set Rollover
    $('.content a')
        .hover(function (e) {
            // in
            $(this).find('img.rollover').each(function (i, e) {
                e.src = e.src.replace(/(\.\w+)$/, '_o$1');
            });
        }, function (e) {
            // out
            $(this).find('img.rollover').each(function (i, e) {
                e.src = e.src.replace(/_o(\.\w+)$/, '$1');
            });
        });
}

TheShodo.Shodo.Write.prepareCopybookSelection = function () {
    // copybook
    var freeSelect = $('#copybook-select li:last-child');
    var copybookOrig = document.getElementById('copybook');
    var chars = copybookOrig.getElementsByTagName('g');
    for (var i = 0, n = chars.length; i < n; i++) {
        var gCloned = chars[i].cloneNode(true);
        var svgImage = copybookOrig.cloneNode(false);
        svgImage.appendChild(gCloned);
        svgImage.setAttribute('height', '32px');
        svgImage.setAttribute('width', '32px');
        gCloned.style.display = 'block';

        var title = gCloned.getAttributeNS('http://www.w3.org/1999/xlink', 'title');
        
        var image = gCloned.getElementsByTagName('image')[0];
        var imageSrc;
        if (image) {
            imageSrc = image.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
        }

        $('<li><a class="" href="#"><span class="label"><img src="" alt="" /></span></a></li>')
            .find('a')
                .addClass(gCloned.id)
                .prepend(svgImage)
                .end()
            .find('.label img')
                .attr('src', imageSrc)
                .attr('alt', title)
                .end()
            .insertBefore(freeSelect)
        ;
    }
}


TheShodo.Shodo.Write.initializeStrokeEngine = function () {
    // setup/start StrokeManager/Engine
    var canvas = $('#write-canvas');
    var canvasE = canvas.get(0);
    var layeredCanvas = $('#layered-canvas');
    var layeredCanvasE = layeredCanvas.get(0);
    var handCanvas = $('#hand-canvas');

    // hand visiblity
    var isHandVisible = Kazari.LocalStorage.getItem('TheShodo.Shodo.Write.isHandVisible', true);
    $('#hand-visibility-checkbox').show().toggleClass('checked', isHandVisible);

    TheShodo.Shodo.Shared.StrokeEngine = new TheShodo.Shodo.StrokeEngine(canvasE.width, canvasE.height, canvas, layeredCanvasE);
    TheShodo.Shodo.Shared.StrokeEngine.backgroundImage = document.getElementById('hanshi-image');
    TheShodo.Shodo.Shared.StrokeManager = new TheShodo.Shodo.StrokeManager(handCanvas, TheShodo.Shodo.Shared.StrokeEngine);
    TheShodo.Shodo.Shared.StrokeManager.isHandVisible = isHandVisible;
    TheShodo.Shodo.Shared.StrokeManager.start();
}

//
// -- Configuration Methods ---------------------------------------------------
//
TheShodo.Shodo.Write.selectBrush = function (brushName) {
    /// <summary>Select a brush</summary>
    TheShodo.Shodo.Shared.StrokeManager.selectBrush(brushName);
    $('#write-tools-stage *').css('visibility', 'visible').animate({ opacity: 1 });
    $('#write-fude-' + brushName.toLowerCase()).css('visibility', 'hidden').animate({ opacity: 0 });
    $('#hand-image img').hide();
    $('#hand-image-' + brushName.toLowerCase()).show();
}

TheShodo.Shodo.Write.setBrushOpacity = function (opacity) {
    /// <summary>Set brush opacity</summary>
    TheShodo.Shodo.Shared.StrokeManager.setBrushOpacity(opacity);
}

TheShodo.Shodo.Write.clear = function () {
    /// <summary>Show 'Clear' confirmation dialog</summary>
    var floatingPanel = new TheShodo.FloatingPanel.MessageBox('',
                                                              TheShodo.Shodo.Resources.Write.String.Panel_Clear_Label || 'Clear?',
                                                              [
                                                                  { label: TheShodo.Shodo.Resources.Write.String.Panel_Cancel || 'Cancel', isCancel: true, isDefault: true },
                                                                  { label: TheShodo.Shodo.Resources.Write.String.Panel_Delete || 'Yes',
                                                                    onClick: function (sender, e) {
                                                                          TheShodo.Shodo.Write.onClear(sender);
                                                                          sender.close();
                                                                    }
                                                                  },
                                                              ]);
    floatingPanel.show();
}

//
// -- Utility ------------------------------------------------------------------
//

TheShodo.Shodo.Write.addJumpList = function (title, url, createdAt) {
    if (TheShodo.UA.isSiteMode) {
        var recentMyWorks = Kazari.LocalStorage.getItem("TheShodo.Shodo.Write.recentMyWorks", []);
        recentMyWorks.unshift({ title: title, url: url, createdAt: createdAt.getTime() });
        if (recentMyWorks.length > 20) {
            recentMyWorks.pop();
        }
        Kazari.LocalStorage.setItem("TheShodo.Shodo.Write.recentMyWorks", recentMyWorks);

        // build jumplist
        window.external.msSiteModeCreateJumplist(TheShodo.Shodo.Resources.Write.String.Jumplist_Label_RecentMyWorks || "Recent My Works");
        recentMyWorks.forEach(function (e, i) {
            var label = e.title.replace(/\r|\n/g, "");
            var createdAt = new Date(e.createdAt);
            if (label.length > 15) {
                label = label.slice(0, 15) + "...";
            }
            label += " (" + (createdAt.getYear()+1900) + "/" + (createdAt.getMonth() + 1) + "/" + createdAt.getDate() + " " + createdAt.getHours() + ":" + createdAt.getMinutes() + ")";
            window.external.msSiteModeAddJumpListItem(label, e.url, "/favicon.ico");
        });
        window.external.msSiteModeShowJumplist();
    }
}

//
// -- Events ------------------------------------------------------------------
//

TheShodo.Shodo.Write.setupKeyEvents = function () {
    this.commandHooker.setup($('.content').get(0));
    this.commandHooker.addMapping(
        ['b'],
        function () {
            switch (TheShodo.Shodo.Shared.StrokeEngine.currentBrush.name) {
                case 'Small':
                    TheShodo.Shodo.Write.selectBrush('Medium'); break;
                case 'Medium':
                    TheShodo.Shodo.Write.selectBrush('Large'); break;
                case 'Large':
                    TheShodo.Shodo.Write.selectBrush('Small'); break;
                default:
                    TheShodo.Shodo.Write.selectBrush('Medium'); break;
            }
        }
    );
    this.commandHooker.addMapping(['del'], function () { TheShodo.Shodo.Write.clear(); });
    this.commandHooker.addMapping(['d'], function () { TheShodo.Shodo.Write.clear(); });
}

// Attach tools button events
TheShodo.Shodo.Write.attachButtonEvents = function () {
    // fude
    $('#write-tools-stage').click(TheShodo.Shodo.Write.onStageClicked);
    // ink
    $('#write-tools-ink').click(TheShodo.Shodo.Write.onInkClicked);

    // [Clear]
    $('#button-clear').click(TheShodo.Shodo.Write.onClearButtonClicked);
    // [Finish]
    $('#button-finish').click(function (e) {
        e.preventDefault();
        var panel = new TheShodo.Shodo.Write.PanelFinish();
        panel.onSave = TheShodo.Shodo.Write.onSave;
        panel.show(TheShodo.Shodo.Shared.StrokeManager.toDataURL());
    });

    // [Copybook]
    $('#button-copybook').click(TheShodo.Shodo.Write.onCopybookButtonClicked);
    $('#copybook-select a').click(TheShodo.Shodo.Write.onCopybookItemClicked);

    // "show hand holding brush"
    $('#hand-visibility-checkbox').click(TheShodo.Shodo.Write.onHandCheckboxClicked);
}

// On "show hand holding brush" Clicked
TheShodo.Shodo.Write.onHandCheckboxClicked = function (e) {
    e.preventDefault();
    var isVisible = $(this).toggleClass('checked').hasClass('checked');
    TheShodo.Shodo.Shared.StrokeManager.isHandVisible = isVisible;
    Kazari.LocalStorage.setItem('TheShodo.Shodo.Write.isHandVisible', isVisible);
}

// On [Save to Gallery] Clicked
TheShodo.Shodo.Write.onSave = function (sender, e) {
    // to JSON
    var formE = $('form').get(0);
    var sendData = TheShodo.createDataFromForm(formE);
    sendData.Data = TheShodo.Shodo.Shared.StrokeManager.toDataURL('image/png');
    sendData.StrokeHistory = {
          Version: 1
        , Strokes: JSON.stringify(TheShodo.Shodo.Shared.StrokeManager.strokeHistory)
        , Width:   TheShodo.Shodo.Shared.StrokeEngine.width
        , Height:  TheShodo.Shodo.Shared.StrokeEngine.height
    };

    //if (window.console && window.console.log) console.log(JSON.stringify(data));

    $.ajax({
        type: 'POST',
        url: formE.action,
        data: JSON.stringify(sendData),
        beforeSend: function (xhr) {
                        xhr.setRequestHeader('X-RequestVerificationToken', formE['__RequestVerificationToken'].value);
                    },
        success: function (data, textStatus, xhr) {
                    if (data && data.IsCommitted) {
                        TheShodo.Shodo.Write.LoadingPanel.close();
                        // add JumpList
                        TheShodo.Shodo.Write.addJumpList(sendData.Comment, data.Url, new Date());
                        // show Entry Page
                        var panel = new TheShodo.Shodo.Write.EntryPanel(data.Url, '/Gallery');
                        panel.show();
                    } else if (data && data.ErrorMessage) {
                        TheShodo.Shodo.Write.ErrorMessageBox.show(TheShodo.Shodo.Resources.Write.String.SendErrorOnDone, "Error: "+data.ErrorMessage);
                        TheShodo.Shodo.Write.LoadingPanel.close();
                    } else {
                        TheShodo.Shodo.Write.ErrorMessageBox.show(TheShodo.Shodo.Resources.Write.String.SendErrorOnDone, "Error: Unknown");
                        TheShodo.Shodo.Write.LoadingPanel.close();
                    }
                },
        error: function (xhr, textStatus, error) {
            TheShodo.Shodo.Write.ErrorMessageBox.show(TheShodo.Shodo.Resources.Write.String.SendErrorOnDone, "Error: "+error);
            TheShodo.Shodo.Write.LoadingPanel.close();
        },
        contentType: 'application/json',
        dataType: 'json'
    });

    TheShodo.Shodo.Write.LoadingPanel.show();
}

// On Ink Clicked
TheShodo.Shodo.Write.onInkClicked = function (e) {
    e.preventDefault();
    var panel = new TheShodo.Shodo.Write.PanelSelectInk();
    panel.onInkSelected = function (selectedOpacity) {
        TheShodo.Shodo.Write.setBrushOpacity(selectedOpacity);
    };
    panel.show(TheShodo.Shodo.Shared.StrokeManager.getBrushOpacity());
}

// On Tools(Fude) Clicked
TheShodo.Shodo.Write.onStageClicked = function (e) {
    e.preventDefault();
    var panel = new TheShodo.Shodo.Write.PanelSelectBrush();
    panel.onBrushSelected = function (brushName) {
        TheShodo.Shodo.Write.selectBrush(brushName);
    };
    panel.show(TheShodo.Shodo.Shared.StrokeEngine.currentBrush.name);
}

// On [Clear] (top-menu) clicked.
TheShodo.Shodo.Write.onClearButtonClicked = function (e) {
    e.preventDefault();
    TheShodo.Shodo.Write.clear();
}

// On Click Clear in floating panel.
TheShodo.Shodo.Write.onClear = function (e) {
    TheShodo.Shodo.Shared.StrokeManager.lock();

    var hanshiE = document.getElementById('write-hanshi');
    var bunchinE = document.getElementById('write-bunchin');
    var layeredE = document.getElementById('layered-canvas');

    var maxSize = 1;
    var initSize = 1;
    var duration = 300;

    var canvas = layeredE;
    var ctx = canvas.getContext('2d');

    // "syuwa-syuwa-" effect animation
    var currentImage = TheShodo.Shodo.Shared.StrokeEngine.getImage(true);
    Kazari.Animation.initialize()
        .addScene(function (state) {
            var easing = Kazari.JSTweener.easingFunctions.easeOutQuad;
            if (state.elapsed > duration) {
                state.onNext();
                return;
            }

            ctx.save();
            ctx.globalAlpha = 0.1;
            var value = (state.elapsed >= duration) ? maxSize : easing(state.elapsed, 0, maxSize, duration);
//            ctx.drawImage(currentImage,
//                          0, 0, canvas.width, canvas.height, /* src */
//                          0-value/2, 0-value/2, canvas.width + value, canvas.height + value /* dst */);

            [0, -value, value].forEach(function (left) {
                [0, -value, value].forEach(function (top) {
                    ctx.drawImage(currentImage,
                                  0, 0, canvas.width, canvas.height, /* src */
                                  top, left, canvas.width, canvas.height /* dst */);
                });
            });

            ctx.restore();
 
            // Opacity: 1 -> 0
            var opacity = (state.elapsed >= duration) ? 0 : easing(state.elapsed, 1, 0 - 1, duration);
            canvas.style.opacity = opacity;
        })
        .addScene(function (state) {
            TheShodo.Shodo.Shared.StrokeManager.unlock();
            TheShodo.Shodo.Shared.StrokeManager.clearHistory();
            canvas.style.opacity = 1;
            state.onNext();
        })
    ;
}

// On [Copybook] Clicked
TheShodo.Shodo.Write.onCopybookButtonClicked = function (e) {
    e.preventDefault();
    var container = $(this).parent();
    var isOpened = container.hasClass('menu-opened');
    container
        .toggleClass('menu-opened', !isOpened)
        .find('menu').fadeTo('fast', (isOpened ? 0 : 1), function () { $(this).toggle((isOpened ? false : true)); });
}


// On Copybook Selection Item selected
TheShodo.Shodo.Write.onCopybookItemClicked = function (e) {
    e.preventDefault();

    // select copybook
    $('#copybook-layer')
        .attr('class', $(this).attr('class'))
        .find('svg g')
            .fadeOut()
            .hide()
            .end()
        .find('#' + $(this).attr('class'))
            .fadeIn()
            .end();

    // mark
    $(this)
        .parent()
            .parent()
                .find('li')
                    .removeClass('selected')
                    .end()
                .end()
                .addClass('selected')
            .end()
        .end()
    ;
}