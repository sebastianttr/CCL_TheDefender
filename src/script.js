import {mainScene,defender,skyEnemiesShotCounter,groundEnemiesShotCounter} from "./SceneMain.js"
import SceneHandler from "./SceneHandler.js"
import {startMenuScene} from "./Scenes/SceneStart.js"

let sceneHandler = null;

window.addEventListener("load",() => {
    sceneHandler = new SceneHandler();
    sceneHandler.setScene(startMenuScene);
})



export {sceneHandler};