var Steps = (function() {
    
    var inherit = function(to, from) {
        for (var f in from.prototype) {
            if (to.prototype[f] == undefined) {
                to.prototype[f] = from.prototype[f];
            }
        }
    };
    
    function State() { };
    State.prototype.enter = function(context) { };
    State.prototype.exit = function(context) { };
    
    function StepState() { };
    inherit(StepState, State);
    StepState.prototype.previous = function(context) { };
    StepState.prototype.next = function(context) { };
    
    function ChooseImageStep() { }
    inherit(ChooseImageStep, StepState);
    ChooseImageStep.prototype.enter = function(context) {
        context.setTitle(context.PICK_IMAGE_TITLE);
    }
    ChooseImageStep.prototype.next = function(context) { ;
        context.setState(clusterColorStep);
    }; 
    
    function ClusterColorStep() { }
    inherit(ClusterColorStep, StepState);
    ClusterColorStep.prototype.enter = function(context) {
        context.setTitle(context.CLUSTER_COLORS_TITLE);
    }
    ClusterColorStep.prototype.previous = function(context) { 
        context.setTitle(context.PICK_IMAGE_TITLE);
        context.setState(chooseImageStep);
    }; 

    var chooseImageStep = new ChooseImageStep();
    var clusterColorStep = new ClusterColorStep();
    
    function Context(view) {
        
        // ----------- internals ----------------
        
        var _self = this;
        var _view = view;
        var _state = null;
        
        // -------- singletons / constants --------------
        
        this.PICK_IMAGE_TITLE = "Pick an Image";
        this.CLUSTER_COLORS_TITLE = "Cluster Colors";
        
        // -------  accessors -----------
        
        this.setState = function(state) {
            if (_state !== state) {
                if (_state !== null) {
                    _state.exit(_self);
                }
                _state = state;
                _state.enter(_self);
            }
        };
        /*
        this.setView = function(view) {
            _view = view;
            _state.enter();
        };
        */
        this.setTitle = function(title) {
            _view.setTitle(title);
        }
        
        // -------  actions -----------
        
        this.previous = function(){ 
            _state.previous(_self);
        }; 
        this.next = function() { 
            _state.next(_self);
        };
    }

    var createContext = function(view) {
        var context = new Context(view);  
        context.setState(chooseImageStep);
        return context;
    };
    return {
        createContext: createContext
    };
    
})();