var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// variables
var isProduction = process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production';
var sourcePath = path.join(__dirname, './src');
var outPath = path.join(__dirname, './dist');
var assetsFolder = path.join(outPath, 'assets');
var fontsFolder = path.join(assetsFolder, 'fonts');
if (!fs.existsSync(outPath)) {
  fs.mkdirSync(outPath);
}

// plugins
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  context: sourcePath,
  entry: {
    app: './main.tsx'
  },
  output: {
    path: outPath,
    filename: 'bundle.js',
    chunkFilename: '[chunkhash].js',
    publicPath: '/'
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.tsx', 'scss'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // (jsnext:main directs not usually distributable es6 format, but es6 sources)
    mainFields: ['module', 'browser', 'main'],
    alias: {
      app: path.resolve(__dirname, 'src/app/'),
      "./images/layers.png$": path.resolve(
        __dirname,
        "./node_modules/leaflet/dist/images/layers.png"
      ),
      "./images/layers-2x.png$": path.resolve(
        __dirname,
        "./node_modules/leaflet/dist/images/layers-2x.png"
      ),
      "./images/marker-icon.png$": path.resolve(
        __dirname,
        "./node_modules/leaflet/dist/images/marker-icon.png"
      ),
      "./images/marker-icon-2x.png$": path.resolve(
        __dirname,
        "./node_modules/leaflet/dist/images/marker-icon-2x.png"
      ),
      "./images/marker-shadow.png$": path.resolve(
        __dirname,
        "./node_modules/leaflet/dist/images/marker-shadow.png"
      )
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
      {
        test: /\leaflet.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      },
      // css
      {
        test: /\.css$/,
        //exclude: [/\leaflet.css$/, path.resolve(__dirname, "./src/app/containers/Account/OrganizationApp/style.css")],
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
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
          }
        ]
      },
      {
        test: /\.scss$/,
        exclude: path.resolve(__dirname, "./src/general-styles.scss"),
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
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, "./src/general-styles.scss"),
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
      {
        test: /\.(ttf|eot|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: "url-loader"
        }
      }
    ]
  },
  optimization: {
    splitChunks: {
      name: true,
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: -10
        }
      }
    },
    runtimeChunk: true
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      DEBUG: false
    }),
    new CopyWebpackPlugin([
      { from: path.join(sourcePath, 'assets/favicon.ico'), to: outPath },
      { from: path.join(sourcePath, 'assets/fonts'), to: path.join(outPath, 'assets/fonts') },
      { from: path.join(sourcePath, 'assets/images'), to: path.join(outPath, 'images') },
      //{ from: path.join(sourcePath, 'assets/icons'), to: path.join(outPath, 'icons') },
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
  // https://webpack.js.org/configuration/devtool/
  devtool: isProduction ? 'hidden-source-map' : 'eval-source-map',
  // devtool: isProduction ? 'hidden-source-map' : 'cheap-module-eval-source-map',
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: 'empty',
    net: 'empty'
  }
};
