import Cue from "../Utils/Cue.js";


let sceneWin = new Cue(
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
            defenderEnd: null,
            button:null,
            sceneChange: false
        },
        init(){
            canvas.setAttribute("width", CONFIG.canvas.width);
            canvas.setAttribute("height", CONFIG.canvas.height);
            this.defenderEnd = new Defender(400,100,61,147,{...this.assets},100);
            this.button = new CollisionButton(CONFIG.canvas.width/2, CONFIG.canvas.height/2 + 100);
            console.log("Showing Win Scene")
        },
        update(){
            
            if(checkCollisionBetween(this.defenderStart, this.button)){
                this.button.isHovering = true;
                //console.log("colision",this.defenderStart.dy)

                if(this.defenderStart.y > this.defenderStart.groundLevel && !this.sceneChange){
                    console.log("change scene")
                    sceneHandler.setScene(mainScene)
                    this.sceneChange = true
                    this.defenderStart = null
                    this.stop();
                }
            }
            else{
                this.button.isHovering = false;
            } 

            this.defenderStart.isPushing = false;
            this.defenderStart.update(timeDelta);
        },
        render(){

        }

    }
)