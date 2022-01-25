import GenericObject from "./Generics/GenericObject.js";
import {CONFIG,canvas,ctx,map} from "../commons.js"
import Sprite from "../Utils/Sprite.js";
import { defender } from "../index.js";

class GroundEnemy extends GenericObject{

    DISTANCE_DEFENDER = 450;
    health = 100;

    constructor(x,y,height,width, images, projectileDamage){
        super(x,y,height,width);
        this.dx = 0;
        this.spritesheets = images;
        this.projectileDamage = projectileDamage;
        this.translateState = "idle"
        //this.health = 100;
        this.velocityX = 0.2;
        this.spriteDirection = 1;

        this.headAngle = 0;
        this.armAngle = 0;

        this.sprites = {};

        this.init();
    }

    init(){
        this.sprites["idle"] = 
            new Sprite(
                this.spritesheets.groundEnemySpriteIdle,
                this.spritesheets.groundEnemySpriteIdle.extras.frames,
                this.spritesheets.groundEnemySpriteIdle.extras.fps,
                this.spritesheets.groundEnemySpriteIdle.extras.frameSize,
            )

        this.sprites["run"] = 
            new Sprite(
                this.spritesheets.groundEnemySpriteRun,
                this.spritesheets.groundEnemySpriteRun.extras.frames,
                this.spritesheets.groundEnemySpriteRun.extras.fps,
                this.spritesheets.groundEnemySpriteRun.extras.frameSize,
            )
    }

    update(timePassedSinceLastRender){

        // calculate distance to player
        let distanceToPlayer = Math.round(this.x - defender.x);
        this.spriteDirection = (defender.x >= this.x)?1:-1;

        // decide if it should move; plus minus 2 is for removing the jitter at certain points
        if(distanceToPlayer > this.DISTANCE_DEFENDER + 2){  
            this.dx = -1;
        } else if(distanceToPlayer < this.DISTANCE_DEFENDER-2){
            this.dx = 1;
        } else {
            this.dx = 0;
        }

        this.x += timePassedSinceLastRender * this.velocityX * this.dx

        let headPos = this.getPlayerHeadPosition();
        let oppositeLen = defender.getPlayerHeadPosition().y - headPos.y
        let adjacentLen = defender.getPlayerHeadPosition().x - headPos.x

        this.headAngle = Math.atan(oppositeLen/adjacentLen)


        let armPos = this.getPlayerArmPosition();
        oppositeLen = defender.getPlayerArmPosition().y - armPos.y
        adjacentLen = defender.getPlayerArmPosition().x - armPos.x  

        this.armAngle = Math.atan(oppositeLen/adjacentLen)

        this.setEnemyState();

    }

    setEnemyState(){
        if(this.dx != 0)        // run
            this.translateState = "run"
        else                    // idle
            this.translateState = "idle"
    }

    getPlayerHeadPosition() {
        return {
            x: this.x + this.spritesheets.groundEnemyHead.naturalWidth/2,
            y: -this.y - this.height + this.spritesheets.groundEnemyHead.naturalHeight/2 + 7 + CONFIG.canvas.height - 50   // WTF ???
        }
    }

    getPlayerArmPosition(){
        return {
            x:  this.x + this.spritesheets.groundEnemyHead.naturalWidth/2,
            y: -this.y + CONFIG.canvas.height - 50 - (this.height * 0.60)
        }
    }

    render(){
        super.render();
 
        // render head
        ctx.translate(
            this.getPlayerHeadPosition().x,
            this.getPlayerHeadPosition().y //+ this.headElevation
        );
        ctx.rotate(this.headAngle);
        ctx.scale(this.spriteDirection,1);
        ctx.drawImage(
            this.spritesheets.groundEnemyHead,
            -this.spritesheets.groundEnemyHead.naturalWidth/2,
            -this.spritesheets.groundEnemyHead.naturalHeight/2,
            this.spritesheets.groundEnemyHead.naturalWidth,
            this.spritesheets.groundEnemyHead.naturalHeight
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

        ctx.rotate(this.armAngle);
        ctx.scale(this.spriteDirection,1);

        ctx.drawImage(
            this.spritesheets.groundEnemyArm,
            -15,
            -20,
            this.spritesheets.groundEnemyArm.naturalWidth,
            this.spritesheets.groundEnemyArm.naturalHeight
        );

        ctx.resetTransform();

        // draw health bar
        ctx.translate(
            this.x +  this.spritesheets.groundEnemyHead.naturalWidth / 2,
            this.y - this.height - 20 + CONFIG.canvas.height - 50
        )

        ctx.save();

        ctx.lineWidth = "1";
        ctx.strokeStyle = "red";
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.strokeRect(
            -20,
            0,
            40,
            5
        );
        
        ctx.fillRect(
            -20,
            0,
            Math.round(40 * (this.health/100)),
            5
        )

        ctx.closePath();

        ctx.restore();
    
        ctx.resetTransform();

    }
}

export default GroundEnemy;
