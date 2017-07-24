var infoVisible = false;
var optionsVisible = false;
var advancedVisible = false;
var mode = "default";
var btnDefault = document.getElementById("default");
var btnNoQR = document.getElementById("no-qr");
var btnNoSeed = document.getElementById("no-seed");

document.addEventListener("DOMContentLoaded", function(event) {
    var iota = new IOTA({
        'host': 'http://localhost',
        'port': 14265
    })

    var imageCanvas = document.getElementById('imageCanvas');
    var ctx = imageCanvas.getContext('2d');
    var seedCanvas;
    var addressCanvas;
    var seed;
    var address;
    var qr;

    ctx.font = "bold 32px Roboto";
    ctx.textAlign = "center";
    ctx.fillText("ENTER A SEED AND PRESS GENERATE:", 800, 250);
    ctx.fillText("81 CHARACTERS IN LENGTH, CONTAINING ONLY: UPPERCASE [A-Z] AND 9", 800, 350);

    function GenerateQR() {
        seed = document.getElementById('seed').value;

        seedCanvas = document.getElementById('seedCanvas');
        addressCanvas = document.getElementById('addressCanvas');

        var options = {};

        var sec = parseInt(document.getElementById('security-level').value);
        if (sec < 1 || sec > 3)
            sec = 2;

        options.index = parseInt(document.getElementById('index-num').value);
        options.security = sec;
        options.deterministic = "off";
        options.checksum = true;
        options.total = 1;
        validAdd = DisplayValid(seed);
        if (validAdd) {
            iota.api.getNewAddress(seed, options, function(e, add) {
                address = add;
                GeneratePaper();
            });
        } else {
            ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
            ctx.font = "bold 32px Roboto";
            ctx.textAlign = "center";
            ctx.fillText(msg, 800, 300);
        }
    }

    function GeneratePaper() {

        if (validAdd) {

            sQR = new QRious({
                element: seedCanvas,
                value: seed,
                size: 300,
                backgroundAlpha: 0
            });

            aQR = new QRious({
                element: addressCanvas,
                value: address[0],
                size: 300,
                backgroundAlpha: 0
            });

            ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

            var bg = new Image;
            bg.onload = function() {
                ctx.save();
                ctx.globalAlpha = 0.8;
                ctx.drawImage(bg, 0, 0, imageCanvas.width, imageCanvas.height);
                ctx.restore();
                if (mode != "no-qr")
                    ctx.drawImage(seedCanvas, 20, 60);
                ctx.drawImage(addressCanvas, 1280, 180);

                if (mode == "default") {
                    ctx.font = "bold 28px Roboto";
                    ctx.textAlign = "center";
                    ctx.fillText("PRIVATE SEED", 170, 400);
                    ctx.font = "bold 24.6px Roboto";
                    ctx.textAlign = "left";
                    ctx.fillText(seed, 20, 40);
                }

                ctx.textAlign = "center";
                ctx.font = "bold 28px Roboto";
                ctx.fillText("RECEIVING ADDRESS", 1430, 160);

                ctx.textAlign = "right";
                ctx.font = "bold 24.6px Roboto";
                ctx.fillText(address, 1580, 520);

                var img = new Image;
                img.onload = function() {
                    ctx.drawImage(img, 400, 114, 800, 300);
                };
                img.src = "img/logo.png";
            };
            bg.src = "img/bg.png";
        }

        document.getElementById("copy").style.visibility = "visible";
        document.getElementById("copy").innerHTML = "Generated Address: " + address;

    }

    function DisplayValid(seed) {
        msg = ""
        document.getElementById('validMessage').innerHTML = "";
        var val = true;

        if (seed == "" || seed.length > 81 || !seed.match(/^[A-Z9]*$/)) {
            msg = "THIS IS NOT A VALID SEED! CHARACTERS USED MUST BE ONLY UPPERCASE [A-Z] AND 9";
            document.getElementById('validMessage').innerHTML = msg;

            val = false;
        } else if (seed.length < 81 && seed != "") {
            msg = "This seed is less than 81 characters. For maximum security, use 81 characters.";
            document.getElementById('validMessage').innerHTML = msg;
        }
        return val;
    }

    function PrintWallet() {
        window.print();
    }

    document.getElementById("generate").addEventListener("click", GenerateQR);
    document.getElementById("print").addEventListener("click", PrintWallet);
});

function ExpandInfo() {
    var style = "hidden";
    if (!infoVisible) {
        style = "visible";
    }
    infoVisible = !infoVisible;

    document.getElementById("tooltiptext").style.visibility = style;
}

function ExpandOptions() {
    var style = "hidden";
    if (!optionsVisible) {
        style = "visible";
    } else {
        document.getElementById("advanced").style.visibility = "hidden";
        advancedVisible = false;
    }
    optionsVisible = !optionsVisible;

    document.getElementById("options").style.visibility = style;
}

function ExpandAdvanced() {
    var style = "hidden";
    if (!advancedVisible && optionsVisible) {
        style = "visible";
    }
    advancedVisible = !advancedVisible;

    document.getElementById("advanced").style.visibility = style;
}

function SetMode(m) {
    mode = m;
    document.getElementById("default").classList.remove("button-active");
    document.getElementById("no-qr").classList.remove("button-active");
    document.getElementById("no-seed").classList.remove("button-active");
    if (m == "default")
        document.getElementById("default").classList.add("button-active");
    else if (m == "no-qr")
        document.getElementById("no-qr").classList.add("button-active");
    else
        document.getElementById("no-seed").classList.add("button-active");
}