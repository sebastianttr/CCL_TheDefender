import GenericObject from "./Generics/GenericObject.js";
import {CONFIG,canvas,ctx,map} from "../commons.js"
import { defender } from "../index.js";

class SkyEnemy extends GenericObject{

    DISTANCE_DEFENDER = 150;
    health = 650;

    constructor(x,y,height,width, image,projectileDamage){
        super(x,y,height,width);
        this.image = image;
        this.projectileDamage = projectileDamage;
        this.startHealth = this.health;
        //this.health = 650;    
        this.velocityX = 0.1;    
        this.spriteDirection = 1;

        this.weaponAngle = 3 * Math.PI / 4;
        
        this.init();
    }

    init(){
        // nothing to do here ATM
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
    }

    render(){
        super.render();
        ctx.translate(this.x + this.width / 2, -this.y -this.height / 2 + 50);
        ctx.scale(this.spriteDirection,1);

        ctx.drawImage(
            this.image,
            -this.image.naturalWidth/2,
            this.image.naturalHeight/2,
            this.image.naturalWidth,
            this.image.naturalHeight
        );

        ctx.resetTransform();

        ctx.resetTransform();

        // draw health bar
        ctx.translate(
            this.x + this.image.naturalWidth / 2,
            this.y + 30
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
            Math.round(40 * (this.health/this.startHealth)),
            5
        )

        ctx.closePath();

        ctx.restore();
    
        ctx.resetTransform();
    }

    getBoundingBox(){    
        return {
            x: this.x,
            y: this.y + this.height/2 - 15,
            w: this.width,
            h: this.height,
        };
    }
}

export default SkyEnemy;

