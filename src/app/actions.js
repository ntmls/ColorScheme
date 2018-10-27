var Actions = (function () {

    var clickChooseBaseImage = function () {
        var action = { type: ACTION_CLICK_CHOOSE_BASE_IMAGE };
        store.update(action);
    }

    var clickClusterColors = function () {
        var action = { type: ACTION_CLICK_CLUSTER_COLORS };
        store.update(action);
    }
    
    var clickSuperPixels = function () {
        var action = { type: ACTION_CLICK_SUPER_PIXELS };
        store.update(action);
    }

    var imageLoaded = function () {
        var pic = document.getElementById('original-image');
        var scale = getScale(pic.width, pic.height, 640, 640);
        var action = {
            type: 'image-loaded',
            width: Math.floor(pic.width * scale),
            height: Math.floor(pic.height * scale)
        }
        store.update(action);

        // follow up action because the scaled image needs to be rendered before grabbing the bytes from it.
        initializeImageData(); 
    }

    var initializeImageData = function () {
        var canvas = document.getElementById('scaled-image');
        var ctx = canvas.getContext('2d');
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var action = {
            type: ACTION_INITIALIZE_IMAGE_DATA,
            imageData: imageData
        };
        store.update(action);
    };

    var getScale = function(sWidth, sHeight, tWidth, tHeight) {
        var scale = tWidth / sWidth;
        if (sHeight * scale > tHeight) {
            scale = tHeight / sHeight;
        }
        return scale;
    }

    var openFile = function(e) {
        try {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = readFile;
            reader.readAsDataURL(file);
        } catch (ex) {
            alert(ex.line);
        }
    }

    var readFile = function(e) {
        var action = {
            type: ACTION_CHANGE_IMAGE,
            file: e.target.result
        }
        store.update(action);
    }

    var clusterColors = function() {
        var count = document.getElementById('cluster-count').value;
        var state = store.getState();
        clusters = ColorClustering.clusterColors(state.chooseImage.imageData.data, count);
        var colors = clusters.map(function (x) { return x.color; });
        colors = ColorClustering.sortColors(colors); 
        var action = {
            type: ACTION_CLUSTER_COLORS, 
            colorCount: count,
            colors: colors
        }
        store.update(action);
    };
    
    var toggleColor = function(red,green,blue) {
        var action = {
            type: ACTION_TOGGLE_COLOR,
            red: red,
            green: green, 
            blue: blue
        }
        store.update(action);
    }
    
    var beginMouse = function(evt) {
        var action = {
            type: ACTION_BEGIN_MOUSE,
            x: evt.offsetX,
            y: evt.offsetY
        }
        store.update(action);
    }
    
    var endMouse = function(evt) {
        var action = {
            type: ACTION_END_MOUSE,
            x: evt.offsetX,
            y: evt.offsetY
        }
        store.update(action);
        var canvas = document.getElementById('quantized-image');
        var ctx = canvas.getContext('2d');
        var rect = Selectors.getSelectedRect(store.getState());
        var imageData = ctx.getImageData(rect.x, rect.y, rect.width, rect.height);
        action = {
            type: ACTION_SELECT_COLORS_FROM_DATA,
            imageData: imageData
        };
        store.update(action);
    }

    return {
        imageLoaded: imageLoaded,
        initializeImageData: initializeImageData,
        openFile: openFile,
        clusterColors: clusterColors, 
        toggleColor: toggleColor,
        beginMouse: beginMouse,
        endMouse: endMouse, 
        clickChooseBaseImage: clickChooseBaseImage,
        clickClusterColors: clickClusterColors,
        clickSuperPixels: clickSuperPixels
    }

})();