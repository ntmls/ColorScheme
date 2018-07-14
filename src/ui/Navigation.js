var Steps = (function() {
    
    
    function ChooseImageStep() {
        this.previous = function(context) { }; 
        this.next = function(context) { 
            console.log("clusterColorStep");
            context.currentStep = clusterColorStep;
        }; 
    }
    
    function ClusterColorStep() {
        this.previous = function(context) { 
            console.log("chooseImageStep")
            context.currentStep = chooseImageStep;
        }; 
        this.next = function(context) {}; 
    }
    
    var context = new Context();
    var chooseImageStep = new ChooseImageStep();
    var clusterColorStep = new ClusterColorStep();
    context.currentStep = chooseImageStep;
    
    function Context() {
        var self = this;
        this.currentStep = null;
        this.previous = function(){ 
            self.currentStep.previous(self);
        }; 
        this.next = function() { 
            self.currentStep.next(self);
        }; 
    }

    return context;
    
})();