var Selectors = (function() {
    
    var isColorSelected = function(state, color) {
        return ColorScheme.findColor(state.domain.selectedColors, color);
    };
    
    var doesColorExist = function(state, color) {
        return ColorScheme.findColor(state.domain.colors, color);
    };
    
    return {
        isColorSelected: isColorSelected,
        doesColorExist: doesColorExist
    };
    
})();