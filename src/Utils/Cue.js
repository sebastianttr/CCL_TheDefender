/**
 * 
 * This will be my game framework called Cue
 * 
 */

class Cue {
    #init;
    #update;
    #render;
    lastTickTimestamp;
    assets = {};
    #requestAnimationFrameID;
    #run = false;

    constructor(setup){
        // set all the properties
        this.setupProperties = setup.setupProperties;

        // set all the lifecycle hooks
        this.#init = setup.init;

        this.#update = setup.update;

        this.#render = setup.render;

        // set methods and bind "this" context
        this.methods = setup.methods;

        this.preloads = setup.preloads;
    }

    start(){
        //preload objects - promise based
        this.preloadAssets().then(() => {
            this.#destructureProperties();
            this.#destructureMethods();

            this.#init();

            this.loop = this.loop.bind(this);
            this.lastTickTimestamp = performance.now();
            this.#run = true;
            this.loop();
        })
    }

    stop(){
        this.setupProperties = null;
        this.preloads = null;
        this.#run = false;
    }

    preloadAssets(){
        return new Promise( async (resolve,reject) => {
            for(let item in this.preloads){
                let asset = await this.#loadAssets(this.preloads[item].type,this.preloads[item].src);
                this.assets[item] = asset;

                if("extras" in this.preloads[item])
                    this.assets[item].extras = this.preloads[item].extras
            }
            resolve();
        })
    }

    #loadAssets(type,src){

        return new Promise((resolve,reject) => {
            let newAsset = new type;
            newAsset.src = src;
            newAsset.onload = () => {
                resolve(newAsset)
            }
        })
    }

    #destructureProperties(){
        for(let props in this.setupProperties){
            this[props] = this.setupProperties[props]
        }
    }
    
    #destructureMethods(){
        for(let methods in this.methods){
            this[methods] = this.methods[methods]
        }
    }

    loop(){
        //how much time has passed since the last tick


        let timePassedSinceLastRender = performance.now() - this.lastTickTimestamp;
        this.timePassedSinceLastRender = timePassedSinceLastRender;

        if(this.#run){
            this.#update(timePassedSinceLastRender);
            this.#render();
        }

        //set lastTickTimestamp to "now"
        this.lastTickTimestamp = performance.now();
        //call next iteration of the game loop
       
        this.#requestAnimationFrameID = requestAnimationFrame(this.loop);
        
    }
}

export default Cue;