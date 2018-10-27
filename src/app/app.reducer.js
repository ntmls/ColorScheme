const PICK_IMAGE_TITLE = "Choose an Image";
const CLUSTER_COLORS_TITLE = "Cluster Colors";
const SUPER_PIXEL_TITLE = "Super Pixels";

const ACTION_INITIALIZE = 'initialize';
const ACTION_IMAGE_LOADED = 'image-loaded';
const ACTION_INITIALIZE_IMAGE_DATA = 'init-image-data';
const ACTION_CHANGE_IMAGE = 'change-image';
const ACTION_CLUSTER_COLORS = 'cluster-colors';
const ACTION_TOGGLE_COLOR = 'toggle-color';
const ACTION_BEGIN_MOUSE = 'begin-mouse';
const ACTION_END_MOUSE = 'end-mouse';
const ACTION_SELECT_COLORS_FROM_DATA = 'select-colors-from-data';

const ACTION_CLICK_CHOOSE_BASE_IMAGE = 'click-choose-base-image';
const ACTION_CLICK_CLUSTER_COLORS = 'click-custom-colors';
const ACTION_CLICK_SUPER_PIXELS = 'click-super-pixels';

var reducer = function (state, action) {
    return {
        logicalClock: state.logicalClock === undefined ? 0 : state.logicalClock += 1,
        navigation: menuReducer(state, action),
        chooseImage: chooseImageReducer(state, action),
        clusterColors: clusterColorsReducer(state, action)
    };
};

var chooseImageReducer = function(state, action) {
    switch (action.type) {
        case ACTION_INITIALIZE:
            var result = {};
            result.file = '';
            result.imageLoaded = false;
            result.imageData = null;
            result.width = 320;
            result.height = 240;
            return result;
            
        case ACTION_IMAGE_LOADED:
            var result = cloneChooseImage(state);
            result.imageLoaded = true;
            result.width = action.width;
            result.height = action.height;
            return result;
            
        case ACTION_INITIALIZE_IMAGE_DATA:
            var result = cloneChooseImage(state);
            result.imageData = action.imageData;
            return result;
            
        case ACTION_CHANGE_IMAGE:
            var result = cloneChooseImage(state);
            result.file = action.file;
            result.imageLoaded = false;
            result.colors = [];
            result.imageData = null;
            return result;
    }
    return state.chooseImage;;
};

var cloneChooseImage = function(state) {
    return {
        file: state.chooseImage.file,
        imageLoaded: state.chooseImage.imageLoaded,
        imageData: state.chooseImage.imageData,
        width: state.chooseImage.width,
        height: state.chooseImage.height
    };
}

var clusterColorsReducer = function(state, action) {
    switch (action.type) {
        case ACTION_INITIALIZE:
            var result = {};
            result.colorCount = 16;
            result.colors = [];
            result.selectedColors = [];
            result.error = 0;
            result.rect = {
                state: "inactive",
                start: { x: 0, y: 0 },
                end: { x: 0, y: 0 }
            }
            return result;
            
        case ACTION_CLUSTER_COLORS:
            var result = cloneClusterColors(state);
            result.colorCount = action.colorCount,
            result.colors = action.colors;
            result.selectedColors = [];
            result.error = Math.round(ColorClustering.calculateError(
                state.chooseImage.imageData.data, 
                action.colors) * 100000) / 1000;
            return result;
            
        case ACTION_TOGGLE_COLOR:
            var result = cloneClusterColors(state);
            var color = new RgbColor(action.red, action.green, action.blue);
            var isSelected = Selectors.isColorSelected(state, color);
            var exists = Selectors.doesColorExist(state, color);
            if (exists && !isSelected) {
                result.selectedColors = [ color, ...state.clusterColors.selectedColors ];
            } else {
                result.selectedColors = removeColor(state.clusterColors.selectedColors, color);
            }
            return result;
            
        case ACTION_BEGIN_MOUSE:
            var result = cloneClusterColors(state);
            result.rect.start.x = action.x;
            result.rect.start.y = action.y;
            result.rect.state = "started";
            return result;
            
        case ACTION_END_MOUSE:
            var result = cloneClusterColors(state);
            result.rect.end.x = action.x;
            result.rect.end.y = action.y;
            result.rect.state = "complete";
            return result;
            
        case ACTION_SELECT_COLORS_FROM_DATA:
            var result = cloneClusterColors(state);
            result.selectedColors = ColorClustering.selectColorsInSubImage(action.imageData.data, state.clusterColors.colors);
            return result;
    }
    return state.clusterColors;
};

var cloneClusterColors = function(state) {
    return {
        colorCount: state.clusterColors.colorCount,
        colors: state.clusterColors.colors,
        selectedColors: state.clusterColors.selectedColors,
        error: state.clusterColors.error, 
        rect: state.clusterColors.rect
    };
};


var removeColor = function(colors, color) {
    return colors.filter(function(x) {
        return !(
            x.red == color.red && 
            x.green == color.green && 
            x.blue == color.blue
        );
    });
};

