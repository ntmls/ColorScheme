function View(document) {

    this.render = function (state) {
        
        var menuContainer = document.getElementById('menu-container');
        menuContainer.innerHTML = renderMenu(state);
        
        var contentContainer = document.getElementById('content');
        contentContainer.innerHTML = renderOriginalImage(
                Selectors.getFile(state), 
                Selectors.isImageLoaded(state)) + 
            renderPickImage(state) + 
            renderClusterColors(state) + 
            renderSuperPixels(state);
        
        drawScaledImage(state);
        renderQuantized(state);
        addEventListners(state);
    };

    // if the image was already loaaded then we don't want to trigger the loading of it again. Otherwise we get stuck in a loop between rendering and loading.
    var renderOriginalImage = function (file, imageLoaded) {
        if (imageLoaded) {
            return `<img src="${file}" id="original-image" hidden="true" />`;
        } else {
            return `<img src="${file}" id="original-image" hidden="true" onload="Actions.imageLoaded()" />`;
        }
    }
    
    var renderPickImage = function (state) {
        if (!state.navigation.showChooseImage) { return ''; }

        return `
            <div class="w3-container" id="choose-base-image" style="margin-top:75px">
                <h1 class="w3-xxxlarge w3-text-red"><b>Choose Base Image</b></h1>
                <hr style="width:50px;border:5px solid red" class="w3-round">
                <div>
                    <div class="fileUpload w3-button">
                        <span>Change Image</span>
                        <input type="file" id="file" class="upload" name="file" />
                    </div>
                    <div>
                        <canvas id="scaled-image"  width="${state.chooseImage.width}" height="${state.chooseImage.height}"></canvas>
                    </div>
                </div>
            </div>`;
    };

    var addEventListners = function (state) {
        if (state.navigation.showChooseImage) {
            var elem = document.getElementById("file");
            elem.onchange = Actions.openFile;
        } else if (state.navigation.showClusterColors) {
            var canvas = document.getElementById("quantized-image");
            canvas.addEventListener("mousedown", Actions.beginMouse, false);
            canvas.addEventListener("mouseup", Actions.endMouse, false);
        }
    };

    var drawScaledImage = function (state) {
        var canvas = document.getElementById('scaled-image');
        if (canvas != null) {
            var pic = document.getElementById('original-image');
            canvas.width = state.chooseImage.width;
            canvas.height = state.chooseImage.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(pic,
                0, 0, pic.width, pic.height,
                0, 0, state.chooseImage.width, state.chooseImage.height);
        }
    }

    var renderClusterColors = function (state) {
        if (!state.navigation.showClusterColors) { return ''; }
        return `
            <div class="w3-container" id="cluster-colors" style="margin-top:75px">
                <h1 class="w3-xxxlarge w3-text-red"><b>Cluster Colors</b></h1>
                <hr style="width:50px;border:5px solid red" class="w3-round">
                <div>
                    <input type="number" name="cluster-count" id="cluster-count" min="2" max="256" value="${state.clusterColors.colorCount}" />
                    <input type="button" id="go" name="go" value="Refresh" onClick="Actions.clusterColors()" />
                </div>
                <div id="colors-div">
                ${renderColors(state)}
                </div>
                <div>Error: ${state.clusterColors.error}</div>
                    <div>
                        <canvas id="quantized-image"  width="${state.chooseImage.width}" height="${state.chooseImage.height}"></canvas>
                    </div>
                </div>
            </div>`;
    };

    var renderColors = function (state) {
        var colors = state.clusterColors.colors.map(function (x) {
            var isSelected = Selectors.isColorSelected(state, x);
            var outline = isSelected ? "outline: 3px solid yellow; " : "";
            return `<div style="background-color: rgb(${x.red},${x.green},${x.blue}); width: 30px; height: 30px; display: inline-block; ${outline}margin: 2px" onclick="Actions.toggleColor(${x.red}, ${x.green}, ${x.blue})"></div>`
        });
        return colors.join("\n");
    };

    var renderQuantized = function (state) {
        if (state.navigation.showClusterColors && state.clusterColors.colors.length > 0) {
            var colors = state.clusterColors.colors;
            var canvas = document.getElementById('quantized-image');
            var bytes = state.chooseImage.imageData.data;
            var ctx = canvas.getContext('2d');
            var imageData = ctx.createImageData(state.chooseImage.imageData.width, state.chooseImage.imageData.height);
            var len = bytes.length;
            for (var i = 0; i < len; i = i + 4) {
                var color = new RgbColor(bytes[i], bytes[i + 1], bytes[i + 2]);
                var found = ColorClustering.findNearestColor(color, colors);
                var foundColor = new RgbColor(
                    colors[found].red, 
                    colors[found].green, 
                    colors[found].blue
                );
                var isSelected = Selectors.isColorSelected(state, foundColor);
                if (isSelected) {
                    imageData.data[i] = Math.floor(colors[found].red * .25 + 255 * .75);
                    imageData.data[i + 1] = Math.floor(colors[found].green * .25);
                    imageData.data[i + 2] = Math.floor(colors[found].blue * .25);
                    imageData.data[i + 3] = bytes[i + 3];
                } else {
                    imageData.data[i] = colors[found].red;
                    imageData.data[i + 1] = colors[found].green;
                    imageData.data[i + 2] = colors[found].blue;
                    imageData.data[i + 3] = bytes[i + 3];
                }
            }
            ctx.putImageData(imageData, 0, 0, 0, 0, canvas.width, canvas.height);
            if (state.clusterColors.rect.state === "complete") {
                ctx.strokeStyle = 'yellow';
                var rect = Selectors.getSelectedRect(state);
                ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
            }
        }
    }
    
    var renderSuperPixels = function(state) {
        if (!state.navigation.showSuperPixels) { return ''; }
        return `
          <div class="w3-container" id="super-pixels" style="margin-top:75px">
            <h1 class="w3-xxxlarge w3-text-red"><b>Super Pixels.</b></h1>
            <hr style="width:50px;border:5px solid red" class="w3-round">
            <button>Execute</button>
            <div id="super-pixels-container"></div>
          </div>`;
    }

}