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
        var model = new Model(view, reducer);
        model.initialize();

        // test
        var expected = '{\"navigation\":{\"title\":\"Pick an Image\",\"showPrevious\":false,\"showNext\":true,\"showChooseImage\":true,\"showClusterColors\":false},\"domain\":{\"file\":\"\",\"imageLoaded\":false,\"imageData\":null,\"width\":320,\"height\":240,\"colorCount\":16,\"colors\":[],\"selectedColors\":[]}}'
        assert.equal(view.actual, expected);
    });

});
