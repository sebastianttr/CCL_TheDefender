const CONFIG = {
    debug:false,
    canvas: {
        width:1280,
        height: 720
    },
    skyEnemiesLimit: 2,
    groundEnemiesLimit: 32
}

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const map = (value, min1, max1, min2, max2) => {
    return ((value - min1) * (max2 - min2)) / (max1 - min1) + min2;
}

export {CONFIG,canvas,ctx,map};

