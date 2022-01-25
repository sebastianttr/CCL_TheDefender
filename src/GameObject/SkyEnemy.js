import GenericObject from "./Generics/GenericObject.js";

class SkyEnemy extends GenericObject{
    constructor(x,y,height,width, spritesheets){
        super(x,y,height,width);
        this.spritesheets = spritesheets;
        this.projectileDamage = projectileDamage;
        this.health = 100;

        
        
        this.init();
    }

    init(){

    }

    update(){

    }

    render(){

    }
}

