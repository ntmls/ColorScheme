/*global ColorClustering*/
var Selectors = (function() {
    
    var isColorSelected = function(state, color) {
        return ColorClustering.findColor(state.clusterColors.selectedColors, color);
    };
    
    var doesColorExist = function(state, color) {
        return ColorClustering.findColor(state.clusterColors.colors, color);
    };
    
    var getFile = function(state) {
        return state.chooseImage.file;
    };
    
    var isImageLoaded = function(state) {
        return state.chooseImage.imageLoaded;
    };
    
    return {
        isColorSelected: isColorSelected,
        doesColorExist: doesColorExist, 
        getFile: getFile,
        isImageLoaded: isImageLoaded
    };
    
})();