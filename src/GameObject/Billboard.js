import GenericObject from "./Generics/GenericObject.js";
import {CONFIG,ctx} from "../commons.js"

class Billboard extends GenericObject{
    constructor(x,y,height,width, image){
        super(x,y,height,width);
        this.image = image;
    }

    render(){
        super.render();

        ctx.drawImage(
            this.image,
            this.x,
            - this.y - this.height + CONFIG.canvas.height - 50,
            this.width,
            this.height
        );  
    }
}

export default Billboard;