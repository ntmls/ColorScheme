function Model(renderable, transition) {
    var state = {};
    var updating = false;
    this.update = function (action) {
        if (updating) {
            throw "Recursive update detected."
        }
        try {
            updating = true;
            state = transition(state, action);
            console.log(action);
            console.log(state);
            renderable.render(state);
        } finally {
            updating = false;
        }
    };
    this.initialize = function () {
        this.update({ type: 'initialize' });
    };
    this.getState = function () {
        return state;
    };
}