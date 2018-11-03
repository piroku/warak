// pepper contents

Tapper.contents = {

    onLoad: function (param) {
        console.log('onLoad.');
    },

    onStart: function (param) {

        console.log('onStart.');
        
        //タイムアウト開始
        Tapper.contents.timer = setTimeout(function () {
            alert("アプリを起動してください。");
            location.reload();
        }, 15000);

        setTimeout(function () {
            // Pepperに通知
            Tapper.utl.raiseEvent("Tapper/PCStart", 0);
        }, 1000);

        Tapper.utl.subscribeEvent("Tapper/PepperStart", function (id) {
            //タイムアウト停止
            clearTimeout(Tapper.contents.timer);
            Tapper.contents.isStart = true;
            console.log('タイムアウト停止');
            Tapper.view.changeScene('{"id":"SceneStart"}');
        });

    },

    onBtnSound: function (param) {
    },

    onSceneStart: function (param) {
        console.log("onSceneStart.");
    },

    onSceneDummy: function (param) {
        console.log("onScentDummy.");
    }
}

Tapper.functions = {


};
