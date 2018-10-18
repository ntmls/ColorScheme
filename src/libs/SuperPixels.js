/* global SuperPixel, ColorSorter, _ */
var SuperPixels = (function() {

    var cluster = function(bytes, n) {
        var clusters = createClusters(bytes, n),
            newClusters, distances;

        for (var i = 0; i < 200; i = i + 1) {
            newClusters = iterate(bytes, clusters);
            distances = _.zip(clusters, newClusters)
                .map(function (pair) {
                    var pixel1, pixel2;
                    pixel1 = pair[0].pixel;
                    pixel2 = pair[1].pixel;
                    let dist = pixel1.distanceFromSquared(pixel2);
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
            var pixel = new SuperPixel(
                bytes[r * 4],
                bytes[r * 4 + 1],
                bytes[r * 4 + 2]);
            var sums = new SuperPixel(0,0,0);
            result.push(
                {
                    name: i,
                    pixel: pixel,
                    count: 1,
                    sum: sums
                });
        }
        return result;
    };

    function iterate(bytes, clusters) {
        
        if (clusters === undefined) { throw "Clusters undefined."; }
        
        // initialize working variables
        var numClusters = clusters.length;
        var pixels = new Array(numClusters);
        var sumRed = new Array(numClusters);
        var sumGreen = new Array(numClusters);
        var sumBlue = new Array(numClusters);
        var counts = new Array(numClusters);
        for (var i = 0; i < numClusters; i++) {
            pixels[i] = clusters[i].pixel;
            sumRed[i] = 0;
            sumGreen[i] = 0;
            sumBlue[i] = 0;
            counts[i] = 0;
        }

        // total up the pixels that fall under each cluster
        var pixel, c, len;
        len = bytes.length;
        for (var i = 0; i < len; i = i + 4) {
            pixel = new SuperPixel(
                bytes[i],
                bytes[i + 1],
                bytes[i + 2]);
            c = findNearestPixel(pixel, pixels);
            if (c === undefined) { throw "undefined"; }
            sumRed[c] += pixel.red;
            sumGreen[c] += pixel.green;
            sumBlue[c] += pixel.blue;
            counts[c] += 1;
        }

        //normalize the results
        for (var i = 0; i < numClusters; i++) {
            if (counts[i] !== 0) {
                clusters[i].pixel.red = Math.floor(sumRed[i] / counts[i]);
                clusters[i].pixel.green = Math.floor(sumGreen[i] / counts[i]);
                clusters[i].pixel.blue = Math.floor(sumBlue[i] / counts[i]);
            }
        }
        return clusters;
    };
    
    var findNearestPixel = function (pixel, pixels) {
        var min, minDist = 9999999, dist, len, itempixel;
        len = pixels.length;
        for (var i = 0; i < len; i = i + 1) {
            item = pixels[i];
            dist = item.distanceFromSquared(pixel);
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
    
    var findPixel = function(pixels, pixel) {
        var selected = pixels.filter(function(x) {
            return (
                x.red == pixel.red && 
                x.green == pixel.green && 
                x.blue == pixel.blue
            );
        });
        return selected.length > 0;
    };
    
    var calculateError = function(bytes, pixels) {
        var len = bytes.length;
        var pixel1, pixel2;
        var found, sum=0;
        for (var i = 0; i < len; i = i + 4) { 
            pixel1 = new SuperPixel(bytes[i], bytes[i+1], bytes[i+2]);
            found = findNearestPixel(pixel1, pixels);
            pixel2 = pixels[found];
            sum += pixel1.distanceFrom(pixel2) / 255;
        }
        var pixels = Math.floor(len / 4);
        return sum / pixels;
    }

    return {
        cluster: cluster, 
        findPixel: findPixel, 
        findNearestPixel: findNearestPixel,
        calculateError: calculateError,
    };
    
})(); 