import GenericObject from "./Generics/GenericObject.js";
import KeyboardHandler from "../Utils/KeyboardHandler.js";
import Sprite from "../Utils/Sprite.js";
import {ctx} from "../commons.js"

class Defender extends GenericObject{
    constructor(x,y,height,width, spritesheets,groundLevel){
        super(x,y,height,width);

        this.sprites = {};
        this.spritesheets = spritesheets;
        this.groundLevel = groundLevel;

        this.dy = 0;
        this.dx = 0;
        this.frictionCoefficient = 0;
        this.velocity = 0.4;
        this.translateState = "idle";
        this.spriteDirection = 1;           // 1 = right ; -1 = left

        

        this.init();
    }

    init(){
        // set the key handler
        console.log("Setting ArrowUp handler");
        this.keyboardHandler = new KeyboardHandler({nocallbacks:true});

        this.sprites["idle"] = 
            new Sprite(
                this.spritesheets.playerSpriteIdle,
                this.spritesheets.playerSpriteIdle.extras.frames,
                this.spritesheets.playerSpriteIdle.extras.fps,
                this.spritesheets.playerSpriteIdle.extras.frameSize
            )

        this.sprites["run"] = 
            new Sprite(
                this.spritesheets.playerSpriteRun,
                this.spritesheets.playerSpriteRun.extras.frames,
                this.spritesheets.playerSpriteRun.extras.fps,
                this.spritesheets.playerSpriteRun.extras.frameSize
            )

        this.sprites["jump"] = 
            new Sprite(
                this.spritesheets.playerSpriteJump,
                this.spritesheets.playerSpriteJump.extras.frames,
                this.spritesheets.playerSpriteJump.extras.fps,
                this.spritesheets.playerSpriteJump.extras.frameSize
            )
    }

    update(timePassedSinceLastRender){
        if(this.keyboardHandler.keys["ArrowLeft"]) this.dx = -1;
        else if (this.keyboardHandler.keys["ArrowRight"]) this.dx = 1;
        else this.dx = 0;


        if(this.dx !== 0) this.spriteDirection = this.dx;


        if(this.translateState === "jump"){
            // handle jump with PhysicsEngine
        }

        this.x += 
            timePassedSinceLastRender * this.velocity * this.dx
        

        this.setPlayerState();

    }

    setPlayerState(){
        if(this.dx != 0)        // run
            this.translateState = "run"
        if(this.y != 0)         // jumping
            this.translateState = "jump"
        else                    // idle
            this.translateState = "idle"
    }

    render() {
        super.render();

        ctx.translate(100 + this.x,-this.y + this.groundLevel);

        ctx.scale(this.spriteDirection,1);

        let currentFrame = this.sprites["idle"].getSpriteFrame();

        ctx.drawImage(
            this.spritesheets.playerSpriteIdle,
            currentFrame.sourceX,
            currentFrame.sourceY,
            currentFrame.sourceWidth,
            currentFrame.sourceHeight,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );

        ctx.resetTransform();
        
    }

}

export default Defender;