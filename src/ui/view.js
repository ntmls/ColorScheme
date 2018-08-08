function View(document) {

    this.render = function (state) {
        var container = document.getElementById('container');
        container.innerHTML =
            renderTitle(state.navigation.title) +
            renderOriginalImage(state.domain.file, state.domain.imageLoaded) + 
            renderPickImage(state) + 
            renderClusterColors(state) + 
            renderNavigationButtons(state);
        addEventListners(state);
        drawScaledImage(state);
        renderQuantized(state);
    };

    var renderTitle = function(title) {
        return `<div><h1>${title}</h1></div>`;
    }

    // if the image was already loaaded then we don't want to trigger the loading of it again. Otherwise we get stuck in a loop between rendering and loading.
    var renderOriginalImage = function (file, imageLoaded) {
        if (imageLoaded) {
            return `<img src="${file}" id="original-image" hidden="true" />`;
        } else {
            return `<img src="${file}" id="original-image" hidden="true" onload="Actions.imageLoaded()" />`;
        }
    }

    var renderNavigationButtons = function (state) {
        return `<div id="nav-div" style="float: right;" class="w3-section">
           ${renderNavigationButton("Previous", "Actions.previous()", state.navigation.showPrevious)}
           ${renderNavigationButton("Next", "Actions.next()", state.navigation.showNext)}
        </div>`;
    };

    var renderNavigationButton = function (text, action, visible) {
        if (!visible) { return ''; }
        return `<button class="w3-button w3-round" onclick="${action}">${text}</button>`;
    }

    var renderPickImage = function (state) {
        if (!state.navigation.showChooseImage) { return ''; }
        return `<div class="w3-section w3-card-4">
                  <div>
                    <div class="fileUpload w3-button">
                        <span>Change Image</span>
                        <input type="file" id="file" class="upload" name="file" />
                    </div>
                    <div>
                        <canvas id="scaled-image"  width="${state.domain.width}" height="${state.domain.height}"></canvas>
                    </div>
                </div>
            </div>`;
    };

    //var originalImageData;


    var addEventListners = function (state) {
        if (state.navigation.showChooseImage) {
            var elem = document.getElementById("file");
            elem.onchange = Actions.openFile;
        }
    };

    var drawScaledImage = function (state) {
        var canvas = document.getElementById('scaled-image');
        if (canvas != null) {
            var pic = document.getElementById('original-image');
            canvas.width = state.domain.width;
            canvas.height = state.domain.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(pic,
                0, 0, pic.width, pic.height,
                0, 0, state.domain.width, state.domain.height);
        }
    }

    var renderClusterColors = function (state) {
        if (!state.navigation.showClusterColors) { return ''; }
        return `<div class="w3-section w3-card-4">
                <div>
                    <input type="number" name="cluster-count" id="cluster-count" min="2" max="256" value="${state.domain.colorCount}" />
                    <input type="button" id="go" name="go" value="Go" onClick="Actions.clusterColors()" />
                </div>
                <div id="colors-div">
                ${renderColors(state)}
                </div>
                <div>
                    <canvas id="quantized-image"  width="${state.domain.width}" height="${state.domain.height}"></canvas>
                </div>
            </div>`;
    };

    var renderColors = function (state) {
        var colors = state.domain.colors.map(function (x) {
            var isSelected = findColor(state.domain.selectedColors, x);
            var outline = isSelected ? "outline: 5px solid yellow; " : "";
            return `<div style="background-color: rgb(${x.red},${x.green},${x.blue}); width: 30px; height: 30px; display: inline-block; ${outline}margin: 2px" onclick="Actions.toggleColor(${x.red}, ${x.green}, ${x.blue})"></div>`
        });
        return colors.join("\n");
    };

    var renderQuantized = function (state) {
        if (state.navigation.showClusterColors && state.domain.colors.length > 0) {
            var colors = state.domain.colors;
            var canvas = document.getElementById('quantized-image');
            var bytes = state.domain.imageData.data;
            var ctx = canvas.getContext('2d');
            var imageData = ctx.createImageData(state.domain.imageData.width, state.domain.imageData.height);
            var len = bytes.length;
            for (var i = 0; i < len; i = i + 4) {
                var color = new RgbColor(bytes[i], bytes[i + 1], bytes[i + 2]);
                var found = ColorScheme.findNearestColor(color, colors);
                imageData.data[i] = colors[found].red;
                imageData.data[i + 1] = colors[found].green;
                imageData.data[i + 2] = colors[found].blue;
                imageData.data[i + 3] = bytes[i + 3];
            }
            ctx.putImageData(imageData, 0, 0, 0, 0, canvas.width, canvas.height);
        }
    }

}