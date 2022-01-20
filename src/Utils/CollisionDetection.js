import {CONFIG,ctx} from "../commons.js"

let checkCollisionBetween = (gameObjectA, gameObjectB) => {
    let bbA = gameObjectA.getBoundingBox();
    let bbB = gameObjectB.getBoundingBox();

    let collisionDetection = 
        bbA.x < bbB.x + bbB.w &&
        bbA.x + bbA.w > bbB.x &&
        CONFIG.canvas.height - bbA.y < CONFIG.canvas.height - bbB.y + bbB.h &&
        CONFIG.canvas.height - bbA.y + bbA.h > CONFIG.canvas.height - bbB.y

    return collisionDetection;
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

    console.log(distanceAToB_Left, distanceAToB_Right)
 
    // left si right
    if(distanceAToB_Left <= 0 && checkCollisionDirectional.distanceAToB_Left_Previous >= 0 && ((CONFIG.canvas.height - bbA.y - bbA.h >= CONFIG.canvas.height - bbB.y - bbB.h && CONFIG.canvas.height - bbA.y - bbA.h <= CONFIG.canvas.height - bbB.y) || (CONFIG.canvas.height - bbA.y <= CONFIG.canvas.height - bbB.y && CONFIG.canvas.height - bbA.y >= CONFIG.canvas.height - bbB.y - bbB.h )) ){
        return ["left", bbB.x - bbA.w ]
    }
    else if(distanceAToB_Right <= 0 && checkCollisionDirectional.distanceAToB_Right_Previous >= 0 && ((CONFIG.canvas.height - bbA.y - bbA.h >= CONFIG.canvas.height - bbB.y - bbB.h && CONFIG.canvas.height - bbA.y - bbA.h <= CONFIG.canvas.height - bbB.y) || (CONFIG.canvas.height - bbA.y <= CONFIG.canvas.height - bbB.y && CONFIG.canvas.height - bbA.y >= CONFIG.canvas.height - bbB.y - bbB.h )) ){
        return ["right", bbB.x + bbB.w ]
    }
    
    if(distanceAToB_Top <= 0 && checkCollisionDirectional.distanceAToB_Top_Previous >= 0  && bbA.x + bbA.w >= bbB.x && bbA.x <= bbB.x + bbB.w){
        return ["top", CONFIG.canvas.height - bbB.y - 50]
    }
    else if(distanceAToB_Bottom <= 0 && checkCollisionDirectional.distanceAToB_Bottom_Previous >= 0 && bbA.x + bbA.w >= bbB.x && bbA.x <= bbB.x + bbB.w){
        return ["bottom", CONFIG.canvas.height - bbB.y - bbB.h - 50 - bbA.h]
    }

    checkCollisionDirectional.distanceAToB_Left_Previous = distanceAToB_Left
    checkCollisionDirectional.distanceAToB_Right_Previous = distanceAToB_Right
    checkCollisionDirectional.distanceAToB_Top_Previous = distanceAToB_Top
    checkCollisionDirectional.distanceAToB_Bottom_Previous = distanceAToB_Bottom

    return []; // if nothing
}

export {checkCollisionBetween,checkCollisionDirectional}