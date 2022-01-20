import GenericObject from "./Generics/GenericObject.js";
import KeyboardHandler from "../Utils/KeyboardHandler.js";
import Sprite from "../Utils/Sprite.js";
import {CONFIG,ctx} from "../commons.js"
import { checkCollisionBetween, checkCollisionDirectional } from "../Utils/CollisionDetection.js";
import {gameObjects} from "../index.js"

class Defender extends GenericObject{
    constructor(x,y,height,width, spritesheets,groundLevel){
        super(x,y,height,width);

        this.sprites = {};
        this.spritesheets = spritesheets;
        this.groundLevel = groundLevel;

        this.dy = 0;
        this.dx = 0;
        this.frictionCoefficient = 0;
        this.velocityX = 0.4;
        this.velocityY = 0;
        this.translateState = "idle";
        this.spriteDirection = 1;           // 1 = right ; -1 = left
        this.gravity =  2;

        this.boundingState="none";

        this.whichObjectToCollide = 0

        this.init();
    }

    init(){
        // set the key handler
        this.keyboardHandler = new KeyboardHandler({nocallbacks:true});

        this.sprites["idle"] = 
            new Sprite(
                this.spritesheets.playerSpriteIdle,
                this.spritesheets.playerSpriteIdle.extras.frames,
                this.spritesheets.playerSpriteIdle.extras.fps,
                this.spritesheets.playerSpriteIdle.extras.frameSize,
            )

        this.sprites["run"] = 
            new Sprite(
                this.spritesheets.playerSpriteRun,
                this.spritesheets.playerSpriteRun.extras.frames,
                this.spritesheets.playerSpriteRun.extras.fps,
                this.spritesheets.playerSpriteRun.extras.frameSize,
                //{ramp:true}
            )

        this.sprites["jump"] = 
            new Sprite(
                this.spritesheets.playerSpriteJump,
                this.spritesheets.playerSpriteJump.extras.frames,
                this.spritesheets.playerSpriteJump.extras.fps,
                this.spritesheets.playerSpriteJump.extras.frameSize,
                //{ramp:true}
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
            timePassedSinceLastRender * this.velocityX * this.dx

      

        if(this.keyboardHandler.keys["Space"] && this.velocityY == 0){
            this.velocityY =  50;
        }

        

        this.velocityY -= timePassedSinceLastRender * this.gravity  / 50
        this.y +=  this.velocityY * timePassedSinceLastRender / 50

      

        if(this.y <= 0) {
            this.y = 0;
            this.velocityY = 0
        }
       
        this.setPlayerState();

        this.boundingState = this.getBoundaries();

        if (this.x < this.width)                         this.x = this.width;
        if (this.x > CONFIG.canvas.width - this.width)   this.x = CONFIG.canvas.width - this.width

        let gameObject
        
            if(this.x >= gameObjects[0].x + gameObjects[0].width + 400) {
                this.whichObjectToCollide = 1

                console.log("da")

                gameObject = gameObjects[this.whichObjectToCollide]
            }
            else if(this.x < gameObjects[0].x + gameObjects[0].width + 400) {
                this.whichObjectToCollide = 0

                gameObject = gameObjects[this.whichObjectToCollide]
            }
            
        
            if(checkCollisionDirectional(this,gameObject)[0] === "left"){
                this.x = checkCollisionDirectional(this,gameObject)[1]
            }
            else if(checkCollisionDirectional(this,gameObject)[0] === "right") 
            {
                this.x = checkCollisionDirectional(this,gameObject)[1]
            }
            
            if(checkCollisionDirectional(this,gameObject)[0] === "top") 
            {
                this.y = checkCollisionDirectional(this,gameObject)[1]
                this.velocityY = 0
            }
            else if(checkCollisionDirectional(this,gameObject)[0] === "bottom") 
            {
                this.y = checkCollisionDirectional(this,gameObject)[1]
            }
        
    }

    getBoundaries(){
        if (this.x < this.width)                          return "left";
        if (this.x > CONFIG.canvas.width - this.width)    return "right";

        // if nothing else
        return "none";
    }

    setPlayerState(){
        if(this.dx != 0)        // run
            this.translateState = "run"
        else if(this.y != 0)    // jumping
            this.translateState = "jump"
        else                    // idle
            this.translateState = "idle"

    }

    render() {
        super.render();

        ctx.translate(this.x + this.width / 2, -this.y + -this.height / 2 + CONFIG.canvas.height - 50);

        ctx.scale(this.spriteDirection,1);

        let currentFrame = this.sprites[this.translateState].getSpriteFrame("up");

        ctx.drawImage(
            this.sprites[this.translateState].spritesheet,
            currentFrame.sourceX,
            currentFrame.sourceY,
            currentFrame.sourceWidth,
            currentFrame.sourceHeight,
            -this.width / 2, // destination x
            -this.height / 2, // destination y
            this.width,
            this.height
        );

        ctx.resetTransform();
    }

}

export default Defender;