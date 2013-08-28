RWCDemoApp = {};
RWCDemoApp.getInputValue = function (inputId) {
    return $("#" + inputId).val();
};

RWCDemoApp.setModuleContainerHeight = function () {
    $("#epub-reader-container").css({ "height" : $(window).height() * 0.85 + "px" });
};

RWCDemoApp.parseXMLFromDOM = function (data) {
    var serializer = new XMLSerializer();
    var packageDocumentXML = serializer.serializeToString(data);
    return packageDocumentXML;
};


// This function will retrieve a package document and load an EPUB
RWCDemoApp.loadAndRenderEpub = function (packageDocumentURL, startSpineItem) {

    $(".show-on-load").show();
    $("#epub-reader-container").html("");

    var that = this;

    // Clear the viewer, if it has been defined -> to load a new epub
    RWCDemoApp.epubViewer = undefined;

    // Get the package document and load the modules
    $.ajax({
        url : packageDocumentURL,
        success : function (result) {

            // Get the HTML element to bind the module reader to
            var elementToBindReaderTo = $("#epub-reader-container");

            // Create an object of viewer preferences
            var viewerPreferences = {
                fontSize : 12,
                syntheticLayout : true,
                currentMargin : 3,
                tocVisible : false,
                currentTheme : "default"
            };
            var currLayoutIsSynthetic = viewerPreferences.syntheticLayout;

            if (result.nodeType) {
                result = RWCDemoApp.parseXMLFromDOM(result);
            }

            // THE MOST IMPORTANT PART - INITIALIZING THE SIMPLE READIUM JS MODULE
            RWCDemoApp.epubViewer = new SimpleReadiumJs(
                elementToBindReaderTo, viewerPreferences, packageDocumentURL, result, "lazy"
            );

            // Set a fixed height for the epub viewer container, as a function of the document height
            RWCDemoApp.setModuleContainerHeight();

            // These are application specific handlers that wire the HTML to the SimpleReadiumJs module API

            // Set callbacks for events triggered by SimpleReadium.js
            RWCDemoApp.epubViewer.on("atNextPage", function () {
                console.log("EVENT: atNextPage");
            });
            RWCDemoApp.epubViewer.on("atPreviousPage", function () {
                console.log("EVENT: atPreviousPage");
            });
            RWCDemoApp.epubViewer.on("atFirstPage", function () {
                console.log("EVENT: atFirstPage");
            });
            RWCDemoApp.epubViewer.on("atLastPage", function () {
                console.log("EVENT: atLastPage");
            });
            RWCDemoApp.epubViewer.on("displayedContentChanged", function () {
                console.log("EVENT: displayedContentChanged");
            });

            // Set handlers for click events
            $("#previous-page-btn").unbind("click");
            $("#previous-page-btn").on("click", function () {
                RWCDemoApp.epubViewer.previousPage(function () {});
            });

            $("#next-page-btn").unbind("click");
            $("#next-page-btn").on("click", function () {
                RWCDemoApp.epubViewer.nextPage(function () {});
            });

            $("#toggle-synthetic-btn").unbind("click");
            $("#toggle-synthetic-btn").on("click", function () {

                if (currLayoutIsSynthetic) {
                    RWCDemoApp.epubViewer.setSyntheticLayout(false);
                    currLayoutIsSynthetic = false;
                    $("#single-page-ico").show();
                    $("#synthetic-page-ico").hide();
                }
                else {
                    RWCDemoApp.epubViewer.setSyntheticLayout(true);
                    currLayoutIsSynthetic = true;
                    $("#single-page-ico").hide();
                    $("#synthetic-page-ico").show();
                }
            });

            // Render the reader
            RWCDemoApp.epubViewer.on("epubLoaded", function () { 

                if (startSpineItem === undefined) {
                    startSpineItem = 0;
                }
                // Show the first content document in the spine
                RWCDemoApp.epubViewer.showSpineItem(startSpineItem, function () {
                    console.log("showed first spine item"); 
                });
                $(window).on("resize", function () {
                    RWCDemoApp.setModuleContainerHeight();
                    RWCDemoApp.epubViewer.resizeContent();
                });

                // APPLY A CUSTOM STYLE TO THE VIEWER
                RWCDemoApp.epubViewer.customize("spine-divider", "box-shadow");
            }, that);

            RWCDemoApp.epubViewer.render(0);
        }
    });
};
