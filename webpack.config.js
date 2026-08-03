const path = require('path');

module.exports = {
    entry: './dist/src/liqe.js',
    output: {
        filename: 'liqe.bundle.js',
        path: path.resolve(__dirname, 'dist/src'),
        library: 'liqe',
        libraryTarget: 'var'
    },
    mode: 'production'
};