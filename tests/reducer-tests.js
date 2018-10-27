/* global QUnit */

QUnit.module("Reducer Tests", function () {


    QUnit.test("GIVEN an empty state WHEN initializing THEN state will be set to initial values.", function (assert) {

        // wiring
        var view = {
            render: function (state) {
                console.log(state);
                this.actual = JSON.stringify(state);
            }
        }
        var model = new Store(view, reducer);
        model.initialize();

        // test
        var expected = '{\"logicalClock\":0,\"navigation\":{\"title\":\"Choose an Image\",\"showChooseImage\":true,\"showClusterColors\":false,\"showSuperPixels\":false},\"chooseImage\":{\"file\":\"\",\"imageLoaded\":false,\"imageData\":null,\"width\":320,\"height\":240},\"clusterColors\":{\"colorCount\":16,\"colors\":[],\"selectedColors\":[],\"error\":0,\"rect\":{\"state\":\"inactive\",\"start\":{\"x\":0,\"y\":0},\"end\":{\"x\":0,\"y\":0}}}}'
        assert.equal(view.actual, expected);
    });

});
