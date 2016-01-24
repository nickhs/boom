/**
 * Code to load the boom.js script as a bookmarklet
 *
 */

import config from "../config/config.js";

function load(doc) {
    var bombScript = doc.createElement('script');
    bombScript.setAttribute('src', config.bookmarkletLocation);
    document.head.appendChild(bombScript);
}

(function(doc) {
    load(doc);
    console.log("it worked!");
}(document));
