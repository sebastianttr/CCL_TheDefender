import GameWorks from "./Utils/GameWorks.js";
import {CONFIG , canvas, ctx} from "./commons.js";

import Defender from "./GameObject/Defender.js";
import BackgroundHandler from "./Services/BackgroundHandler.js";

const initGame = () => {
    let gameWorks = new GameWorks({
        setupProperties:{
            canvasHeight: CONFIG.canvas.height,
            canvasWidth: CONFIG.canvas.width,
            background: null,
            defender: null,
            gameObjects: [],
        },
        preloads:{
            groundImg1:{
                src:"./Assets/sprites/landscape/Landscape_sprite_1.png",
                type: Image
            },
            
            playerSpriteIdle: {
                src:"./Assets/sprites/player/idle/spritesheet_idle.png",
                type: Image,
                extras: {
                    frames: 6,
                    fps: 12,
                    frameSize: {
                        width: 61,
                        height: 147,
                    },
                }
            },
            playerSpriteRun: {
                src:"./Assets/sprites/player/run/spritesheet_run.png",
                type: Image,
                extras: {
                    frames: 6,
                    fps: 12,
                    frameSize: {
                        width: 61,
                        height: 147,
                    },
                }
            },
            playerSpriteJump: {
                src:"./Assets/sprites/player/jump/spritesheet_jump.png",
                type: Image,
                extras: {
                    frames: 6,
                    fps: 12,
                    frameSize: {
                        width: 61,
                        height: 147,
                    },
                }
            }
        },
        init(){
            canvas.setAttribute("width", this.canvasWidth);
            canvas.setAttribute("height", this.canvasHeight);

            this.background = new BackgroundHandler(this.assets.groundImg1);   

            this.defender = new Defender(100,0,61,147,{...this.assets},600);
            this.gameObjects.push(this.defender);

        },
        update(timePassedSinceLastRender){
            this.gameObjects.forEach((gameObject) => {
                gameObject.update(timePassedSinceLastRender);
            });
        },
        render(){
            ctx.resetTransform();
            ctx.clearRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

            this.gameObjects.forEach((gameObject) => {
                gameObject.render();
            })
        },
        methods:{
           
        }
    })

    gameWorks.start();
}




window.addEventListener("load", () => {
    initGame();
})