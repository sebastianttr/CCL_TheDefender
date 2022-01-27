class Sprite {
    constructor(spritesheet, nFrames, fps , frameSize,options){
        this.spritesheet = spritesheet;
        this.nFrames = nFrames;
        this.fps = fps;
        this.frameSize = frameSize;
        this.options = options;
        this.spriteRampDone = false;
        this.spriteFrameIndex = 0;
        
        this.currentTimeStamp = 0;
    }
    
    getSpriteFrame(isReverse){
        let currentFrame; 

        if(this.options != undefined){
            if(this.options.ramp){
                if(this.startTime == undefined){
                    this.startTime = performance.now();
                    console.log("Starting now.")
                }
               
                if(this.currentTimeStamp >= this.nFrames){
                    console.log("Reached end.");
                    this.currentTimeStamp = this.nFrames  
                }
                else {
                    this.currentTimeStamp = (performance.now() - this.startTime) / 1000  * this.fps
                }

                console.log(this.currentTimeStamp)


                
                currentFrame = Math.floor((this.currentTimeStamp * this.fps)%this.nFrames);
            
            }
        }
        else {
            currentFrame = Math.floor(
                ((performance.now() / 1000) * this.fps) % this.nFrames
            );
        }
        

        return {
            sourceX: currentFrame * this.frameSize.width, // TODO
            sourceY: 0,
            sourceWidth: this.frameSize.width,
            sourceHeight: this.frameSize.height,
          };
    }
    getSpecificSpriteFrame(n){
        return {
            sourceX: n * this.frameSize.width, // TODO
            sourceY: 0,
            sourceWidth: this.frameSize.width,
            sourceHeight: this.frameSize.height,
        };
    }    
}

export default Sprite;