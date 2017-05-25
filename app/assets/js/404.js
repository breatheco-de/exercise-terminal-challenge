// js source http://codepen.io/moklick/pen/zKleC  

var Application = ( function () {
        var canvas;
        var ctx;
        var imgData;
        var pix;
        var WIDTH;
        var HEIGHT;
        var flickerInterval;

        var init = function () {
            canvas = document.getElementById('canvas');
            ctx = canvas.getContext('2d');
            canvas.width = WIDTH = 700;
            canvas.height = HEIGHT = 500;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            ctx.fill();
            imgData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
            pix = imgData.data;
            flickerInterval = setInterval(flickering, 30);
        };

        var flickering = function () {
            for (var i = 0; i < pix.length; i += 4) {
                var color = (Math.random() * 255) + 50;
                pix[i] = color;
                pix[i + 1] = color;
                pix[i + 2] = color;
            }
            ctx.putImageData(imgData, 0, 0);
        };

        return {
            init: init
        };
    }());

    Application.init();