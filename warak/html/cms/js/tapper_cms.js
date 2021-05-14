// This script is Automatic generation by tapper
var KEY_HEADER = "warak/cms/"

// Settings
var Tapper_Debug = false;
var Tapper_Debug_Host = "pepper.local";
var PROXY = ['ALMemory'];

var Tapper = Tapper || {}
Tapper.session = null;
Tapper.proxy = {}

/**
 * Core
 */
Tapper.core = function ($) {

    // image preload
    var _preload_img = function () {
        
        Tapper.utl.getData('Tablet/ImagePreload', function (data) {
            var images = data.split(';');
            $.each(images, function (i, src) {
                console.log($('<img>').attr('src', 'img/preloads/' + src));
            });
            Tapper.utl.raiseEvent('Tablet/Initialized', 1);
        }, function (data) {
            Tapper.utl.raiseEvent('Tablet/Initialized', 1);
        });
    };

    // connect alproxy.
    var _connect = function (callback) {
        var proxy_num = PROXY.length;

        var get_service = function (name) {
            Tapper.session.service(name).then(
                // onSuccess.
                function (proxy) {
                    Tapper.proxy[name] = proxy;
                    proxy_num--;
                    if (proxy_num <= 0) callback();
                },
                // onFailed.
                function (error) {
                    console.error(error);
                    result_func();
                }
            );
        };

        QiSession(function (session) {
            Tapper.session = session;

            for (index in PROXY) {
                get_service(PROXY[index]);
            }

        }, null, Tapper_Debug ? Tapper_Debug_Host : null);

        /* for NAO
        Tapper.session = new QiSession();
        for (index in PROXY) {
            get_service(PROXY[index]);
        }
        */

    };

    var _bind = function () {
        // bind events.
        Tapper.utl.subscribeEvent("Tapper/View/ChangeScene", function (id) {
            Tapper.view.changeScene(id);
        });

        Tapper.utl.subscribeEvent("Tapper/View/ButtonSelect", function (id) {
            Tapper.view.buttonSelect(id);
        });

        Tapper.utl.subscribeEvent("Tapper/View/ButtonTouchReset", function (id) {
            Tapper.view.buttonTouchReset(id);
        });
    };

    var _self = {
        init: function () {
            Tapper.view.init();
            Tapper.contents.onLoad();
            _connect(function () {
                _bind();
                Tapper.utl.getData("Tapper/InitData", function (data) {
                    Tapper.init_data = JSON.parse(data);
                    Tapper.contents.onStart();
                }, Tapper.contents.onStart);
                _preload_img();
                //Tapper.audio.init();
            });
        }
    };
    return _self;
}(jQuery);


/**
 * Common utility
 */
Tapper.utl = {
    raiseEvent: function (name, val) {
        var key = KEY_HEADER + name;
        Tapper.proxy.ALMemory.raiseEvent(key, val);
    },
    subscribeEvent: function (name, func) {
        var key = KEY_HEADER + name;
        var evt = new EventSubscription(key);
        Tapper.proxy.ALMemory.subscriber(key).then(function (sub) {
            evt.setSubscriber(sub);
            sub.signal.connect(func).then(function (id) {
                evt.setId(id);
            });
        });
        return evt;
    },
    getData: function (name, succeeded, failed) {
        var key = KEY_HEADER + name;
        Tapper.proxy.ALMemory.getData(key).then(succeeded, failed);
    }
};

/**
 * View utility
 */
Tapper.view = {
    init: function () {
        $(document).on('click', '[data-btn-id]', function () {
            var node = $(this);
            console.log(node.attr('data-btn-id'));
            var btn_method = 'on' + node.attr('id');
            try {
                Tapper.contents[btn_method]();
            } catch (e) {
                console.error(e);
                console.error("Undefined contents : " + btn_method + ".")
            }
            var result = '{ "id":' + '"' + node.attr('data-btn-id') + '"' + ', "data":' + '"' + node.attr('data') + '"' + '}';
            Tapper.utl.raiseEvent("Tapper/View/ButtonTouched", result);
        });
        $(document).on('click', '[event-name]', function () {
            var node = $(this);
            console.log(node.attr('event-name'));
            // var result = [node.attr('event-name'), node.attr('event-param')];
            var result = '{ "name":' + '"' + node.attr('event-name') + '"' + ', "param":' + '"' + node.attr('event-param') + '"' + '}';
            Tapper.utl.raiseEvent("Tapper/View/ButtonTouched", result);
        });
    },

    changeScene: function (request) {
        request = $.parseJSON(request);
        var scene_id = request.id;
        var scene_method = 'on' + scene_id;
        $('section#' + scene_id).show();
        $('section:not(#' + scene_id + ')').hide();
        try {
            Tapper.contents[scene_method](request);
        } catch (e) {
            console.error(e);
            console.error("Undefined scene : " + scene_id + ".")
        }
    },

    buttonSelect: function (id) {
        var scene_id = parseInt(id, 10);
        var node = $('[data-btn-id=' + scene_id + ']');
        if (node) {
            var result = '{ "id":' + '"' + node.attr('data-btn-id') + '"' + ', "data":' + node.attr('data') + '}';
            Tapper.utl.raiseEvent("Tapper/View/ButtonTouched", result);
        }
    },

    buttonReset: function (id) {
        //
    },

    buttonTouchReset: function (id) {
        // ボタン有効化
        $('input, button, [data-btn-id]').prop('disabled', false);
    }

};


/**
 * SubscribeEvent info class
 */
function EventSubscription(event) {
    this._event = event;
    this._internalId = null;
    this._sub = null;
    this._unsubscribe = false;
}
EventSubscription.prototype.setId = function (id) {
    this._internalId = id;
}
EventSubscription.prototype.setSubscriber = function (sub) {
    this._sub = sub;
}
EventSubscription.prototype.unsubscribe = function () {
    if (this._internalId != null && this._sub != null) {
        this._sub.signal.disconnect(this._internalId);
    } else {
        this._unsubscribe = true;
    }
}

$(Tapper.core.init);
