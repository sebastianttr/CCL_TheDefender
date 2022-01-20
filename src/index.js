import Cue from "./Utils/Cue.js";
import {CONFIG , canvas, ctx} from "./commons.js";

import Defender from "./GameObject/Defender.js";
import BackgroundHandler from "./Services/BackgroundHandler.js";
import Vehicle from "./GameObject/Vehicle.js";
import Billboard from "./GameObject/Billboard.js";

let gameObjects = [];


const initGame = () => {
    let gameWorks = new Cue({
        preloads:{
            groundImg1:{
                src:"./Assets/sprites/landscape/Landscape_sprite_1.png",
                
                type: Image
            },
            vehicle1:{
                src:"./Assets/Vehicle1.png",
                type: Image
            },
            billboard1:{
                src:"./Assets/Billboard_Platform_1.png",
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
                    frames: 4,
                    fps: 8,
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
        setupProperties:{
            canvasHeight: CONFIG.canvas.height,
            canvasWidth: CONFIG.canvas.width,
            background: null,
            defender: null,
            canvasXPosition : 0,
            canvasYPosition : 0,
            isPlayerBounding:false,
            groundLevel:600,
        },
        init(){
            canvas.setAttribute("width", this.canvasWidth);
            canvas.setAttribute("height", this.canvasHeight);

            this.background = new BackgroundHandler(this.assets.groundImg1,0,0,"canvas");   

            this.defender = new Defender(100,0,61,147,{...this.assets},this.groundLevel);
            //this.gameObjects.push(this.defender);

            gameObjects.push(new Vehicle(600, 0, this.assets.vehicle1.width, this.assets.vehicle1.height, this.assets.vehicle1))


            gameObjects.push(new Billboard(1700, 0, this.assets.billboard1.width, this.assets.billboard1.height, this.assets.billboard1))
        },
        update(timePassedSinceLastRender){

            this.defender.update(timePassedSinceLastRender);

            gameObjects.forEach((gameObject) => {
                gameObject.update(timePassedSinceLastRender);
            });
        },
        render(){
            ctx.resetTransform();
            ctx.clearRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

            // render ui elements


            // set scene position
            
         
            this.background = this.shiftObjectRelativeToPlayer(this.background , true);
            this.background.render();

        

            gameObjects.forEach((gameObject) => {  
                gameObject = this.shiftObjectRelativeToPlayer(gameObject,false)
                gameObject.render();                
            })


            this.defender.render();
            // render UI here

        },
        methods:{
           shiftObjectRelativeToPlayer(gameObject,reverse){

                if(this.defender.boundingState == "right"){
                    if(this.background.x <= 
                        (this.background.backgroundImg.width - 4)-CONFIG.canvas.width){
                            if(reverse){
                                gameObject.x += 4; 
                            }
                            else {
                                gameObject.x -= 4;
                            }
                        } 
                }
                else if(this.defender.boundingState == "left"){
                    if(this.background.x >= 4){
                        if(reverse){
                            gameObject.x -= 4;
                        }else {
                            gameObject.x += 4;
                        }
                        
                    }      
                }

                return gameObject;
           }
        }
    })

    gameWorks.start();
}





window.addEventListener("load", () => {
    initGame();
})

export {gameObjects}