# Boom.js

Sometimes a webpage just really ticks you off.

Maybe you're reading it. Maybe you're developing it. Sometimes though you'll come
to the realisation that this page incorporates all the worst things in the world.

*BLOW THAT SUCKER UP*

## Development

Built using ES6, you'll need to compile it with `babel` (and resolve the imports with `webpack`).

### Compile

    npm install
    gulp build

### Development

    gulp dev # hosts a local development server serving build/boom.js

Or

    gulp demo-dev # show's development website

Visit a website and run the bookmarklet code to load the bomb.

### Create bookmarklet loader

    prelim=$(echo "javascript: "); script=$(cat build/bookmarklet.js); bookmarklet="$prelim$script"; echo $bookmarklet | pbcopy

