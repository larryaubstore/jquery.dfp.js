describe("Category Exclusion", function () {

    beforeEach(function () {
        $('.adunit').remove();
        $('script[src*="googletagservices.com/tag/js/gpt.js"]').remove();
        window.googletag = null;
        delete window.googletag;
    });

    it("Detection div width/height (div inside a div)", function () {

        jQuery("body").append("<div class='adunit' id='Ad_unit_id' style='float:left;display:none'></div>"); 

        
        waitsFor(function () {
            if (jQuery(".adunit").length === 1) {
                return true;
            } else {
                return false;
            }
        }, "div.adunit not created", 5000);


        runs(function () {
            jQuery(".adunit").html("<div style='height:100px;width:100px;'></div><div id='marker' style='display:none'></div>");
        });

        runs(function () {
            var adunitDiv = jQuery(".adunit");
            expect(adunitDiv.height()).toEqual(100);
            expect(adunitDiv.width()).toEqual(100);
        });
    });


    it("Check if pre-render callback got called", function () {



        var mock = {};
        mock.prerenderCallback = function (adunit) {};
        spyOn(mock, "prerenderCallback").andCallThrough();

        var mockGoogleAdUnit = {};
        mockGoogleAdUnit.addService = function () {
            return mockGoogleAdUnit;
        }
        
        var dummyTag = {};
        dummyTag.enableServices = function() {};
        dummyTag.defineSlot = function() { 
            return mockGoogleAdUnit; 
        };
        dummyTag.pubads = function () {};  
        dummyTag.addService = function () {};
        
        spyOn(dummyTag, "enableServices").andCallThrough();
        spyOn(dummyTag, "defineSlot").andCallThrough();

        $("body").append("<div id='testdiv'>" + 
                "<div class='adunit' id='idAdunit'></div>" + 
            "</div>");


        waitsFor(function() {

            if($("#testdiv").length === 1) {
                return true; 
            } else {
                return false;
            }
        }, "div#testdiv not created", 5000);
        

        runs(function () {
            $.dfp({
                dfpID: 'xxxxxxx', 
                googletag: dummyTag,
                beforeEachAdLoaded: mock.prerenderCallback
            });
        }); 

        waitsFor(function () {
            if(typeof(mockGoogleAdUnit.renderEnded) !== "undefined") {
                return true;
            } else {
                return false;
            }
        }, "Method enablesServices never got called", 5000);
       
        runs(function () {
            // Call it manually, we assume Google API will call the method
            // after 'enableServices' method
            mockGoogleAdUnit.renderEnded();
        });

        waitsFor(function () {
            if(mock.prerenderCallback.calls.length === 1) {
                return true;
            } else {
                return false;
            }
        }, "Pre-render callback never got called", 5000);

        runs(function () {
            var arg = mock.prerenderCallback.calls[0].args[0];
            expect(arg).not.toBeUndefined();
            expect(arg.attr("id").toEqual("idAdunit");
        });
    });
});
