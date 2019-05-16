const helpers = require('./helpers');

const webpackMerge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano')
const ngw = require('@ngtools/webpack');

const commonConfig = require('./webpack.config.common');


module.exports = webpackMerge(commonConfig, {
    mode: 'production',
    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: '[hash].js',
        chunkFilename: '[id].[hash].chunk.js'
    },

    module: {
        rules: [
            {
                test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                loader: '@ngtools/webpack'
            }
        ]
    },
    plugins: [
        new ngw.AngularCompilerPlugin({
            tsConfigPath: helpers.root('tsconfig.json'),
            entryModule: helpers.root('src', 'app', 'modules', 'app', 'app.module#AppModule')
        })
    ],

    optimization: {
        noEmitOnErrors: true,
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: 'single',
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true
            }),

            new OptimizeCSSAssetsPlugin({
                cssProcessor: cssnano,
                cssProcessorOptions: {
                    discardComments: {
                        removeAll: true
                    }
                },
                canPrint: false
            })
        ]
    }
});