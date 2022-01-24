import GenericObject from "./Generics/GenericObject.js";
import {CONFIG,ctx} from "../commons.js"

class Projectile extends GenericObject{
    constructor(x,y,height,width, start, end){
        super(x,y,height,width);
        this.image = image;
        this.startX = start.x;
        this.startY = start.y;

        this.endX = end.x; 
        this.endY = end.y;

        //this.dx = 1;    // tickrate
        //this.dy = 1;    // tickrate 

        this.distance = 0; // hypot

        this.projectileVelocity = 3;

        // fixed angle 
        this.angle = Math.atan(Math.abs(this.endY - this.startY) / Math.abs(this.endX - this.startX))


    }

    update(){
        this.distance = Math.sqrt(this.y**2 / this.x**2) * this.projectileVelocity

        this.x += this.distance * Math.cos(this.angle)
        this.y += this.distance * Math.sin(this.angle)
    }

    render(){

        ctx.strokeRect();

        ctx.resetTransform();
    }
}