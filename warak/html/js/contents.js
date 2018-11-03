// pepper contents

Tapper.contents = {

    onLoad: function(param) {
        console.log("onLoad.");
    },

    onStart: function(param) {
        console.log("onStart.");
    },

    onPageSplash: function (param) {
        console.log("onPageSplash.");
    },

    onPageColor: function (param) {
        console.log("onPageColor.");
        bgColor1 = param.color1;
        bgColor2 = param.color2;
        bgColor3 = param.color3;
        var colorCode = 'rgb(' + bgColor1 + ',' + bgColor2 + ',' + bgColor3 + ')';
        console.log(colorCode);
        $('#PageColor').css('background-color', colorCode);
    },

    onPageImage: function (param) {
        console.log("onPageImage.");
        src = param.src;
        console.log(src);
        $('#PageImage').css('background-image', 'url(images/preloads/' + src + ')');
    }

}
