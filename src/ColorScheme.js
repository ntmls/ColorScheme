/* global RgbColor, ColorSorter, _ */
var ColorScheme = (function() {

    var clusterColors = function(bytes, n) {
        var clusters = createClusters(bytes, n),
            newClusters, distances;

        for (var i = 0; i < 200; i = i + 1) {
            newClusters = iterate(bytes, clusters);
            distances = _.zip(clusters, newClusters)
                .map(function (pair) {
                    var color1, color2;
                    color1 = pair[0].color;
                    color2 = pair[1].color;
                    let dist = color1.distanceFromSquared(color2);
                    if (isNaN(dist)) {
                        throw "Invalid distance."
                    }
                    return dist;
                });
            if (_.every(distances, function (d) { return d == 0; })) {
                console.log("Stoped clustering - no changes (" + i + ")");
                break;
            }
            clusters = newClusters;
        }
        return newClusters;
    };

    // --------- clustering -----------------

    var createClusters = function(bytes, n) {
        var c = bytes.length / 4
        var result = [];
        for (var i = 0; i < n; i = i + 1) {
            var r = Math.floor(Math.random() * c);
            var color = new RgbColor(
                bytes[r * 4],
                bytes[r * 4 + 1],
                bytes[r * 4 + 2]);
            var sums = new RgbColor(0,0,0);
            result.push(
                {
                    name: i,
                    color: color,
                    count: 1,
                    sum: sums
                });
        }
        return result;
    };
    
    // --------------- Color Sorting (exaustive search) -------
    
    function ExaustiveColorSorter() {
        var bestDistance;
        var bestPath;
        var sortColors = function(color, remaining, distance, path) {
            var len = remaining.length;
            if (len > 10) { 
                throw "Cannot exaustively search. Too big.";
            } // can't do an exaustive search if too big
            if (len == 0) {
                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestPath = path;
                }
                //console.log(bestDistance);
            } else {
                for (var i=0; i<len; i++) {
                    var nextColor = remaining[i];
                    var nextRemaining = [];
                    var rlen = remaining.length;
                    for (var j=0; j<rlen; j++) {
                        if (j !== i) { 
                            nextRemaining.push(remaining[j]);
                        }
                    }
                    var nextDistance;
                    if (color === null) {
                        nextDistance = 0;
                    } else {
                        nextDistance = distance + color.distanceFrom(nextColor);
                    }
                    var nextPath = path.concat([nextColor]);
                    sortColors(nextColor, nextRemaining, nextDistance, nextPath);
                }
            }
        }
        
        this.sort = function(colors) {
            bestDistance =  Math.sqrt(255 * 255 * 3) * colors.length;
            bestPath = colors;
            sortColors(null, colors, 0, []);
            return bestPath;
        };
    }
    
    function NearestColorSorter() {
        var distances;
        var paths;
        
        var removeAt = function(array, index) {
            var len = array.length;
            var result = new Array(len - 1);
            var count = 0;
            for (var i=0; i<len; i++) {
                if (i !== index) {
                    result[count] = array[i];
                    count++;
                }
            }
            return result;
        };
        
        var findMinDistance = function(color, colors) {
            var len = colors.length;
            var minDist = color.distanceFrom(colors[0]);
            var minIndex = 0;
            var minColor = colors[0];
            for (var i=0; i<len; i++) {
                var dist = color.distanceFrom(colors[i]);
                if (dist < minDist) {
                    minDist = dist;
                    minIndex = i;
                    minColor = colors[i];
                }
            }
            return {
                index: minIndex,
                distance: minDist,
                color: minColor
            };
        };
        
        this.sort = function(colors) {
            var len = colors.length;
            var paths = new Array(len);
            var distances = new Array(len);
            for (var i=0; i<len; i++) {
                let color = colors[i];
                let remaining = removeAt(colors, i);
                paths[i] = [color];
                let distance = 0;
                let rlen = len - 1;
                for (var j=0; j<rlen; j++) {
                    let min = findMinDistance(color, remaining);
                    remaining = removeAt(remaining, min.index);
                    distance += min.distance;
                    paths[i].push(min.color);
                    color = min.color;
                }
                distances[i] = distance;
            }
            var minResult = distances[0];
            var minResultIndex = 0;
            for (var i=0; i<len; i++) {
                if (distances[i] < minResult) {
                    minResult = distances[i];
                    minResultIndex = i;
                }
            }
            return paths[minResultIndex];
        };
    }
    
    // -------------------------------------------------------

    function iterate(bytes, clusters) {
        
        if (clusters === undefined) { throw "Clusters undefined."; }
        
        // initialize working variables
        var numClusters = clusters.length;
        var colors = new Array(numClusters);
        var sumRed = new Array(numClusters);
        var sumGreen = new Array(numClusters);
        var sumBlue = new Array(numClusters);
        var counts = new Array(numClusters);
        for (var i = 0; i < numClusters; i++) {
            colors[i] = clusters[i].color;
            sumRed[i] = 0;
            sumGreen[i] = 0;
            sumBlue[i] = 0;
            counts[i] = 0;
        }

        // total up the pixels that fall under each cluster
        var color, c, len;
        len = bytes.length;
        for (var i = 0; i < len; i = i + 4) {
            color = new RgbColor(
                bytes[i],
                bytes[i + 1],
                bytes[i + 2]);
            c = ColorScheme.findNearestColor(color, colors);
            if (c === undefined) { throw "undefined"; }
            sumRed[c] += color.red;
            sumGreen[c] += color.green;
            sumBlue[c] += color.blue;
            counts[c] += 1;
        }

        //normalize the results
        for (var i = 0; i < numClusters; i++) {
            if (counts[i] !== 0) {
                clusters[i].color.red = Math.floor(sumRed[i] / counts[i]);
                clusters[i].color.green = Math.floor(sumGreen[i] / counts[i]);
                clusters[i].color.blue = Math.floor(sumBlue[i] / counts[i]);
            }
        }
        return clusters;
    };
    
    var findNearestColor = function (color, colors) {
        var min, minDist = 9999999, dist, len, itemColor;
        len = colors.length;
        for (var i = 0; i < len; i = i + 1) {
            item = colors[i];
            dist = item.distanceFromSquared(color);
            if (dist < minDist) {
                minDist = dist;
                min = i;
            }
        }
        if (min === undefined) {
            throw "undefined";
        }
        return min;
    };

    var map = function(f, obj) {
      return obj.map(f);
    };
    
    var sortColors = function(colors) {
        if (colors.length > 10) {
            var sorter = new NearestColorSorter();
            return sorter.sort(colors);
        } else {
            var sorter = new ExaustiveColorSorter();
            return sorter.sort(colors);
        }
    }
    
    var findColor = function(colors, color) {
        var selected = colors.filter(function(x) {
            return (
                x.red == color.red && 
                x.green == color.green && 
                x.blue == color.blue
            );
        });
        return selected.length > 0;
    };

    return {
        clusterColors: clusterColors, 
        findColor: findColor, 
        findNearestColor: findNearestColor,
        sortColors: sortColors
    };
    
})(); 
