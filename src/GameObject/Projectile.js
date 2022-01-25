import GenericObject from "./Generics/GenericObject.js";
import {CONFIG,canvas,ctx} from "../commons.js"


class Projectile extends GenericObject{
    constructor(x,y,height,width, start, end){
        super(x,y,height,width);
        this.startX = start.x;
        this.startY = start.y;

        this.endX = end.x; 
        this.endY = end.y;

        //this.dx = 1;    // tickrate
        //this.dy = 1;    // tickrate 

        this.distance = 0; // hypot

        this.projectileVelocity = 20;

        

        this.init();

    }

    init(){

        let newX = this.endX - this.startX;
        let newY = this.endY - this.startY;

        let distance = Math.sqrt(newX**2 + newY**2);

        newX = newX / distance;
        newY = newY / distance;

        this.dx = newX// * this.projectileVelocity;
        this.dy = newY

    }

    update(){
        this.x += (this.projectileVelocity ) * this.dx
        this.y += (this.projectileVelocity ) * this.dy;
    }

    
    getBoundingBox(){    
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            w: this.width,
            h: this.height,
        };
    }

    render(){
        super.render();
        ctx.save();

        ctx.fillStyle = "red";
        ctx.strokeStyle = "blue";
        ctx.lineWidth = "5"

        ctx.beginPath();
        ctx.arc(this.x, this.y, 10,0,Math.PI * 2, false);
        ctx.fill();
        ctx.stroke();

+
        ctx.restore();

     
        ctx.resetTransform();
    }
}

export default Projectile