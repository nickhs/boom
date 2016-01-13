/* globals __DEV__ */

/**
 * Custom logger that is stripped if this is not a dev build
 *
 * __DEV__ is injected by webpack
 *
 * Taken from https://github.com/petehunt/webpack-howto#6-feature-flags
 */
let logger = {
    debug: function() {
        if (__DEV__) {
            console.log(...arguments);
        }
    },

    warn: function() {
        if (__DEV__) {
            console.warn(...arguments);
        }
    }
};

export default logger;
