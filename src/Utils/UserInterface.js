import {ctx, CONFIG} from "../commons.js"
import { defender,skyEnemiesShotCounter,groundEnemiesShotCounter } from "../index.js";

class UserInterface {

    skyEnemyCounter = {
        x: CONFIG.canvas.width - 110,
        y: 10,
        height: 50,
        width: 100
    }

    groundEnemyCounter = {
        x: CONFIG.canvas.width - 230,
        y: 10,
        height: 40,
        width: 100
    }

    digitSizing = 35 //px

    constructor(){}

    update(){

    }

    getNumNDigits(num){
        return num.toString().length;
    }

    render(){
        ctx.save();
        //console.log("Rendering!")
        let skyNumSizing = this.getNumNDigits(skyEnemiesShotCounter);

        ctx.fillStyle = "black"
        ctx.fillRect(
            this.skyEnemyCounter.x,
            this.skyEnemyCounter.y,
            this.skyEnemyCounter.width * skyNumSizing,
            this.skyEnemyCounter.height,
        )
        ctx.fillStyle = "white"

        ctx.fillRect(
            this.skyEnemyCounter.x + this.skyEnemyCounter.width/2,
            this.skyEnemyCounter.y,
            this.skyEnemyCounter.width/2 * skyNumSizing,
            this.skyEnemyCounter.height,
        )


        ctx.font = '50px Gamefont';
        ctx.textAlign = "center";
        ctx.fillStyle = "black"
        ctx.fillText(
            skyEnemiesShotCounter,
            this.skyEnemyCounter.x + 3 * this.skyEnemyCounter.width/4,
            this.skyEnemyCounter.y + this.skyEnemyCounter.width/2 - 5,
        )

        let groundNumSizing = this.getNumNDigits(groundEnemiesShotCounter);
        //console.log(groundNumSizing)

        ctx.fillStyle = "black"
        ctx.fillRect(
            this.groundEnemyCounter.x,
            this.groundEnemyCounter.y,
            this.groundEnemyCounter.width,
            this.groundEnemyCounter.height,
        )
        ctx.fillStyle = "white"

        ctx.fillRect(
            this.groundEnemyCounter.x + this.groundEnemyCounter.width/2,
            this.groundEnemyCounter.y,
            this.groundEnemyCounter.width/2,
            this.groundEnemyCounter.height,
        )



        ctx.font = '50px Gamefont';
        ctx.textAlign = "center";
        ctx.fillStyle = "black"
        ctx.fillText(
            groundEnemiesShotCounter,
            this.groundEnemyCounter.x + 3 * this.groundEnemyCounter.width/4,
            this.groundEnemyCounter.y + this.groundEnemyCounter.width/2 - 5,
        )

        ctx.restore();
        ctx.resetTransform();
    }
}

export default UserInterface;