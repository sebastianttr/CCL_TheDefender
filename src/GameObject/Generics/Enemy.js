import GenericObject from "./GenericObject.js";


class Enemy extends GenericObject{
    health = 100;       // percent

    constructor(x,y,height,width){
        super(x,y,height,width);

        this.health = 100;
    }
}


export default Enemy;

