const CONFIG = {
    debug:true,
    canvas: {
        width:1280,
        height: 720
    }
}

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

export {CONFIG,canvas,ctx};

