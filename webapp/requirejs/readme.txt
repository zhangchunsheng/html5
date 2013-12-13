require.config({
    paths: {
         jquery: 'vendor/jquery-1.9.1.min',
        'jquery.mobile': 'vendor/jquery.mobile-1.3',
        'jquery.mobile-config': 'vendor/jquery.mobile.config',
        underscore: 'vendor/backbone/underscore',
        backbone: 'vendor/backbone/backbone',
        marionette: 'vendor/marionette/backbone.marionette',
        text: 'vendor/text'
    },

    shim: {
        underscore: {
            exports: '_'
        },

        backbone: {
            exports: 'Backbone',
            deps: ['jquery','underscore']
        },

        'jquery.mobile-config': ['jquery'],
        'jquery.mobile': ['jquery','jquery.mobile-config'],

        marionette: {
            exports: 'Backbone.Marionette',
            deps: ['backbone']
        }
    }
});

require(['jquery','app', 'jquery.mobile'], function ($, App) {
    $(function() {
        App.start();
    });
});

jquery.mobile.config
define(['jquery'], function ($) {
      $(document).bind("mobileinit", function () {
          $.extend(  $.mobile , {autoInitializePage: false});
          $.mobile.ajaxEnabled = false;
          $.mobile.linkBindingEnabled = false;
          $.mobile.hashListeningEnabled = false;
          $.mobile.pushStateEnabled = false;
      });
});

define(['jquery', 'marionette','text!templates/login.html'], function ($, marionette, ViewTemplate) {

    'use strict';

    var LoginView = marionette.ItemView.extend({

        template: _.template(ViewTemplate),

        events: {
            'click #login-btn': 'login'
        },

        login: function (event) {

            $.mobile.loading('show', {
                text: 'Please wait',
                textVisible: true
            });
        }
    });

    return LoginView;
});