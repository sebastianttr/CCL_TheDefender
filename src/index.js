import Cue from "./Utils/Cue.js";
import {CONFIG , canvas, ctx} from "./commons.js";

import Defender from "./GameObject/Defender.js";
import BackgroundHandler from "./Services/BackgroundHandler.js";
import Vehicle from "./GameObject/Vehicle.js";
import Billboard from "./GameObject/Billboard.js";
import Crate from "./GameObject/Crate.js";
import { checkCollisionBetween,checkCollisionDirectional,  } from "./Utils/CollisionDetection.js";


let defender = null;
let gameWorks = null;
let gameObjects = [];
let projectiles = [];
let collisionObjects = [];

const initGame = () => {
    gameWorks = new Cue({
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
                src:"./Assets/TheDefender_arm2.png",
                type: Image
            },
            skyEnemy1:{
                src:"./Assets/SkyEnemy_1.png",
                type: Image
            },
            skyEnemy2:{
                src:"./Assets/SkyEnemy_2.png",
                type: Image
            },
            skyEnemy3:{
                src:"./Assets/SkyEnemy_3.png",
                type: Image
            },
            groundEnemySpriteIdle: {
                src:"./Assets/sprites/enemy/spritesheet_enemy_idle.png",
                type: Image,
                extras: {
                    frames: 1,
                    fps: 1,
                    frameSize: {
                        width: 61,
                        height: 147,
                    },
                }
            },
            groundEnemySpriteRun:{
                src:"./Assets/sprites/enemy/spritesheet_enemy_run.png",
                type: Image,
                extras: {
                    frames: 9,  
                    fps: 12,
                    frameSize: {
                        width: 61,
                        height: 147,
                    },
                }
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
            canvasXPosition : 0,
            canvasYPosition : 0,
            isPlayerBounding:false,
            groundLevel:600,
        },
        init(){
            canvas.setAttribute("width", this.canvasWidth);
            canvas.setAttribute("height", this.canvasHeight);

            this.background = new BackgroundHandler(this.assets.groundImg1,0,0,"canvas");   

            defender = new Defender(100,200,61,147,{...this.assets},this.groundLevel);
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

            defender.update(timePassedSinceLastRender);

            gameObjects.forEach((gameObject) => {
                if(
                    (checkCollisionDirectional(defender, gameObject)[0] == "left" 
                     || checkCollisionDirectional(defender, gameObject)[0] == "right") 
                     && gameObject instanceof Crate){
                     
                     if(checkCollisionDirectional(defender, gameObject)[0] == "left") {
                         gameObject.x = defender.x + defender.width + 1;
                     }
                     else if(checkCollisionDirectional(defender, gameObject)[0] == "right") {
                         gameObject.x = defender.x - gameObject.width - 1;
                     }
                 }
                 else{
                     if(checkCollisionDirectional(defender, gameObject)[0] === "left" && !(gameObject instanceof Billboard)){
                         defender.x = checkCollisionDirectional(defender, gameObject)[1]
                     } 
                     
                     
                     if(checkCollisionDirectional(defender, gameObject)[0] === "right" && !(gameObject instanceof Billboard)) 
                     {
                        defender.x = checkCollisionDirectional(defender, gameObject)[1]
                     }
                     
                     if(checkCollisionDirectional(defender, gameObject)[0] === "top" ) 
                     {
                        defender.y = checkCollisionDirectional(defender, gameObject)[1]
                        defender.velocityY = 0
                         
                        defender.canJump = true
                     }
                     
                     if(checkCollisionDirectional(defender, gameObject)[0] === "bottom" && !(gameObject instanceof Billboard)) 
                     {
                        defender.y = checkCollisionDirectional(defender, gameObject)[1]
                        defender.velocityY = 0
                        defender.canJump = false
                         
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


            defender.render();
            // render UI here

        },
        methods:{
           shiftObjectRelativeToPlayer(gameObject,reverse){

                if(defender.boundingState == "right"){
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
                else if(defender.boundingState == "left"){
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
                if(defender.dx == -1 
                    && (defender.y == 0 || this.defender.dy != 0)
                    //&& !this.defender.collision.bottom
                    //&& !this.defender.collision.top
                    && !defender.collision.left) // going left
                {
                    defender.collision.left = true;
                    defender.collision.right = false;
                    //this.defender.collision.bottom = false;
                    //this.defender.collision.top = false;
                    console.log("Object " + index + ": left")
                }
                else if(defender.dx == 1 
                    && (defender.y == 0 || this.defender.dy != 0)
                    //&& !this.defender.collision.bottom
                    //&& !this.defender.collision.top
                    && !defender.collision.right) // going right
                {
                    defender.collision.left = false;
                    defender.collision.right = true;
                    //this.defender.collision.bottom = false;
                    //this.defender.collision.top = false;
                    console.log("Object " + index + ": right")
                }   
           },
           handleCollisionVertical(index){
                if(defender.dy == -1 
                    //&& !this.defender.collision.left
                    //&& !this.defender.collision.right
                    && !defender.collision.bottom) // going down
                {
                    defender.collision.bottom = true;
                    defender.collision.top = false;
                    //this.defender.collision.left = false;
                    //this.defender.collision.right = false;
                    console.log("Object " + index + ": bottom")
                }
                else if(defender.dy == 1 
                    //&& !this.defender.collision.left
                    //&& !this.defender.collision.right    
                    && !defender.collision.top) // going up
                {
                    defender.collision.bottom = false;
                    defender.collision.top = true;
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

export {defender,gameObjects,projectiles}