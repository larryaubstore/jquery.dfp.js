describe("RenderEnded Override", function () {

    beforeEach(function () {
        $('.adunit').remove();
        $('script[src*="googletagservices.com/tag/js/gpt.js"]').remove();
        window.googletag = undefined;
    });

    it("Check if custom 'renderEnded' method is overrided", function () {

        var mockGoogleAdUnit = {};
        mockGoogleAdUnit.addService = function () {
            return mockGoogleAdUnit;
        }
        
        var dummyTag = {};
        dummyTag.enableServices = function() {};
        dummyTag.defineSlot = function() { 
            return mockGoogleAdUnit; 
        };

        dummyTag.pubads = function () {
            return dummyTag;
        }; 
        dummyTag.collapseEmptyDivs = function () {}; 
        dummyTag.addService = function () {};
        dummyTag.setTargeting = function () {};
        
        spyOn(dummyTag, "enableServices").andCallThrough();
        spyOn(dummyTag, "defineSlot").andCallThrough();

        $("body").append("<div class='adunit' id='idAdunit' ></div>");

        waitsFor(function() {
            if($(".adunit").length === 1) {
                return true; 
            } else {
                return false;
            }
        }, ".adunit not created", 5000);
        

        runs(function () {
            $.dfp({
                dfpID: 'xxxxxxx', 
                googletag: dummyTag,
                enableSingleRequest: false
            });
        }); 

        waitsFor(function () {
            if(dummyTag.enableServices.calls.length === 1) {
                return true;
            } else {
                return false;
            }
        }, "Method enablesServices never got called", 5000);
       
        runs(function () {
            expect(mockGoogleAdUnit.renderEnded).not.toBeUndefined();
        });

    });

    it("Check if custom 'renderEnded' method is not overrided", function () {

        var mockGoogleAdUnit = {};
        mockGoogleAdUnit.addService = function () {
            return mockGoogleAdUnit;
        }
        
        var dummyTag = {};
        dummyTag.enableServices = function() {};
        dummyTag.defineSlot = function() { 
            return mockGoogleAdUnit; 
        };

        dummyTag.pubads = function () {
            return dummyTag;
        }; 
        dummyTag.collapseEmptyDivs = function () {}; 
        dummyTag.addService = function () {};
        dummyTag.setTargeting = function () {};
        
        spyOn(dummyTag, "enableServices").andCallThrough();
        spyOn(dummyTag, "defineSlot").andCallThrough();


        $("body").append("<div class='adunit' id='idAdunit' ></div>");

        waitsFor(function() {

            if($(".adunit").length === 1) {
                return true; 
            } else {
                return false;
            }
        }, ".adunit not created", 5000);
        

        runs(function () {
            
            $.dfp({
                dfpID: 'xxxxxxx', 
                googletag: dummyTag,
                enableSingleRequest: false,
                customRenderEndedEnabled: false
            });
        }); 

        waitsFor(function () {
            if(dummyTag.enableServices.calls.length === 1) {
                return true;
            } else {
                return false;
            }
        }, "Method enablesServices never got called", 5000);
       
        runs(function () {
            expect(mockGoogleAdUnit.renderEnded).toBeUndefined();
        });

    });

});
