import Cue from "../Utils/Cue.js";
import {ctx,CONFIG,canvas} from "../commons.js"
import CollisionButton from "../GameObject/CollisionButton.js";
import { checkCollisionBetween } from "../Utils/CollisionDetection.js";
import {sceneHandler} from "../script.js";
import {mainScene} from "../SceneMain.js"
import { startMenuScene } from "./SceneStart.js";
import Defender from "../GameObject/Defender.js";

let sceneLoss = new Cue(
    {
        preloads:{
            defenderHead: {
                src:"./Assets/TheDefender_head.png",
                type: Image
            },
            defenderArm: {
                src:"./Assets/TheDefender_arm2.png",
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
            },
            loseMenuImg: {
                src: "./Assets/YouLostMenu.png",
                type: Image
            }
        },
        setupProperties:{
            defenderEnd: null,
            button1:null,
            button2:null,
            sceneChange: false
        },
        init(){
            canvas.setAttribute("width", CONFIG.canvas.width);
            canvas.setAttribute("height", CONFIG.canvas.height);
            this.defenderEnd = new Defender(200,100,61,147,{...this.assets},100);
            this.button1 = new CollisionButton(CONFIG.canvas.width/2 - 200, CONFIG.canvas.height/2 + 100,0,0,"Restart","Jump here to restart");
            this.button2 = new CollisionButton(CONFIG.canvas.width/2 + 200, CONFIG.canvas.height/2 + 100,0,0,"To Menu","Jump here to return");
            console.log("Showing Win Scene")
            this.sceneChange = false
        },
        update(timeDelta){
            
            if(checkCollisionBetween(this.defenderEnd, this.button1)){
                this.button1.isHovering = true;
                //console.log("colision",this.defenderStart.dy)

                if(this.defenderEnd.y > this.defenderEnd.groundLevel && !this.sceneChange){
                    console.log("change scene")
                    sceneHandler.setScene(mainScene)
                    this.sceneChange = true
                    this.defenderEnd.allowShooting = false;
                    this.stop();
                }
            }
            else if(checkCollisionBetween(this.defenderEnd, this.button2)){
                this.button2.isHovering = true;
                //console.log("colision",this.defenderStart.dy)

                if(this.defenderEnd.y > this.defenderEnd.groundLevel && !this.sceneChange){
                    console.log("change scene")
                    sceneHandler.setScene(startMenuScene)
                    this.sceneChange = true
                    this.defenderEnd.allowShooting = false;
                    this.stop();
                }
            }
            else{
                this.button1.isHovering = false;
                this.button2.isHovering = false;
            } 

            this.defenderEnd.isPushing = false;
            this.defenderEnd.update(timeDelta);
        },
        render(){
            ctx.resetTransform();
            ctx.clearRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

            ctx.drawImage(
                this.assets.loseMenuImg,
                0,
                0,
                this.assets.loseMenuImg.naturalWidth,
                this.assets.loseMenuImg.naturalHeight
            )
            
            this.button1.render();
            this.button2.render();
            this.defenderEnd.render();
        }

    }
)

export {sceneLoss}