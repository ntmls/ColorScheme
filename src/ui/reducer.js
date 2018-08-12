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

var reducer = function (oldState, action) {
    return {
        navigation: navigationReducer(oldState.navigation, action),
        domain: domainReducer(oldState, action)
    };
};

var domainReducer = function (oldState, action) {
    var oldDomain = oldState.domain;
    if (oldDomain === undefined) { oldDomain = {}; }
    var newDomain = {
        file: oldDomain.file,
        imageLoaded: oldDomain.imageLoaded,
        imageData: oldDomain.imageData,
        width: oldDomain.width,
        height: oldDomain.height,
        colorCount: oldDomain.colorCount,
        colors: oldDomain.colors,
        selectedColors: oldDomain.colors, 
        error: oldDomain.error
    };
    switch (action.type) {
        case ACTION_INITIALIZE:
            newDomain.file = '';
            newDomain.imageLoaded = false;
            newDomain.imageData = null;
            newDomain.width = 320;
            newDomain.height = 240;
            newDomain.colorCount = 16;
            newDomain.colors = [];
            newDomain.selectedColors = [];
            newDomain.error = 0;
            return newDomain;
        case ACTION_IMAGE_LOADED:
            newDomain.imageLoaded = true;
            newDomain.width = action.width;
            newDomain.height = action.height;
            return newDomain;
        case ACTION_INITIALIZE_IMAGE_DATA:
            newDomain.imageData = action.imageData;
            return newDomain;
        case ACTION_CHANGE_IMAGE:
            newDomain.file = action.file;
            newDomain.imageLoaded = false;
            newDomain.colors = [];
            newDomain.imageData = null;
            return newDomain;
        case ACTION_CLUSTER_COLORS:
            newDomain.colorCount = action.colorCount,
            newDomain.colors = action.colors;
            newDomain.selectedColors = [];
            newDomain.error = Math.round(ColorClustering.calculateError(
                oldDomain.imageData.data, 
                action.colors) * 100000) / 1000;
            return newDomain;
        case ACTION_TOGGLE_COLOR:
            var color = new RgbColor(action.red, action.green, action.blue);
            var isSelected = Selectors.isColorSelected(oldState, color);
            var exists = Selectors.doesColorExist(oldState, color);
            if (exists && !isSelected) {
                newDomain.selectedColors = [ color, ...oldDomain.selectedColors ];
            } else {
                newDomain.selectedColors = removeColor(oldDomain.selectedColors, color);
            }
            return newDomain;

    }
    return oldDomain;
}

var removeColor = function(colors, color) {
    return colors.filter(function(x) {
        return !(
            x.red == color.red && 
            x.green == color.green && 
            x.blue == color.blue
        );
    });
};

var navigationReducer = function (oldState, action) {
    if (oldState === undefined) { oldState = {}; }

    if (action.type == ACTION_INITIALIZE) {
        return createPickImageState(oldState);
    }

    switch (oldState.title) {
        case PICK_IMAGE_TITLE:
            switch (action.type) {
                case ACTION_NEXT_SCREEN:
                    return createClusterColorsState(oldState);
            }
            break;

        case CLUSTER_COLORS_TITLE:
            switch (action.type) {
                case ACTION_PREVIOUS_SCREEN:
                    return createPickImageState(oldState);
            }
            break;
    }
    return oldState;
}

var createPickImageState = function(oldState) {

    // Clone the old state just in case there is more state than what we we are trying to deal with here.
    var newState = JSON.parse(JSON.stringify(oldState));

    newState.title = PICK_IMAGE_TITLE;
    newState.showPrevious = false;
    newState.showNext = true;
    newState.showChooseImage = true;
    newState.showClusterColors = false;
    return newState;
};

var createClusterColorsState = function(oldState) {

    // Clone the old state just in case there is more state than what we we are trying to deal with here.
    var newState = JSON.parse(JSON.stringify(oldState));

    newState.title = CLUSTER_COLORS_TITLE;
    newState.showPrevious = true;
    newState.showNext = false;
    newState.showChooseImage = false;
    newState.showClusterColors = true;
    return newState;
};