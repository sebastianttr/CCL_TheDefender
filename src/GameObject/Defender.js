import GenericObject from "./Generics/GenericObject.js";
import KeyboardHandler from "../Utils/KeyboardHandler.js";
import Sprite from "../Utils/Sprite.js";
import Projectile from "./Projectile.js";
import {CONFIG,canvas,ctx,map} from "../commons.js"
import { checkCollisionBetween, checkCollisionDirectional } from "../Utils/CollisionDetection.js";
import {gameObjects,projectiles} from "../SceneMain.js"

class Defender extends GenericObject{
    #HAND_X = 38;       //px
    #HAND_Y = 21;       //px

    projectileDamage = 30;
    health = 1000;

    jumpHeight = 200 // this is taken from console

    constructor(x,y,height,width, spritesheets,groundLevel){
        super(x,y,height,width);

        this.sprites = {};
        this.spritesheets = spritesheets;
        this.groundLevel = groundLevel;

        this.dy = 0;
        this.dx = 0;
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

        this.boundingState="none";

        this.canJump = true
        this.isPushing = false;

        this.allowShooting = true;

        this.init();
    }

    handleMousePosition(e){
        let clientRect = canvas.getBoundingClientRect();
        this.mousePositions.x = Math.round(e.clientX - clientRect.left)
        this.mousePositions.y = Math.round(e.clientY - clientRect.top)   
    }

    handleMouseClick(e){
        let newProj = new Projectile(
            this.getPlayerArmPosition().x,
            this.getPlayerArmPosition().y,
            10,
            10,
            {
                x: this.getPlayerArmPosition().x,
                y: this.getPlayerArmPosition().y
            },
            {
                x: this.mousePositions.x,
                y: this.mousePositions.y
            }
        )

        newProj.shotFrom = this

        projectiles.push(newProj)
    }

    stopMouseEvents(){
        canvas.onmousemove = null;
        canvas.onmousedown = null;
    }

    init(){
        // set the key handler
        this.keyboardHandler = new KeyboardHandler({nocallbacks:true});

        canvas.onmousemove = this.handleMousePosition.bind(this)
        canvas.onmousedown = this.handleMouseClick.bind(this)

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
            )

        this.sprites["jump"] = 
            new Sprite(
                this.spritesheets.playerSpriteJump,
                this.spritesheets.playerSpriteJump.extras.frames,
                this.spritesheets.playerSpriteJump.extras.fps,
                this.spritesheets.playerSpriteJump.extras.frameSize,
            )
    }

    update(timePassedSinceLastRender){

        if(this.keyboardHandler.keys["ArrowLeft"] || this.keyboardHandler.keys["KeyA"]) this.dx = -1;
        else if (this.keyboardHandler.keys["ArrowRight"] || this.keyboardHandler.keys["KeyD"]) this.dx = 1;
        else this.dx = 0;

        // set direction
        //if(this.dx !== 0) this.spriteDirection = this.dx;
        this.velocityX = (this.isPushing)?0.01:0.4;
        //console.log(this.velocityX)

        // calc X pos
        this.x += 
            timePassedSinceLastRender * this.velocityX * this.dx

        // apply velocity on Space key press
        if((this.keyboardHandler.keys["Space"] || this.keyboardHandler.keys["KeyW"]) && this.velocityY == 0 && this.canJump){
            this.velocityY = 50;
        }

        //calculate velocity
        this.velocityY -= timePassedSinceLastRender * this.gravity  / 50
        this.y +=  this.velocityY * timePassedSinceLastRender / 50


        // limit 
        if(this.y <= this.groundLevel) {
            this.y = this.groundLevel;
            this.velocityY = 0
            this.canJump = true
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
        oppositeLen = this.mousePositions.y - armPos.y
        adjacentLen = this.mousePositions.x - armPos.x  

        this.armAngle = Math.atan(oppositeLen/adjacentLen)

        //console.log(this.armAngle)
    
        this.spriteDirection = (this.mousePositions.x >= headPos.x)?1:-1;
        
        this.headElevation = 10 * map(this.headAngle * this.spriteDirection,0,-Math.PI/2 * this.spriteDirection,0,this.spriteDirection);   // 10 seem like a good value to elevate between
        
        if(this.health <= 0){
            this.health = 0;
        }


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
        else if(Math.round(this.y - this.jumpHeight) >= 0){    // jumping{
            this.translateState = "jump"
            //console.log("Jump")
        }
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

        let currentFrame;


        if(this.translateState === "jump"){
            let frameNumber = Math.round(map(this.y - this.groundLevel,100,this.jumpHeight,1,4))
            //console.log(frameNumber)
            currentFrame = this.sprites[this.translateState].getSpecificSpriteFrame(frameNumber)
            currentFrame.sourceHeight += 20
        }
        else {
            currentFrame = this.sprites[this.translateState].getSpriteFrame("up");
        }

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

        //console.log(this.armAngle)
        ctx.rotate(this.armAngle);
        ctx.scale(this.spriteDirection,1);

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