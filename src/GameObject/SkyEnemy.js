import GenericObject from "./Generics/GenericObject.js";
import {CONFIG,canvas,ctx,map} from "../commons.js"
import { defender , projectiles } from "../index.js";
import Projectile from "./Projectile.js";
import Laser from "./Laser.js";

class SkyEnemy extends GenericObject{

    DISTANCE_DEFENDER = 0;
    projectileDamage = 30
    health = 650;

    BURST_INTERVAL = 3000 //ms 
    SHOT_INTERVAL = 400 //ms

    constructor(x,y,height,width, image,projectileDamage){
        super(x,y,height,width);
        this.image = image;
        this.projectileDamage = projectileDamage;
        this.startHealth = this.health;
        //this.health = 650;    
        this.velocityX = 0.1;    
        this.spriteDirection = 1;
        this.weaponAngle = 0;

        this.startTime = 0;
        this.laserTimeDelta = 0;
        this.deployLaser = false;

        this.laser = null;
     
        this.init();
    }

    init(){
        this.DISTANCE_DEFENDER -= this.image.naturalWidth / 2;
        this.startTime = performance.now();

        this.laser = new Laser(
            this.x + this.width/2 - 15,
            this.y + this.height/2,
            30,
            CONFIG.canvas.height - this.x + this.height - 50
        )
    }

    update(timePassedSinceLastRender){
        this.updateLaserPos();

        // calculate distance to player
        let distanceToPlayer = Math.round(this.x - defender.x);
        this.spriteDirection = (defender.x >= this.x+1)?1:-1;

        // decide if it should move; plus minus 2 is for removing the jitter at certain points
        if(distanceToPlayer > this.DISTANCE_DEFENDER + 2){  
            this.dx = -1;
        } else if(distanceToPlayer < this.DISTANCE_DEFENDER-2){
            this.dx = 1;
        } else {
            this.dx = 0;
        }

        this.x += timePassedSinceLastRender * this.velocityX * this.dx

        // shoot laser when defender is not moving.
        if(this.dx == 0 && !this.deployLaser){    
            this.laserTimeDelta = performance.now()-this.startTime

            if(this.laserTimeDelta > 3000){
                this.deployLaser = true;
                this.startTime = performance.now();
                //this.setLaserInstance();
            }
        }
        else if(this.deployLaser){
            this.laserTimeDelta = performance.now()-this.startTime

            if(this.laserTimeDelta > 5000){
                this.deployLaser = false;
                this.startTime = performance.now();
                //this.setLaserInstance();
            }
        }
        else{
            this.laserTimeDelta = 0;
            this.startTime = performance.now();
            //this.laser = null;
        }
    }

    updateLaserPos(){
        if(this.laser != null){
            this.laser.x = this.x + this.width/2 - 15;
            this.laser.y = this.y + this.height/2;
            this.laser.update();
        }
    }

    render(){
        super.render();

        if(this.deployLaser){
            this.laser.render();
        }


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

