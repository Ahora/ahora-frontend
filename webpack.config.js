var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

// variables
var isProduction = process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production';
var sourcePath = path.join(__dirname, './src');
var outPath = path.join(__dirname, './dist');
if (!fs.existsSync(outPath)) {
  fs.mkdirSync(outPath);
}

// plugins
const CircularDependencyPlugin = require('circular-dependency-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');


module.exports = {
  context: sourcePath,
  entry: {
    vendor: './vendor.ts',
    app: './main.tsx'
  },
  output: {
    path: outPath,
    filename: '[name].[hash].bundle.js',
    chunkFilename: '[name].[hash].js',
    publicPath: '/'
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.tsx', 'scss'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // (jsnext:main directs not usually distributable es6 format, but es6 sources)
    mainFields: ['module', 'browser', 'main'],
    alias: {
      app: path.resolve(__dirname, 'src/app/')
    }
  },
  module: {
    rules: [
      // .ts, .tsx
      {
        test: /\.tsx?$/,
        use: [
          !isProduction && {
            loader: 'babel-loader',
            options: { plugins: ['react-hot-loader/babel'] }
          },
          'ts-loader'
        ].filter(Boolean)
      },
      // css
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader]
      },
      {
        test: /\.scss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader", // creates style nodes from JS strings
          {
            loader: 'css-loader',
            query: {
              sourceMap: !isProduction,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('postcss-import')({ addDependencyTo: webpack }),
                require('postcss-url')(),
                require('postcss-preset-env')({
                  /* use stage 2 features (defaults) */
                  stage: 2,
                }),
                require('postcss-reporter')(),
                require('postcss-browser-reporter')({
                  disabled: isProduction
                })
              ]
            }
          },
          {
            loader: 'sass-loader',
            query: {
              sourceMap: !isProduction,
            }
          }
        ]
      },
      // static assets
      { test: /\.html$/, use: 'html-loader' },
      // { test: /\.(a?svg)$/, use: 'url-loader?limit=10000' },
      { test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|png|svg)$/, use: 'file-loader' },
      { test: /\.(ttf|eot|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, use: { loader: "url-loader" } }
    ]
  },
  optimization: {
    splitChunks: {
      name: true,
    },
    runtimeChunk: true
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      DEBUG: false
    }),
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // add errors to webpack instead of warnings
      failOnError: true,
      // allow import cycles that include an asyncronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    }),
    new CopyWebpackPlugin([
      { from: path.join(sourcePath, 'assets/favicon.ico'), to: outPath },
      { from: path.join(sourcePath, 'assets/fonts'), to: path.join(outPath, 'assets/fonts') },
      { from: path.join(sourcePath, 'assets/images'), to: path.join(outPath, 'images') },
      { from: path.join(sourcePath, 'assets/webfonts'), to: path.join(outPath, 'webfonts') }
    ]),
    new WebpackCleanupPlugin(),
    new MiniCssExtractPlugin({
      filename: '[contenthash].css',
      disable: !isProduction
    }),
    new HtmlWebpackPlugin({
      template: 'assets/index.html'
    }),
    new ForkTsCheckerWebpackPlugin({ tsconfig: "../tsconfig.json" })
  ],
  devServer: {
    proxy: {
      '/api/**': {
        target: 'http://localhost:3001',
        secure: false,
        changeOrigin: true,
      },
      '/socket.io/**': {
        target: 'http://localhost:3001',
        secure: false,
        changeOrigin: true,
        ws: true
      },
      '/auth/**': {
        target: 'http://localhost:3001',
        secure: false,
        changeOrigin: true,
      }
    },
    https: false,
    contentBase: sourcePath,
    hot: true,
    inline: true,
    historyApiFallback: {
      disableDotRule: true
    },
    stats: 'minimal',
    clientLogLevel: 'warning'
  },
  devtool: isProduction ? 'hidden-source-map' : 'eval-source-map',
  // devtool: isProduction ? 'hidden-source-map' : 'cheap-module-eval-source-map',
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: 'empty',
    net: 'empty'
  }
};
