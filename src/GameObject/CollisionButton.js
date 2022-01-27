import { CONFIG, ctx } from "../commons.js";
import GenericObject from "./Generics/GenericObject.js";

class CollisionButton extends GenericObject{

    constructor(x,y,width,height,textTop,textBottom){
        super(x,y,height,width);

        this.textTop = textTop;
        this.textBottom = textBottom;
        this.isHovering = false;

        this.init();
    }

    init(){

    }

    update(timePassedSinceLastRender){

    }

    getBoundingBox(){    
        return {
            x: this.x - 100,
            y: this.y - 100,
            w: 200,
            h: 200,
        };
    }

    render(){
        super.render();


        ctx.translate(this.x,this.y)

        ctx.save();
        ctx.lineWidth = "2"

        if(this.isHovering){
            ctx.strokeStyle = "black"
            ctx.fillStyle = "white"

            ctx.fillRect(
                -100,
                -100,
                200,
                200
            )

        
        }
        else {
            ctx.strokeStyle = "white"
            ctx.fillStyle = "black"
        }

        

        ctx.beginPath();
        ctx.strokeRect(
            -100,
            -100,
            200,
            200
        )
        ctx.font = "28px Gamefont";
        ctx.textAlign = "center";
        

        ctx.fillStyle = this.isHovering?"black":"white"

        ctx.fillText(
            this.textTop,
            0,
            0
        );

        ctx.font = '10px Gamefont';

        ctx.fillText(
            this.textBottom,
            0,
            30,
       
        );

        ctx.restore();

        ctx.resetTransform();



    }
}

export default CollisionButton;