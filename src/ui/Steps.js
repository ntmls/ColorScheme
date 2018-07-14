var Steps = (function() {
    
    
    function ChooseImageStep() {
        this.previous = function(context) { }; 
        this.next = function(context) { 
            context.view.setTitle(context.CLUSTER_COLORS_TITLE);
            context.currentStep = clusterColorStep;
        }; 
    }
    
    function ClusterColorStep() {
        this.previous = function(context) { 
            context.view.setTitle(context.PICK_IMAGE_TITLE);
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
        this.PICK_IMAGE_TITLE = "Pick an Image";
        this.CLUSTER_COLORS_TITLE = "Cluster Colors";
        this.currentStep = null;
        this.setView = function(view) {
            this.view = view;
            view.setTitle(this.PICK_IMAGE_TITLE);
        };
        this.previous = function(){ 
            self.currentStep.previous(self);
        }; 
        this.next = function() { 
            self.currentStep.next(self);
        }; 
    }

    return context;
    
})();