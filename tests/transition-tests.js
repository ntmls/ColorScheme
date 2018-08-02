/* global QUnit, RgbColor */

QUnit.module("State Machine Tests", function () {


    QUnit.test("GIVEN an empty state WHEN initializing THEN state will be set to initial values.", function (assert) {

        // wiring
        var view = {
            render: function (state) {
                console.log(state);
                this.actual = JSON.stringify(state);
            }
        }
        var model = new Model(view, transition);

        // test
        var expected = '{\"title\":\"Pick an Image\",\"showPrevious\":false,\"showNext\":true,\"showChooseImage\":true,\"showClusterColors\":false}'
        assert.equal(view.actual, expected);
    });

});
