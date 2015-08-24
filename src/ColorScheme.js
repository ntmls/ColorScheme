(function(ColorScheme, undefined) {

ColorScheme.clusterColors = function(bytes, n) {
    var clusters = createClusters(bytes, n),
        newClusters, isDifferent, distances;

    for (var i = 0; i < 50; i = i + 1) {
        newClusters = iterate(bytes, clusters);
        distances = _.zip(clusters, newClusters)
            .map(function (c) {
                return distanceFromClusterSquared(
                    c[0].red, c[0].green, c[0].blue,
                    c[1].red, c[1].green, c[1].blue);
            });
        if (_.every(distances, function (d) { return d == 0; })) {
            break;
        }
        clusters = newClusters;
    }
    return newClusters;
}

ColorScheme.findNearestCluster = function(red, green, blue, clusters) {

    var min, minDist = 200000, dist, c;

    for (var i = 0; i < clusters.length; i = i + 1) {
        c = clusters[i];
        dist = distanceFromClusterSquared(
            c.red, c.green, c.blue,
            red, green, blue);
        if (dist < minDist) {
            minDist = dist;
            min = c;
        }
    }
    return min;
}

// --------- clustering -----------------

function createClusters(b, n) {
    var c = b.length / 4
    var result = [];
    for (var i = 0; i < n; i = i + 1) {
        var r = Math.floor(Math.random() * c);
        result.push(
            {
                name: i,
                red: b[r * 4],
                green: b[r * 4 + 1],
                blue: b[r * 4 + 2],
                count: 1,
                redSum: 0,
                greenSum: 0,
                blueSum: 0
            });
    }
    return result;
}

function distanceFromClusterSquared(red1, green1, blue1, red2, green2, blue2) {
    var deltaRed = red2 - red1;
    var deltaGreen = green2 - green1;
    var deltaBlue = blue2 - blue1;
    return deltaRed * deltaRed + deltaGreen * deltaGreen + deltaBlue * deltaBlue;
}

function resetClusters(clusters) {
    return _.map(clusters, resetCluster);
}

function resetCluster(cluster) {
    return {
        name: cluster.name,
        red: cluster.red,
        green: cluster.green,
        blue: cluster.blue,
        count: 1,
        redSum: 0,
        greenSum: 0,
        blueSum: 0
    };
}

function normalizeCluster(cluster) {
    return {
        name: cluster.name,
        red: Math.floor(cluster.redSum / cluster.count),
        green: Math.floor(cluster.greenSum / cluster.count),
        blue: Math.floor(cluster.blueSum / cluster.count),
        count: cluster.count,
        redSum: 0,
        greenSum: 0,
        blueSum: 0
    };
}

function normalizeClusters(clusters) {
    return _.map(clusters, function (c) {
        return normalizeCluster(c);
    });
}

function iterate(bytes, clusters) {
    var newClusters = resetClusters(clusters);
    var red, green, blue, c;
    for (var i = 0; i < bytes.length; i = i + 4) {
        red = bytes[i];
        green = bytes[i + 1];
        blue = bytes[i + 2];
        c = ColorScheme.findNearestCluster(red, green, blue, newClusters);
        c.redSum = c.redSum + red;
        c.greenSum = c.greenSum + green;
        c.blueSum = c.blueSum + blue;
        c.count = c.count + 1;
    }
    return normalizeClusters(newClusters);
}


}(window.ColorScheme = window.ColorScheme || {} ));
