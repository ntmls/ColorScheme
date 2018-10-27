function Store(renderable, reducer) {
    var state = {};
    var updating = false;
    this.update = function (action) {
        if (updating) {
            throw "Recursive update detected."
        }
        try {
            updating = true;
            state = reducer(state, action);
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