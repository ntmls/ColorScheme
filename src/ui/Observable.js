var Observables = (function() {
    
    function Subject() {
        this.observers = []; 
    }
    
    Subject.prototype.subscribe(observer) {
        this.observers.push(observer);
    };
    
    Subject.prototype.notify(message) {
        for (var i=0; i<this.observers.length; i++) {
            this.observers[i].update(message);
        }
    }
    
    function Observer() {
        this.update = function() {};   
    }
    
    return {
        createObserver: function() { return new Observer(); },
        createSubject: function() { return new Observer(); }
    };
})();