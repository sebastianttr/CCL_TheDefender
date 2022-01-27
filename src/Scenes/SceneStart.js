import Defender from "../GameObject/Defender.js";
import Cue from "../Utils/Cue.js";
import {ctx,CONFIG,canvas} from "../commons.js"
import CollisionButton from "../GameObject/CollisionButton.js";
import { checkCollisionBetween } from "../Utils/CollisionDetection.js";
import {sceneHandler} from "../script.js";
import {mainScene} from "../SceneMain.js"

let startMenuScene = new Cue(
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
            mainMenuImg: {
                src: "./Assets/MainMenu1.png",
                type: Image
            }
        },
        setupProperties:{
            defenderStart: null,
            button1:null,
            run:false
        },
        init(){
            canvas.setAttribute("width", CONFIG.canvas.width);
            canvas.setAttribute("height", CONFIG.canvas.height);
            this.defenderStart = new Defender(400,100,61,147,{...this.assets},100);
            this.button1 = new CollisionButton(CONFIG.canvas.width/2, CONFIG.canvas.height/2 + 100,0,0,"Start","Jump here to start");
            //console.log("Showing main menu screen")
            this.run = false;
        },
        update(timeDelta){
            if(checkCollisionBetween(this.defenderStart, this.button1)){
                this.button1.isHovering = true;
                //console.log("colision",this.defenderStart.dy)

                if(this.defenderStart.y > this.defenderStart.groundLevel && !this.run){
                    //console.log("change scene")
                    sceneHandler.setScene(mainScene)
                    this.defenderStart.stopMouseEvents();
                    this.run = true
                }
            }
            else{
                this.button1.isHovering = false;
            } 

            //console.log("Still updateing")
            this.defenderStart.update(timeDelta);
        },
        render(){
            // draw a grey background
            //console.log("Drawing img")
            ctx.resetTransform();
            ctx.clearRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);


            ctx.drawImage(
                this.assets.mainMenuImg,
                0,
                0,
                1280,
                this.assets.mainMenuImg.naturalHeight
            )
            
            this.button1.render();
            this.defenderStart.render();
        },

    }
)

export {startMenuScene}