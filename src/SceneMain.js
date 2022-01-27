import Cue from "./Utils/Cue.js";
import {CONFIG , canvas, ctx,map} from "./commons.js";

import Defender from "./GameObject/Defender.js";
import BackgroundHandler from "./Services/BackgroundHandler.js";
import Vehicle from "./GameObject/Vehicle.js";
import Billboard from "./GameObject/Billboard.js";
import Crate from "./GameObject/Crate.js";
import GroundEnemy from "./GameObject/GroundEnemy.js";
import SkyEnemy from "./GameObject/SkyEnemy.js";
import UserInterface from "./Utils/UserInterface.js";
import { checkCollisionBetween,checkCollisionDirectional,  } from "./Utils/CollisionDetection.js";

import {sceneHandler} from "./script.js";
import {sceneWin} from "./Scenes/SceneWin.js"
import SceneHandler from "./SceneHandler.js";
import { sceneLoss } from "./Scenes/SceneLose.js";


let defender = null;
let gameObjects = [];
let projectiles = [];
let skyEnemiesShotCounter = 0;
let groundEnemiesShotCounter = 0;

//const initMainGame = () => {
let mainScene = new Cue({
    preloads:{
        uiImage1:{
            src: "./Assets/ui_elements/ground_enemy_counter_icon.png",
            type: Image
        },
        uiImage2:{
            src: "./Assets/ui_elements/sky_enemy_counter_icon.png",
            type: Image
        },
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
        groundEnemyArm:{
            src: "./Assets/GroundEnemy_arm.png",
            type: Image
        },
        groundEnemyHead:{
            src: "./Assets/GroundEnemy_head.png",
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
        userInterface:null,
        canvasXPosition : 0,
        canvasYPosition : 0,
        isPlayerBounding:false,
        groundLevel:0,
        nEnemiesKilled: 0,
        initDone: false
    },
    init(){
        canvas.setAttribute("width", this.canvasWidth);
        canvas.setAttribute("height", this.canvasHeight);
        console.log("Running main init")

        gameObjects.length = 0;
        projectiles.length = 0;
        

        this.background = new BackgroundHandler(this.assets.groundImg1,0,0,"canvas");   

        defender = new Defender(100,200,61,147,{...this.assets},this.groundLevel);
        //this.gameObjects.push(this.defender);
        skyEnemiesShotCounter = 0;
        groundEnemiesShotCounter = 0;

        this.userInterface = new UserInterface(this.assets.uiImage1,this.assets.uiImage2,this.assets.head);

        //gameObjects.push(new Vehicle(600, 0, this.assets.vehicle1.width, this.assets.vehicle1.height, this.assets.vehicle1))
        gameObjects.push(new Vehicle(600, 100, this.assets.vehicle1.width, this.assets.vehicle1.height, this.assets.vehicle1))
        gameObjects.push(new Vehicle(1500, 0, this.assets.vehicle2.width, this.assets.vehicle2.height, this.assets.vehicle2))
        gameObjects.push(new Vehicle(2500, 0, this.assets.vehicle2.width, this.assets.vehicle2.height, this.assets.vehicle2))

        gameObjects.push(new Crate(600 - this.assets.playerSpriteIdle.extras.frameSize.width - this.assets.crate1.width,0, this.assets.crate1.width, this.assets.crate1.height,this.assets.crate1))
        gameObjects.push(new Crate(1200,0, this.assets.crate1.width, this.assets.crate1.height,this.assets.crate1))

        gameObjects.push(new Billboard(1200, 0, this.assets.billboard1.width, this.assets.billboard1.height, this.assets.billboard1))
        gameObjects.push(new Billboard(2000, 0, this.assets.billboard2.width, this.assets.billboard2.height, this.assets.billboard2))
        gameObjects.push(new Crate(1200,0, this.assets.crate1.width, this.assets.crate1.height,this.assets.crate1))

        //gameObjects.push(new GroundEnemy(400,0,61,147,{...this.assets},15));

        this.spawnGroundEnemiesAtBeginning();

        gameObjects.push(new SkyEnemy(200,0,230,129,this.assets.skyEnemy1,30))

        this.initDone = true;

    },
    update(timePassedSinceLastRender){
        defender.isPushing = false;

        defender.update(timePassedSinceLastRender);

        gameObjects.forEach((gameObject) => {
            if(
                (checkCollisionDirectional(defender, gameObject)[0] == "left" 
                    || checkCollisionDirectional(defender, gameObject)[0] == "right") 
                    && gameObject instanceof Crate){

                    
                    if(checkCollisionDirectional(defender, gameObject)[0] == "left") {
                        gameObject.x = defender.x + defender.width + 1;
                        defender.isPushing = true;

                    }
                    else if(checkCollisionDirectional(defender, gameObject)[0] == "right") {
                        gameObject.x = defender.x - gameObject.width - 1;
                        defender.isPushing = true;

                    }
                }
                else{

                    if(!(gameObject instanceof GroundEnemy)){
                    if(checkCollisionDirectional(defender, gameObject)[0] === "left" && !(gameObject instanceof Billboard)){
                        defender.x = checkCollisionDirectional(defender, gameObject)[1]
                    } 
                    
                    
                    if(checkCollisionDirectional(defender, gameObject)[0] === "right" && !(gameObject instanceof Billboard)) 
                    {
                        defender.x = checkCollisionDirectional(defender, gameObject)[1]
                    }
                    
                    if(checkCollisionDirectional(defender, gameObject)[0] === "top") 
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
                }

            gameObject.update(timePassedSinceLastRender);
        });


        let projectilesToRemove = [];
        let enemiesToRemove = [];
        
        projectiles.forEach(async (projectile)=> {
            if(projectile.x > this.assets.groundImg1.naturalWidth || projectile.x < 0 || projectile.y > CONFIG.canvas.height || projectile.y < 0 ){
                projectilesToRemove.push(projectile)
            }
            else if(checkCollisionBetween(projectile,defender) && !(projectile.shotFrom instanceof Defender)){
                projectilesToRemove.push(projectile)
                defender.health -= projectile.shotFrom.projectileDamage 
            }
            else {
                let markedForDelete = false
                gameObjects.forEach(async (gameObject) => {
                        if(checkCollisionBetween(projectile, gameObject) &&
                            (gameObject instanceof GroundEnemy || gameObject instanceof SkyEnemy) &&
                            !(projectile.shotFrom instanceof GroundEnemy)
                        ){
                            //console.log("Enemy hit.")
                            markedForDelete = true;
                            
                            //console.log(gameObject)
                            gameObject.health -= defender.projectileDamage;

                            projectilesToRemove.push(gameObject)
                            
                            if(gameObject.health <= 0){
                                enemiesToRemove.push(gameObject)
                                //skyEnemiesShotCounter++;

                                if(gameObject instanceof GroundEnemy)     groundEnemiesShotCounter++;      
                                else if(gameObject instanceof SkyEnemy)   skyEnemiesShotCounter++;  
                            }
                        }     
                        else if (
                            gameObject instanceof SkyEnemy && checkCollisionBetween(defender,gameObject.laser) && gameObject.deployLaser
                        ){
                            //console.log("Inside laser")
                            defender.health -= gameObject.projectileDamage
                            //groundEnemiesShotCounter++;
                        }
                    
                })

                if(!markedForDelete)
                    projectile.update();
            }
        })

        projectilesToRemove.forEach((projectile)=> {
            projectiles.splice(projectiles.indexOf(projectile),1)
            //console.log("removed a projectile")
        })


        enemiesToRemove.forEach((enemy) => {
            gameObjects.splice(gameObjects.indexOf(enemy),1);
            //console.log("Remove a enemy");
        })


        if(skyEnemiesShotCounter >= 1 && groundEnemiesShotCounter >= 16){
            //console.log("changing scene")
            sceneHandler.setScene(sceneWin);
            this.initDone = false
        }
        else if(defender.health <= 0){
            sceneHandler.setScene(sceneLoss);
        }
        
        this.userInterface.update();
    
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

        ctx.resetTransform();

        this.userInterface.render();
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
        spawnGroundEnemiesAtBeginning(){
            for(let i = 0; i < 16;i++){
                let newX = map(Math.random(),0,1,CONFIG.canvas.width, CONFIG.canvas.width*2);
                let distanceToDefender = map(Math.random(),0,1,400, 800);
                let enemyVelocity = map(Math.random(),0,1,0.1, 0.3)
                this.spawnGroundEnemy(newX,distanceToDefender,enemyVelocity)
            }
        },
        spawnGroundEnemy(x, distance, enemyVelocity){
            let newGroundEnemy = new GroundEnemy(
                x,
                0,
                61,
                148,
                {...this.assets},
                15
            )

            newGroundEnemy.DISTANCE_DEFENDER = distance
            newGroundEnemy.velocityX = enemyVelocity

            gameObjects.push(newGroundEnemy);
        }
        
    }
})


export {defender,gameObjects,mainScene,projectiles,skyEnemiesShotCounter, groundEnemiesShotCounter}