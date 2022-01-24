import {CONFIG,ctx} from "../commons.js"

let checkCollisionBetween = (gameObjectA, gameObjectB) => {
    let bbA = gameObjectA.getBoundingBox();
    let bbB = gameObjectB.getBoundingBox();
  
    return (
      bbA.x < bbB.x + bbB.w &&
      bbA.x + bbA.w > bbB.x &&
      bbA.y < bbB.y + bbB.h &&
      bbA.y + bbA.h > bbB.y
    );
  };

// MADE BY SEBASTIAN AND STEFAN IN THE MIDDLE OF THE NIGHT 
let checkCollisionDirectional = (gameObjectA, gameObjectB) => {
    let bbA = gameObjectA.getBoundingBox();
    let bbB = gameObjectB.getBoundingBox();
    
    // left
    let distanceAToB_Left = (bbB.x) - (bbA.x + bbA.w)

    // right
    let distanceAToB_Right = (bbA.x) - (bbB.x + bbB.w)

    // top
    let distanceAToB_Top = (bbB.y) - (bbA.y + bbA.h)

    // bottom
    let distanceAToB_Bottom = (CONFIG.canvas.height - bbB.y - bbB.h) - (CONFIG.canvas.height - bbA.y)

    // left si right
    if(distanceAToB_Left <= 10) {
        if(distanceAToB_Left <= 0 && distanceAToB_Left + bbA.w / 4 > 0 && ((bbA.y >= bbB.y && bbA.y <= bbB.y + bbB.h) || (bbA.y + bbA.h >= bbB.y && bbA.y + bbA.h <= bbB.y + bbB.h ) || (bbB.y >= bbA.y && bbB.y + bbB.h <= bbA.y + bbA.h)) ){
            return ["left", bbB.x - bbA.w]
        }
    }
    
    if(distanceAToB_Right <= 10) {
        if(distanceAToB_Right <= 0 && distanceAToB_Right + bbA.w / 4 > 0 && ((bbA.y >= bbB.y && bbA.y <= bbB.y + bbB.h) || (bbA.y + bbA.h >= bbB.y && bbA.y + bbA.h <= bbB.y + bbB.h ) || (bbB.y >= bbA.y && bbB.y + bbB.h <= bbA.y + bbA.h)) ){
            return ["right", bbB.x + bbB.w]
        }
    }

    if(distanceAToB_Top <= 10) {
        if(distanceAToB_Top <= 0 && distanceAToB_Top + bbA.h / 4 > 0  && (bbA.x + bbA.w >= bbB.x && bbA.x <= bbB.x + bbB.w)){
            return ["top", CONFIG.canvas.height - bbB.y - 50]
        }
    }

    if(distanceAToB_Bottom <= 10) {
        if(distanceAToB_Bottom < 0 && distanceAToB_Bottom + bbA.h / 4 > 0 && (bbA.x + bbA.w >= bbB.x && bbA.x <= bbB.x + bbB.w)){
            return ["bottom", CONFIG.canvas.height - bbB.y - bbB.h - 50 - bbA.h]
        }
    }

    return []; // if nothing
}

export {checkCollisionBetween, checkCollisionDirectional}