import GenericObject from "./Generics/GenericObject.js";
import { CONFIG,ctx } from "../commons.js";


class Laser extends GenericObject{
    constructor(x,y,height,width,){
        super(x,y,height,width);

        this.init();
    }

    init(){
        this.updateGradient();
    }

    updateGradient(){
        this.laserGradient1 = ctx.createLinearGradient(
            this.x,
            this.y + this.height/2,
            this.x + this.width/2,
            this.y + this.height/2,
        );
        this.laserGradient1.addColorStop(1, "red");
        this.laserGradient1.addColorStop(0, "white");


        this.laserGradient2 = ctx.createLinearGradient(
            this.x + this.width/2,
            this.y + this.height/2,
            this.x + this.width,
            this.y + this.height/2,
        );
        this.laserGradient2.addColorStop(0, "red");
        this.laserGradient2.addColorStop(1, "white");
        
    }

    update(){
        this.updateGradient();
    }

    render(){
        super.render();

        ctx.save();
        ctx.fillStyle = this.laserGradient1;
        ctx.fillRect(this.x,this.y,this.width/2,this.height);


        
        ctx.fillStyle = this.laserGradient2;
        ctx.fillRect(this.x + this.width/2,this.y,this.width/2,this.height);
        
        ctx.restore();
    }

    getBoundingBox(){    
        return {
            x: this.x,
            y: this.y,
            w: this.width,
            h: this.height,
        };
    }
}

export default Laser;
