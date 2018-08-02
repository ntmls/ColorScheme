const PICK_IMAGE_TITLE = "Pick an Image";
const CLUSTER_COLORS_TITLE = "Cluster Colors";

const ACTION_INITIALIZE = 'initialize';
const ACTION_PREVIOUS_SCREEN = 'previous-screen';
const ACTION_NEXT_SCREEN = 'next-screen';
const ACTION_IMAGE_LOADED = 'image-loaded';
const ACTION_INITIALIZE_IMAGE_DATA = 'init-image-data';
const ACTION_CHANGE_IMAGE = 'change-image';
const ACTION_CLUSTER_COLORS = 'cluster-colors';

var transition = function (oldState, action) {
    return {
        navigation: navigationTransition(oldState.navigation, action),
        domain: domainTransition(oldState.domain, action)
    };
};

var domainTransition = function (oldDomain, action) {
    if (oldDomain === undefined) { oldDomain = {}; }
    var newDomain = {
        file: oldDomain.file,
        imageLoaded: oldDomain.imageLoaded,
        imageData: oldDomain.imageData,
        width: oldDomain.width,
        height: oldDomain.height,
        colorCount: oldDomain.colorCount,
        colors: oldDomain.colors
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
            return newDomain;
    }
    return oldDomain;
}

var navigationTransition = function (oldState, action) {
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