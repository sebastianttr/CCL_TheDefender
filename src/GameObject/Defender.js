import GenericObject from "./Generics/GenericObject.js";
import KeyboardHandler from "../Utils/KeyboardHandler.js";
import Sprite from "../Utils/Sprite.js";
import {CONFIG,canvas,ctx,map} from "../commons.js"
import { checkCollisionBetween, checkCollisionDirectional } from "../Utils/CollisionDetection.js";
import {gameObjects} from "../index.js"

class Defender extends GenericObject{
    #HAND_X = 38;       //px
    #HAND_Y = 21;       //px

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
        this.gravity =  6;

        this.mousePositions = {
            x:0,
            y:0,
        }

        this.headAngle = 0;
        this.headElevation = 0;

        this.armAngle = 0;
        this.handAngle = 0;

        this.boundingState="none";

        this.whichObjectToCollide = 0

        this.init();
    }

    init(){
        // set the key handler
        this.keyboardHandler = new KeyboardHandler({nocallbacks:true});

        canvas.addEventListener("mousemove",(e)=>{
            let clientRect = canvas.getBoundingClientRect();
            this.mousePositions.x = Math.round(e.clientX - clientRect.left)
            this.mousePositions.y = Math.round(e.clientY - clientRect.top)
            //console.log(this.mousePositions.x)
        })

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

        if(this.keyboardHandler.keys["ArrowLeft"] || this.keyboardHandler.keys["KeyA"]) this.dx = -1;
        else if (this.keyboardHandler.keys["ArrowRight"] || this.keyboardHandler.keys["KeyD"]) this.dx = 1;
        else this.dx = 0;

        // set direction
        //if(this.dx !== 0) this.spriteDirection = this.dx;

        // calc X pos
        this.x += 
            timePassedSinceLastRender * this.velocityX * this.dx

        // apply velocity on Space key press
        if((this.keyboardHandler.keys["Space"] || this.keyboardHandler.keys["KeyW"]) && this.velocityY == 0){
            this.velocityY =  50;
        }

        //calculate velocity
        this.velocityY -= timePassedSinceLastRender * this.gravity  / 50
        this.y +=  this.velocityY * timePassedSinceLastRender / 50


        // limit 
        if(this.y <= 0) {
            this.y = 0;
            this.velocityY = 0
        }
       
        // set player state for sprite
        this.setPlayerState();

        // get the bounding state
        this.boundingState = this.getBoundaries();

        //set pos of player depending on the bounding state
        if (this.boundingState == "left")           this.x = this.width;
        else if (this.boundingState == "right")     this.x = CONFIG.canvas.width - this.width * 2

       
        //calculate angle of head
        let headPos = this.getPlayerHeadPosition();
        let oppositeLen = this.mousePositions.y - headPos.y
        let adjacentLen = this.mousePositions.x - headPos.x

        this.headAngle = Math.atan(oppositeLen/adjacentLen)

        //calculate the angle for the hand to aim at the mouse point

        let armPos = this.getPlayerArmPosition();
        oppositeLen = this.mousePositions.y - armPos.yddd
        adjacentLen = this.mousePositions.x - armPos.x

        if(this.mousePositions.x >= armPos.x)
            this.armAngle = Math.atan(oppositeLen/adjacentLen)
        else this.armAngle = -1 * Math.atan(oppositeLen/adjacentLen)

        // calculate angle and pos of hand relative to arm pivot point
        const l = Math.round(Math.sqrt(Math.abs(this.mousePositions.x - armPos.x)**2 + Math.abs(this.mousePositions.y - armPos.y)**2))
        const a = Math.round(Math.sqrt(this.#HAND_Y**2 + this.#HAND_X**2));
        const c = Math.sqrt(this.#HAND_Y**2  + l**2);

        const alpha_rad = Math.asin(this.#HAND_Y / c);
        //const gamma_rad = Math.asin((c*Math.sin(alpha_rad))/a)
        const b = l - this.#HAND_X;
        const beta_rad = Math.asin(b*Math.sin(alpha_rad)/a)
        const gamma1_rad = Math.PI - alpha_rad - beta_rad;

        //console.log(gamma1_rad * 180 / Math.PI)

        //console.log(alpha_rad*180 /Math.PI)
        
        //this.handAngle = this.armAngle + gamma1_rad
    

        this.spriteDirection = (this.mousePositions.x >= headPos.x)?1:-1;
        
        this.headElevation = 10 * map(this.headAngle * this.spriteDirection,0,-Math.PI/2 * this.spriteDirection,0,this.spriteDirection);   // 10 seem like a good value to elevate between
        
    }

    getBoundaries(){
        if (this.x < this.width)                                            return "left";
        else if (this.x + this.width > CONFIG.canvas.width - this.width)    return "right";

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

    getPlayerHeadPosition() {
        return {
            x: this.x + this.spritesheets.defenderHead.naturalWidth/2,
            y: -this.y - this.height + this.spritesheets.defenderHead.naturalHeight/2 + 7 + CONFIG.canvas.height - 50   // WTF ???
        }
    }

    getPlayerArmPosition(){
        return {
            x:  this.x + this.spritesheets.defenderHead.naturalWidth/2,
            y: -this.y + CONFIG.canvas.height - 50 - (this.height * 0.60)
        }
    }

    getPlayerHandPosition() {

    }

    render() {
        super.render();
 
        // render head
        ctx.translate(
            this.getPlayerHeadPosition().x,
            this.getPlayerHeadPosition().y + this.headElevation
        );
        ctx.rotate(this.headAngle);
        ctx.scale(this.spriteDirection,1);
        ctx.drawImage(
            this.spritesheets.defenderHead,
            -this.spritesheets.defenderHead.naturalWidth/2,
            -this.spritesheets.defenderHead.naturalHeight/2,
            this.spritesheets.defenderHead.naturalWidth,
            this.spritesheets.defenderHead.naturalHeight
        );

        ctx.resetTransform();

       


        // render body
        ctx.translate(this.x + this.width / 2, -this.y -this.height / 2 + CONFIG.canvas.height - 50);
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


         // render arm
        ctx.translate(
            this.getPlayerArmPosition().x,
            this.getPlayerArmPosition().y
        )
        ctx.scale(this.spriteDirection,1);
        ctx.rotate(this.armAngle);

        ctx.drawImage(
            this.spritesheets.defenderArm,
            -10,
            -10,
            this.spritesheets.defenderArm.naturalWidth,
            this.spritesheets.defenderArm.naturalHeight
        );

        ctx.resetTransform();
    }

}

export default Defender;