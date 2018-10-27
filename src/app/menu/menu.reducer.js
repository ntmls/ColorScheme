var menuReducer = function (state, action) {

    switch (action.type) {
        case ACTION_INITIALIZE:
            var result = {};
            result.title = PICK_IMAGE_TITLE;
            result.showChooseImage = true;
            result.showClusterColors = false;
            result.showSuperPixels = false
            return result;

        case ACTION_CLICK_CLUSTER_COLORS:
            var result = {};
            result.title = CLUSTER_COLORS_TITLE;
            result.showChooseImage = false;
            result.showClusterColors = true;
            result.showSuperPixels = false
            return result;

        case ACTION_CLICK_CHOOSE_BASE_IMAGE:
            var result = {};
            result.title = PICK_IMAGE_TITLE;
            result.showChooseImage = true;
            result.showClusterColors = false;
            result.showSuperPixels = false
            return result;

        case ACTION_CLICK_CHOOSE_BASE_IMAGE:
            var result = {};
            result.title = PICK_IMAGE_TITLE;
            result.showChooseImage = true;
            result.showClusterColors = false;
            result.showSuperPixels = false
            return result;
            
        case ACTION_CLICK_SUPER_PIXELS:
            var result = {};
            result.title = SUPER_PIXEL_TITLE;
            result.showChooseImage = false;
            result.showClusterColors = false;
            result.showSuperPixels = true;
            return result;
    }
    return state.navigation;
}