/* global QUnit, RgbColor */
QUnit.module("RgbColor tests", function() {
   
    var round = function(value) {
        return Math.round(value * 1000) / 1000;
    };
    
    QUnit.test("GIVEN red, green, blue values WHEN a color is created THEN the color should have red, green, an blue properties filled with those values", function( assert ) {
        var red = 25; 
        var green = 125;
        var blue = 225;
        var color = new RgbColor(red, green, blue);
        assert.equal(color.red, red);
        assert.equal(color.green, green);
        assert.equal(color.blue, blue);
    });
    
    QUnit.test("GIVEN two colors WHEN distanceFrom is called THEN then the distance should be the euclidean distance between them.", function( assert ) {
        var color1, color2, distance;
        color1 = new RgbColor(0, 0, 0);
        color2 = new RgbColor(255, 255, 255);
        distance = color1.distanceFrom(color2);
        assert.equal(round(distance), 441.673)
    });
    
    QUnit.test("GIVEN two colors WHEN distanceFromSquared is called THEN the distance should be the euclidean distance between them.", function( assert ) {
        var color1, color2, distance;
        color1 = new RgbColor(0, 0, 0);
        color2 = new RgbColor(255, 255, 255);
        distance = color1.distanceFromSquared(color2);
        assert.equal(round(distance), 195075)
    });
    
    QUnit.test("GIVEN a color with floating values WHEN toValidColor is called THEN a color with integer values should be returned.", function( assert ) {
        var color1, color2;
        color1 = new RgbColor(111.111, 222.222, 0.123);
        color2 = color1.toValidColor();
        assert.equal(color2.red, 111);
        assert.equal(color2.green, 222);
        assert.equal(color2.blue, 0);
    });
    
    QUnit.test("GIVEN a color with values outside of the range of 0 to 255 WHEN toValidColor is called THEN then a color with integer values should be returned.", function( assert ) {
        var color1, color2;
        color1 = new RgbColor(-100.345, -45.222, -555.123);
        color2 = color1.toValidColor();
        assert.equal(color2.red, 0);
        assert.equal(color2.green, 0);
        assert.equal(color2.blue, 0);
        
        color1 = new RgbColor(333, 444, 555);
        color2 = color1.toValidColor();
        assert.equal(color2.red, 255);
        assert.equal(color2.green, 255);
        assert.equal(color2.blue, 255);
    });
    
    QUnit.test("GIVEN two colors WHEN the colors are added THEN a new color with the components added to each other should be returned", function( assert ) {
        var color1, color2, color3, distance;
        color1 = new RgbColor(1, 2, 3);
        color2 = new RgbColor(4, 5, 6);
        color3 = color1.add(color2);
        assert.equal(color3.red, 5);
        assert.equal(color3.green, 7);
        assert.equal(color3.blue, 9); 
    });
    
    QUnit.test("GIVEN a color and a value WHEN the scale function is called THEN a new color with the components scaled will be returned", function( assert ) {
        var color1, color2;
        color1 = new RgbColor(128, 88, 24);
        color2 = color1.scale(.5);
        assert.equal(color2.red, 64);
        assert.equal(color2.green, 44);
        assert.equal(color2.blue,   12); 
    });

});
