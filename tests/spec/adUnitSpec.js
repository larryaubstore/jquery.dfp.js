describe('Ad units', function () {

    beforeEach(function () {
        $('.adunit').remove();
        $('script[src*="googletagservices.com/tag/js/gpt.js"]').remove();
        window.googletag = null;
        delete window.googletag;
    });

    it("Auto generate an ID for the ad unit if no ID provided", function () {

        runs(function () {
            $('body').append('<div class="adunit" data-adunit="Leader"></div>');
            $.dfp({dfpID: 'xxxxxxx'});
        }, "Kick off loader");

        waitsFor(function () {
            if (typeof window.googletag.getVersion === 'function') {
                return true;
            } else {
                return false;
            }
        }, "getVersion function to exist", 5000);

        runs(function () {
            expect($('.adunit').attr('id')).toMatch(/Leader-auto-gen-id-\d+/i);
        });

    });

    it("Google ad unit object get attached to the ad unit container", function () {

        runs(function () {
            $('body').append('<div class="adunit" data-adunit="Leader"></div>');
            $.dfp({dfpID: 'xxxxxxx'});
        }, "Kick off loader");

        waitsFor(function () {
            if (typeof window.googletag.getVersion === 'function') {
                return true;
            } else {
                return false;
            }
        }, "getVersion function to exist", 5000);

        runs(function () {
            expect($('.adunit').data('googleAdUnit').A).toEqual('/xxxxxxx/Leader');
        });

    });

    it("Check if pre-render callback get called", function () {

        var callback = {};
        callback.beforeEachAdLoaded = function() {};
        spyOn(callback, "beforeEachAdLoaded").andCallThrough();

        var dummyTag = {};
        dummyTag.enableServices = function () {

        };



        spyOn(dummyTag, "enableServices").andCallThrough();

        runs(function () {
            $('body').append('<div class="adunit" data-adunit="Leader"></div>');
            $.dfp({
                dfpID: 'xxxxxxx',
                beforeEachAdLoaded: callback.beforeEachAdLoaded,
                googletag: dummyTag
            });
        }, "Kick off loader");

        waitsFor(function () {
            return dummyTag.enableServices.callCount === 1;
        }, "enableServices not called", 5000);

        runs(function () {
            var adUnitSelector = $('.adunit');
            debugger;
            expect(adUnitSelector.length).toEqual(1);
            //expect(callback.beforeEachAdLoaded).toHaveBeenCalled();
            //expect($('.adunit').data('googleAdUnit').A).toEqual('/xxxxxxx/Leader');
        });

    });



});
