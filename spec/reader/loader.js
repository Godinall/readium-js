require(["readium_shared_js/globalsSetup"], function() {
    require(['jquery', 'underscore', 'readium_js/Readium'], function($, _, Readium) {

        $(document).ready(function() {

            var readerOptions = {
                //baseUrl: "epub://",
                el: '#readium-container', //selector for readium container element
                annotationCSSUrl: new URI(window.location.href).normalize().filename("annotations.css").toString() //absoulte path since it's going to lose the base url inside an iframe
            };

            var epubPath = '../epubs/accessible_epub_3';

            var readiumOptions = {
                jsLibRoot: '../vendor/',
            };

            var readium = new Readium(readiumOptions, readerOptions);
            var reader = readium.reader;

            window.testReader = {
                readium: readium,
                reader: reader,
                waitForFinalPagination: function(cb) {
                    var finalPaginationChanged = _.debounce(
                        _.once(function() {
                            _.defer(function() {
                                cb.apply(this, arguments);
                                reader.off(ReadiumSDK.Events.PAGINATION_CHANGED, finalPaginationChanged);
                            });
                        }), 300);
                    reader.on(ReadiumSDK.Events.PAGINATION_CHANGED, finalPaginationChanged);
                }
            };

            window.parent.postMessage('testReaderReady', '*');

            //Buttons for page nav

            $('#left').on('click', function() {
                reader.openPageLeft();
            });


            $('#right').on('click', function() {
                reader.openPageRight();
            });

            $('#bookmark').on('click', function() {
                prompt('', reader.bookmarkCurrentPage());
            });

            $('#pageinfo').on('click', function() {
                prompt('', JSON.stringify(reader.getPaginationInfo().openPages));
            });

            $('#reflowinfo').on('click', function() {
                prompt('', JSON.stringify(reader.getPaginationInfo().reflowablePagination));
            });

        });
    });
});
