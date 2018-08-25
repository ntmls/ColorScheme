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
    
    var getSelectedRect = function(state) {
        return {
            x: state.clusterColors.rect.start.x,
            y: state.clusterColors.rect.start.y, 
            width: state.clusterColors.rect.end.x - state.clusterColors.rect.start.x,
            height: state.clusterColors.rect.end.y - state.clusterColors.rect.start.y
        };
    };
    
    return {
        isColorSelected: isColorSelected,
        doesColorExist: doesColorExist, 
        getFile: getFile,
        isImageLoaded: isImageLoaded, 
        getSelectedRect: getSelectedRect
    };
    
})();