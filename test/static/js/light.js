/*
 * Author: Maverick Chan
 */

// Use $jq for jQuery
var $jq = jQuery.noConflict(true);

// Make log shortcut to console.log
var log = console.log.bind(console);

// Light takes in an object, html as key, values as array of routes
// { html: ['/', '/home', '/login'] }
var light = function(views) {

    var routes, html_dict;
    routes = views.html;
    html_dict = {};

    // Iterates through routes and make Ajax requests to them
    // Then, store their HTML into html_dict object with the route as key
    routes.forEach(function(route) {
        $jq.ajax({
            url: route,
            success: function(html) {
                html_dict[route] = html;
            }
        }).done(function(){
            // Called when check is false
            function BrowserSupportError(message) {
                this.message = message;
                this.name = "StorageNotSupported";
            }

            // If supported, iterate through html_dict object
            // And store it in localStorage
            if ( support_storage() ) {
                var route, html, compr_html;
                for (route in html_dict) {
                    html = html_dict[route];

                    // Compress HTML to insert localStorage
                    compr_html = LZString.compress(html);
                    localStorage[route] = compr_html;
                }
            }
            else {
                throw new BrowserSupportError("Browser does not support localStorage");
            }
        });
    });

    // Checks if browser supports localStorage
    function support_storage() {
        try {
            return 'localStorage' in window &&
            window['localStorage'] !== null;
        }
        catch(e) {
            return false;
        }
    }

}
