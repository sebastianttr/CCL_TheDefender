class KeyboardHandler{
    keys = {};

    #keyDownCallbacks = {};
    #keyUpCallbacks = {};

    constructor(options){
        this.options = options;
        document.addEventListener("keydown",(event) => {
            event.preventDefault();

            if(!this.keys[event.code] && !options.nocallbacks)
                this.#callKeyUpCallbacks(event.code);

            this.keys[event.code] = true;

        })
        document.addEventListener("keyup",(event) => {

            if(this.keys[event.code] && !options.nocallbacks)
                this.#callKeyDownCallbacks(event.code);

            this.keys[event.code] = false;
        })
    }

    handleKey(keyCode,keyDown,keyUp,options){
        // add a new callback handler
        this.#keyDownCallbacks[keyCode] = keyDown;

        // add a new callback handler
        this.#keyUpCallbacks[keyCode] = keyUp;
        
    }

    #callKeyDownCallbacks(code){
        this.#keyDownCallbacks[code]();
    }

    #callKeyUpCallbacks(code){
        this.#keyUpCallbacks[code]();
    }
}

export default KeyboardHandler;