var infoVisible = false;
var optionsVisible = false;
var advancedVisible = false;
var mode = "default";
var btnDefault = document.getElementById("default");
var btnNoQR = document.getElementById("no-qr");
var btnNoSeed = document.getElementById("no-seed");
var btndiscreet = document.getElementById("discreet");

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
                address = add[0];
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
                value: address,
                size: 300,
                backgroundAlpha: 0
            });

            ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

            if (mode != "discreet") {
                var bg = new Image;
                bg.onload = function() {
                    ctx.save();
                    ctx.globalAlpha = 0.8;
                    ctx.drawImage(bg, 0, 0, imageCanvas.width, imageCanvas.height);
                    ctx.restore();
                    if (mode == "default" || mode == "address") {
                        ctx.drawImage(addressCanvas, 1280, 180);
                        if (mode == "default") {
                            ctx.drawImage(seedCanvas, 20, 60);
                        } else {
                            ctx.textAlign = "center";
                            ctx.font = "bold 28px Roboto";
                            ctx.fillText("RECEIVING ADDRESS", 1430, 160);
                        }
                    }

                    if (mode == "default" || mode == "no-qr") {
                        ctx.font = "bold 28px Roboto";
                        ctx.textAlign = "center";

                        var xPos = 170;
                        var yPos = 400;
                        if (mode == "no-qr") {
                            xPos = 110;
                            yPos = 80;
                        }
                        ctx.fillText("PRIVATE SEED", xPos, yPos);

                        ctx.font = "bold 24.6px Roboto";
                        ctx.textAlign = "left";
                        ctx.fillText(seed, 20, 40);

                        ctx.textAlign = "center";
                        ctx.font = "bold 28px Roboto";
                        xPos = 1430;
                        yPos = 160;
                        if (mode == "no-qr") {
                            xPos = 1445;
                            yPos = 480;
                        }
                        ctx.fillText("RECEIVING ADDRESS", xPos, yPos);
                    }

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
            } else {
                ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
                ctx.font = "bold 22px Roboto";
                ctx.textAlign = "center";
                ctx.fillText(seed, 800, 300);
            }
        }
        document.getElementById("copy").style.visibility = "visible";
        document.getElementById("copy").innerHTML = "Generated Address: " + address;
    }

    function DisplayValid(seed) {
        msg = ""
        document.getElementById('validMessage').innerHTML = "";
        var val = true;

        if (seed == "") {
            msg = "Specify seed below.";
            document.getElementById('validMessage').innerHTML = msg;
            val = false;
        } else if (!seed.match(/^[A-Z9]*$/)) {
            msg = "THIS IS NOT A VALID SEED! CHARACTERS USED MUST BE ONLY UPPERCASE [A-Z] AND 9.";
            document.getElementById('validMessage').innerHTML = msg;
            val = false;
        } else if (seed.length < 81) {
            msg = "This seed is less than 81 characters (" + seed.length + "). For maximum security, use 81 characters.";
            document.getElementById('validMessage').innerHTML = msg;
            val = false;
        }
        else if (seed.length > 81) {
            msg = "THIS IS NOT A VALID SEED! THIS SEED IS LONGER THAN 81 CHARACTERS (" + seed.length + ")";
            document.getElementById('validMessage').innerHTML = msg;
            val = false;
        }
        return val;
    }

    function PrintWallet() {
        document.title = "_";
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
    document.getElementById("address").classList.remove("button-active");
    document.getElementById("discreet").classList.remove("button-active");

    if (m == "default")
        document.getElementById("default").classList.add("button-active");
    else if (m == "no-qr")
        document.getElementById("no-qr").classList.add("button-active");
    else if (m == "address")
        document.getElementById("address").classList.add("button-active");
    else
        document.getElementById("discreet").classList.add("button-active");
}