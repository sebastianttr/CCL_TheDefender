import {ctx, CONFIG} from "../commons.js"
import { defender,skyEnemiesShotCounter,groundEnemiesShotCounter } from "../SceneMain.js";

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
        height: 50,
        width: 100
    }

    digitSizing = 42 //px

    constructor(image1,image2,image3){
        this.image1 = image1;
        this.image2 = image2;
        this.image3 = image3;
    }

    update(){}

    getNumNDigits(num){
        return num.toString().length;
    }

    render(){
        ctx.save();


        // render sky enemies counter
        //console.log("Rendering!")
        let skyNumSizing = this.getNumNDigits(skyEnemiesShotCounter)-1;
        
        ctx.fillStyle = "black"
        ctx.fillRect(
            this.skyEnemyCounter.x - skyNumSizing * this.digitSizing,
            this.skyEnemyCounter.y,
            this.skyEnemyCounter.width,
            this.skyEnemyCounter.height
        )

        ctx.fillStyle = "white"

        ctx.fillRect(
            this.skyEnemyCounter.x + this.skyEnemyCounter.width/2,
            this.skyEnemyCounter.y,
            this.skyEnemyCounter.width/2 + this.digitSizing * skyNumSizing,
            this.skyEnemyCounter.height,
        )

        ctx.drawImage(
            this.image2,
            this.skyEnemyCounter.x + 5,
            this.skyEnemyCounter.y + 13,
            40,
            25
        )


        ctx.font = '50px Gamefont';
        ctx.textAlign = "center";
        ctx.fillStyle = "black"
        ctx.fillText(
            skyEnemiesShotCounter,
            this.skyEnemyCounter.x + 3 * this.skyEnemyCounter.width/4,
            this.skyEnemyCounter.y + this.skyEnemyCounter.width/2 - 5,
        )


        // render ground enemies counter

        let groundNumSizing = this.getNumNDigits(groundEnemiesShotCounter)-1;
        //console.log(groundNumSizing)

        ctx.fillStyle = "black"
        ctx.fillRect(
            this.groundEnemyCounter.x - groundNumSizing * this.digitSizing - skyNumSizing * this.digitSizing,
            this.groundEnemyCounter.y,
            this.groundEnemyCounter.width,
            this.groundEnemyCounter.height,
        )
        ctx.fillStyle = "white"

        ctx.fillRect(
            this.groundEnemyCounter.x + this.groundEnemyCounter.width/2 - groundNumSizing * this.digitSizing - skyNumSizing * this.digitSizing,
            this.groundEnemyCounter.y,
            this.groundEnemyCounter.width/2 + groundNumSizing * this.digitSizing,
            this.groundEnemyCounter.height,
        )

        
        ctx.drawImage(
            this.image1,
            this.groundEnemyCounter.x - 5,
            this.groundEnemyCounter.y + 5,
            40,
            40
        )


        ctx.font = '50px Gamefont';
        ctx.textAlign = "center";
        ctx.fillStyle = "black"
        ctx.fillText(
            groundEnemiesShotCounter,
            this.groundEnemyCounter.x + 3 * this.groundEnemyCounter.width/4 - (groundNumSizing * this.digitSizing)/2,
            this.groundEnemyCounter.y + this.groundEnemyCounter.width/2 - 5,
        )


        ctx.fillStyle = "black"

        // render health bar

        ctx.fillRect(
            30,
            20,
            300,
            5
        )

        ctx.fillStyle = "red"

     

        ctx.fillRect(
            30,
            10,
            300 * (defender.health / 1000),
            10
        )


        ctx.restore();
        ctx.resetTransform();
    }
}

export default UserInterface;