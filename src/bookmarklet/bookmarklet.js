/**
 * Code to load the boom.js script as a bookmarklet
 *
 */

function load(doc) {
    var bombScript = doc.createElement('script');
    bombScript.setAttribute('src', 'http://localhost:8080/build/bookmark_entry.js');
    document.head.appendChild(bombScript);
}

(function(doc) {
    load(doc);
}(document));
