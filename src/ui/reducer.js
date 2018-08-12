const PICK_IMAGE_TITLE = "Pick an Image";
const CLUSTER_COLORS_TITLE = "Cluster Colors";

const ACTION_INITIALIZE = 'initialize';
const ACTION_PREVIOUS_SCREEN = 'previous-screen';
const ACTION_NEXT_SCREEN = 'next-screen';
const ACTION_IMAGE_LOADED = 'image-loaded';
const ACTION_INITIALIZE_IMAGE_DATA = 'init-image-data';
const ACTION_CHANGE_IMAGE = 'change-image';
const ACTION_CLUSTER_COLORS = 'cluster-colors';
const ACTION_TOGGLE_COLOR = 'toggle-color';

var reducer = function (state, action) {
    return {
        navigation: navigationReducer(state, action),
        chooseImage: chooseImageReducer(state, action),
        clusterColors: clusterColorsReducer(state, action)
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

var cloneNavigationState = function(state) {
    return {
        title: state.navigation.title,
        showPrevious: state.navigation.showPrevious,
        showNext: state.navigation.showNext,
        showChooseImage: state.navigation.showChooseImage,
        showClusterColors: state.navigation.showClusterColors
    };
};

var navigationReducer = function (state, action) {
    if (action.type == ACTION_INITIALIZE) {
        var result = {};
        result.title = PICK_IMAGE_TITLE;
        result.showPrevious = false;
        result.showNext = true;
        result.showChooseImage = true;
        result.showClusterColors = false;
        return result;
    }

    switch (state.navigation.title) {
        case PICK_IMAGE_TITLE:
            switch (action.type) {
                case ACTION_NEXT_SCREEN:
                    var result = {};
                    result.title = CLUSTER_COLORS_TITLE;
                    result.showPrevious = true;
                    result.showNext = false;
                    result.showChooseImage = false;
                    result.showClusterColors = true;
                    return result;
            }
            break;

        case CLUSTER_COLORS_TITLE:
            switch (action.type) {
                case ACTION_PREVIOUS_SCREEN:
                    var result = {};
                    result.title = PICK_IMAGE_TITLE;
                    result.showPrevious = false;
                    result.showNext = true;
                    result.showChooseImage = true;
                    result.showClusterColors = false;
                    return result;
            }
            break;
    }
    return state.navigation;
}

var cloneChooseImage = function(state) {
    return {
        file: state.chooseImage.file,
        imageLoaded: state.chooseImage.imageLoaded,
        imageData: state.chooseImage.imageData,
        width: state.chooseImage.width,
        height: state.chooseImage.height
    };
}
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

var cloneClusterColors = function(state) {
    return {
        colorCount: state.clusterColors.colorCount,
        colors: state.clusterColors.colors,
        selectedColors: state.clusterColors.selectedColors,
        error: state.clusterColors.error
    };
};

var clusterColorsReducer = function(state, action) {
    switch (action.type) {
        case ACTION_INITIALIZE:
            var result = {};
            result.colorCount = 16;
            result.colors = [];
            result.selectedColors = [];
            result.error = 0;
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
    }
    return state.clusterColors;
};