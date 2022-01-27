class SceneHandler {
    currentScene = null;
    currentSceneState = "";

    constructor(){}

    setScene(scene) {
        //stop current scene.
        if(this.currentScene != null){
            console.log("Stopping current scene")
            this.currentScene.stop();
        }
            
        this.currentScene = scene;
        this.currentScene.start();
    }

    initialiseScenary() {
        setScene();
    }
}

export default SceneHandler;