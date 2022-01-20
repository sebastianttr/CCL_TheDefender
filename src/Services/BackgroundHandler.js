import {CONFIG , canvas, ctx} from "../commons.js";

// two modes to know about: 

class BackgroundHandler {
    constructor(backgroundImg, x,y, mode = "DOM"){
        this.backgroundImg = backgroundImg;

        this.offsetX = 0;
        this.offsetY = backgroundImg.height - canvas.getAttribute("height");

        
        this.x = x;
        this.y = y; 
     
        this.mode = mode;

        this.#init();
    }

    #init(){
        this.setBackgroundPosition(0, 0);
        this.changeBackgroundImg(this.backgroundImg);
    }

    setBackgroundPosition(x,y){
        if(this.mode === "DOM"){
            canvas.style.backgroundPosition = `${-x + this.offsetX}px ${y - this.offsetY}px`;
        }
        else { //canvas

            ctx.drawImage(
                this.backgroundImg, 
                -x + this.offsetX,
                y - this.offsetY
            )
            
        }
    }

    render(){
        ctx.drawImage(
            this.backgroundImg, 
            -this.x + this.offsetX,
            this.y - this.offsetY
        )
        ctx.resetTransform();
    }

    changeBackgroundImg(backgroundImg){
        if(this.mode === "DOM"){
            canvas.style.backgroundImage = `url(${backgroundImg.src})`;   
        }
        else{  //canvas

        }
    }
}

export default BackgroundHandler;