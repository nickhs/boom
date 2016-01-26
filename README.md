# Boom.js

Sometimes a webpage just really ticks you off.

Maybe you're reading it. Maybe you're developing it. Sometimes though you'll come
to the realisation that this page incorporates all the worst things in the world.

*BLOW THAT SUCKER UP*

Demo up at [http://boom.nickhs.com](boom.nickhs.com)

## Development

Built using ES6, you'll need to compile it with `babel` (and resolve the imports with `webpack`).

### Production

First install the dev dependencies, then compile the javascript

    npm install
    gulp prod-build

To make the bookmarklet (requires some string manipulation):

    gulp make-bookmarklet

To make the demo page (inline the bookmarklet):

    gulp make-demo

### Development

To build the javascripts with webpack including sourcemaps

    gulp dev-build

Or to host a development server that's autoupdating

    gulp dev-server

And see it pop up on [http://localhost:8080](http://localhost:8080)
Visit `demo.html` to see the demo page.

### Create bookmarklet loader (for debugging)

    prelim=$(echo "javascript: "); script=$(cat build/bookmarklet.js); bookmarklet="$prelim$script"; echo $bookmarklet | pbcopy
