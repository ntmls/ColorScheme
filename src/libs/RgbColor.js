    function RgbColor(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    RgbColor.prototype.distanceFrom = function(color) {
        var deltaRed = this.red - color.red;
        var deltaGreen = this.green - color.green;
        var deltaBlue = this.blue - color.blue;
        return Math.sqrt(deltaRed * deltaRed + deltaGreen * deltaGreen + deltaBlue * deltaBlue);
    };

    RgbColor.prototype.distanceFromSquared = function(color) {
        var deltaRed = this.red - color.red;
        var deltaGreen = this.green - color.green;
        var deltaBlue = this.blue - color.blue;
        return deltaRed * deltaRed + deltaGreen * deltaGreen + deltaBlue * deltaBlue;
    };

    RgbColor.prototype.toValidColor = function() {
        var red = Math.max(0,Math.min(255, Math.floor(this.red)));
        var green = Math.max(0,Math.min(255, Math.floor(this.green)));
        var blue = Math.max(0,Math.min(255, Math.floor(this.blue)));
        return new RgbColor(red, green, blue);
    };

    RgbColor.prototype.add = function(color) {
        return new RgbColor(
            this.red + color.red, 
            this.green + color.green, 
            this.blue + color.blue);
    };

    RgbColor.prototype.scale = function(scale) {
        return new RgbColor(
            this.red * scale,
            this.green * scale, 
            this.blue * scale);
    };

    RgbColor.prototype.toKey = function() {
        return `r${this.red}g${this.green}b${this.blue}`;
    };