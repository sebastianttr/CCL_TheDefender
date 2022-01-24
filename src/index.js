import Cue from "./Utils/Cue.js";
import {CONFIG , canvas, ctx} from "./commons.js";

import Defender from "./GameObject/Defender.js";
import BackgroundHandler from "./Services/BackgroundHandler.js";
import Vehicle from "./GameObject/Vehicle.js";
import Billboard from "./GameObject/Billboard.js";
import Crate from "./GameObject/Crate.js";
import { checkCollisionBetween,checkCollisionDirectional,  } from "./Utils/CollisionDetection.js";

let gameObjects = [];
let projectiles = [];
let collisionObjects = [];

const initGame = () => {
    let gameWorks = new Cue({
        preloads:{
            groundImg1:{
                src:"./Assets/sprites/landscape/Landscape_sprite_1.png",
                type: Image
            },
            vehicle1:{
                src:"./Assets/Vehicle1.png",
                type: Image
            },
            vehicle2:{
                src:"./Assets/Vehicle2.png",
                type: Image
            },
            billboard1:{
                src:"./Assets/Billboard_Platform_1.png",
                type: Image
            },
            billboard2:{
                src:"./Assets/Billboard_Platform_2.png",
                type: Image
            },
            billboard2:{
                src:"./Assets/Billboard_Platform_2.png",
                type: Image
            },
            crate1:{
                src:"./Assets/Moveable_Crate.png",
                type: Image
            },
            defenderHead: {
                src:"./Assets/TheDefender_head.png",
                type: Image
            },
            defenderArm: {
                src:"./Assets/TheDefender_arm.png",
                type: Image
            },
            playerSpriteIdle: {
                src:"./Assets/sprites/player/idle/spritesheet_idle.png",
                type: Image,
                extras: {
                    frames: 6,
                    fps: 12,
                    frameSize: {
                        width: 61,
                        height: 147,
                    },
                }
            },
            playerSpriteRun: {
                src:"./Assets/sprites/player/run/spritesheet_run.png",
                type: Image,
                extras: {
                    frames: 4,
                    fps: 8,
                    frameSize: {
                        width: 61,
                        height: 147,
                    },
                }
            },
            playerSpriteJump: {
                src:"./Assets/sprites/player/jump/spritesheet_jump.png",
                type: Image,
                extras: {
                    frames: 6,
                    fps: 12,
                    frameSize: {
                        width: 61,
                        height: 147,
                    },
                }
            }
        },
        setupProperties:{
            canvasHeight: CONFIG.canvas.height,
            canvasWidth: CONFIG.canvas.width,
            background: null,
            defender: null,
            canvasXPosition : 0,
            canvasYPosition : 0,
            isPlayerBounding:false,
            groundLevel:600,
        },
        init(){
            canvas.setAttribute("width", this.canvasWidth);
            canvas.setAttribute("height", this.canvasHeight);

            this.background = new BackgroundHandler(this.assets.groundImg1,0,0,"canvas");   

            this.defender = new Defender(100,200,61,147,{...this.assets},this.groundLevel);
            //this.gameObjects.push(this.defender);

            //gameObjects.push(new Vehicle(600, 0, this.assets.vehicle1.width, this.assets.vehicle1.height, this.assets.vehicle1))
            gameObjects.push(new Vehicle(600, 100, this.assets.vehicle1.width, this.assets.vehicle1.height, this.assets.vehicle1))
            gameObjects.push(new Vehicle(1500, 0, this.assets.vehicle2.width, this.assets.vehicle2.height, this.assets.vehicle2))
            gameObjects.push(new Vehicle(2500, 0, this.assets.vehicle2.width, this.assets.vehicle2.height, this.assets.vehicle2))

            gameObjects.push(new Crate(600 - this.assets.playerSpriteIdle.extras.frameSize.width - this.assets.crate1.width,0, this.assets.crate1.width, this.assets.crate1.height,this.assets.crate1))
            gameObjects.push(new Crate(1200,0, this.assets.crate1.width, this.assets.crate1.height,this.assets.crate1))

            gameObjects.push(new Billboard(1200, 0, this.assets.billboard1.width, this.assets.billboard1.height, this.assets.billboard1))
            gameObjects.push(new Billboard(2000, 0, this.assets.billboard2.width, this.assets.billboard2.height, this.assets.billboard2))
            gameObjects.push(new Crate(1200,0, this.assets.crate1.width, this.assets.crate1.height,this.assets.crate1))

        },
        update(timePassedSinceLastRender){

            this.defender.update(timePassedSinceLastRender);

            gameObjects.forEach((gameObject) => {
                if(
                    (checkCollisionDirectional(this.defender, gameObject)[0] == "left" 
                     || checkCollisionDirectional(this.defender, gameObject)[0] == "right") 
                     && gameObject instanceof Crate){
                     
                     if(checkCollisionDirectional(this.defender, gameObject)[0] == "left") {
                         gameObject.x = this.defender.x + this.defender.width + 1;
                     }
                     else if(checkCollisionDirectional(this.defender, gameObject)[0] == "right") {
                         gameObject.x = this.defender.x - gameObject.width - 1;
                     }
                 }
                 else{
                     if(checkCollisionDirectional(this.defender, gameObject)[0] === "left" && !(gameObject instanceof Billboard)){
                         this.defender.x = checkCollisionDirectional(this.defender, gameObject)[1]
                     } 
                     
                     
                     if(checkCollisionDirectional(this.defender, gameObject)[0] === "right" && !(gameObject instanceof Billboard)) 
                     {
                         this.defender.x = checkCollisionDirectional(this.defender, gameObject)[1]
                     }
                     
                     if(checkCollisionDirectional(this.defender, gameObject)[0] === "top" ) 
                     {
                         this.defender.y = checkCollisionDirectional(this.defender, gameObject)[1]
                         this.defender.velocityY = 0
                         
                         this.defender.canJump = true
                     }
                     
                     if(checkCollisionDirectional(this.defender, gameObject)[0] === "bottom" && !(gameObject instanceof Billboard)) 
                     {
                         this.defender.y = checkCollisionDirectional(this.defender, gameObject)[1]
                         this.defender.velocityY = 0
                         this.defender.canJump = false
                         
                     }
                 }
                gameObject.update(timePassedSinceLastRender);
            });


            let projectilesToRemove = [];
            
            projectiles.forEach((projectile)=> {
                if(projectile.x > CONFIG.canvas.width || projectile.x < 0 || projectile.y > CONFIG.canvas.height || projectile.y < 0 ){
                    projectilesToRemove.push(projectile)
                }
                else {
                    projectile.update();
                }
            })

            projectilesToRemove.forEach((projectile)=> {
                projectiles.splice(projectiles.indexOf(projectile),1)
                console.log("removed a projectile")
            })

            /*

            // old collision detection
            this.defender.update(timePassedSinceLastRender);

            //console.log(this.defender.collision)

            gameObjects.forEach((gameObject,index) => {

                if(checkCollisionBetween(this.defender,gameObject)){
                    
                    this.defender.collidingObject = gameObject;

                    if(gameObject instanceof Crate){
                        // Top and bottom 
                        this.handleCollisionVertical(index);

                        if(this.defender.dx == 1 
                            && this.defender.y == 0

                            ) {
                            gameObject.x = this.defender.x + this.defender.width;
                        }
                        else if(this.defender.dx == -1 
                            && this.defender.y == 0
                            ){
                       
                            gameObject.x = this.defender.x - gameObject.width;
                        }
                    }else {   
                        //left and right
                       this.handleCollisionHorizontal(index);

                        // Top and bottom 
                        this.handleCollisionVertical(index);
                      
                    }
                }
                else if(this.defender.collidingObject == gameObject){
                    this.defender.collidingObject = null;
                    this.defender.collision.left  = false;
                    this.defender.collision.right = false;
                    this.defender.collision.bottom  = false;
                    this.defender.collision.top = false;
                }
               
                gameObject.update(timePassedSinceLastRender);
            });      

            */
        },
        render(){
            ctx.resetTransform();
            ctx.clearRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

            // render ui elements


            // set scene position
            
         
            this.background = this.shiftObjectRelativeToPlayer(this.background , true);
            this.background.render();

        

            gameObjects.forEach((gameObject) => {  
                gameObject = this.shiftObjectRelativeToPlayer(gameObject,false)
                gameObject.render();                
            })

            projectiles.forEach((projectile)=> {
                projectile.render();
            })


            this.defender.render();
            // render UI here

        },
        methods:{
           shiftObjectRelativeToPlayer(gameObject,reverse){

                if(this.defender.boundingState == "right"){
                    if(this.background.x <= 
                        (this.background.backgroundImg.width - 4)-CONFIG.canvas.width){
                            if(reverse){
                                gameObject.x += 4; 
                            }
                            else {
                                gameObject.x -= 4;
                            }
                        } 
                }
                else if(this.defender.boundingState == "left"){
                    if(this.background.x >= 4){
                        if(reverse){
                            gameObject.x -= 4;
                        }else {
                            gameObject.x += 4;
                        }
                        
                    }      
                }
                return gameObject;
           },

           
           handleCollisionHorizontal(index){
                 //left and right
                if(this.defender.dx == -1 
                    && (this.defender.y == 0 || this.defender.dy != 0)
                    //&& !this.defender.collision.bottom
                    //&& !this.defender.collision.top
                    && !this.defender.collision.left) // going left
                {
                    this.defender.collision.left = true;
                    this.defender.collision.right = false;
                    //this.defender.collision.bottom = false;
                    //this.defender.collision.top = false;
                    console.log("Object " + index + ": left")
                }
                else if(this.defender.dx == 1 
                    && (this.defender.y == 0 || this.defender.dy != 0)
                    //&& !this.defender.collision.bottom
                    //&& !this.defender.collision.top
                    && !this.defender.collision.right) // going right
                {
                    this.defender.collision.left = false;
                    this.defender.collision.right = true;
                    //this.defender.collision.bottom = false;
                    //this.defender.collision.top = false;
                    console.log("Object " + index + ": right")
                }   
           },
           handleCollisionVertical(index){
                if(this.defender.dy == -1 
                    //&& !this.defender.collision.left
                    //&& !this.defender.collision.right
                    && !this.defender.collision.bottom) // going down
                {
                    this.defender.collision.bottom = true;
                    this.defender.collision.top = false;
                    //this.defender.collision.left = false;
                    //this.defender.collision.right = false;
                    console.log("Object " + index + ": bottom")
                }
                else if(this.defender.dy == 1 
                    //&& !this.defender.collision.left
                    //&& !this.defender.collision.right    
                    && !this.defender.collision.top) // going up
                {
                    this.defender.collision.bottom = false;
                    this.defender.collision.top = true;
                    //this.defender.collision.left = false;
                    //this.defender.collision.right = false;
                    console.log("Object " + index + ": top")
                }   
           }
           
        }
    })

    gameWorks.start();
}





window.addEventListener("load", () => {
    initGame();
})

export {gameObjects,projectiles}