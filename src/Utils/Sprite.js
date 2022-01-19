class Sprite {
    constructor(spritesheet, nFrames, fps , frameSize){
        this.spritesheet = spritesheet;
        this.nFrames = nFrames;
        this.fps = fps;
        this.frameSize = frameSize;
    }   
    
    getSpriteFrame(){
        let currentFrame = Math.floor(
            ((performance.now() / 1000) * this.fps) % this.nFrames
        );

        return {
            sourceX: currentFrame * this.frameSize.width, // TODO
            sourceY: 0,
            sourceWidth: this.frameSize.width,
            sourceHeight: this.frameSize.height,
          };
    }

    runSpriteOnce(){
        
    }


    
}

export default Sprite;