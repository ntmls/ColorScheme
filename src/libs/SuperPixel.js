    function SuperPixel(red, green, blue, x, y) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.x = x;
        this.y = y;
    }

    SuperPixel.prototype.distanceFrom = function(pixel) {
        var deltaRed = this.red - pixel.red;
        var deltaGreen = this.green - pixel.green;
        var deltaBlue = this.blue - pixel.blue;
        var deltaX = this.x - pixel.x;
        var deltaY = this.y - pixel.y;
        return Math.sqrt(
            deltaRed * deltaRed + 
            deltaGreen * deltaGreen + 
            deltaBlue * deltaBlue, 
            deltaX * deltaX + 
            deltaY * deltaY);
    };

    SuperPixel.prototype.distanceFromSquared = function(pixel) {
        var deltaRed = this.red - pixel.red;
        var deltaGreen = this.green - pixel.green;
        var deltaBlue = this.blue - pixel.blue;
        return deltaRed * deltaRed + 
            deltaGreen * deltaGreen + 
            deltaBlue * deltaBlue, 
            deltaX * deltaX + 
            deltaY * deltaY;
    };

    SuperPixel.prototype.toValidColor = function() {
        var red = Math.max(0,Math.min(255, Math.floor(this.red)));
        var green = Math.max(0,Math.min(255, Math.floor(this.green)));
        var blue = Math.max(0,Math.min(255, Math.floor(this.blue)));
        return new SuperPixel(red, green, blue, this.x, this.y);
    };

    SuperPixel.prototype.add = function(pixel) {
        return new SuperPixel(
            this.red + pixel.red, 
            this.green + pixel.green, 
            this.blue + pixel.blue, 
            this.x + pixel.x, 
            this.y + pixel.y);
    };

    SuperPixel.prototype.scale = function(scale) {
        return new SuperPixel(
            this.red * scale,
            this.green * scale, 
            this.blue * scale, 
            this.x * scale, 
            this.y * scale);
    };

    SuperPixel.prototype.toKey = function() {
        return `r${this.red}g${this.green}b${this.blue}x${this.x}y${this.y}`;
    };