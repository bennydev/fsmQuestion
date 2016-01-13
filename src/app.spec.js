"use strict";
describe("Sanity check test", function() {
    var ctrl;

    beforeEach(module('fsmQuestion'));
    ctrl = module('fsmQuestion');

    it('should have a fsmQuestion module', function () {
        expect(ctrl).toBeTruthy();
    });
});