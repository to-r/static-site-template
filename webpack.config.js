const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const globImporter = require("node-sass-glob-importer")

const ENV = process.env.NODE_ENV || "development"
const dist = "public"
const outputPath = "assets/"
const isProd = ENV === "production"

module.exports = {
  mode: ENV,
  devtool: isProd ? "source-map" : "eval",
  entry: {
    main: ["./src/js/main.js", "./src/scss/main.scss"]
  },
  output: {
    filename: path.join(outputPath, "js/[name].js"),
    path: path.resolve(__dirname, dist),
    publicPath: "/"
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: path.join(outputPath, "css/[name].css")
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" }
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: false,
              importLoaders: 2
            }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")({ grid: true })].concat(
                isProd ? [require("css-mqpacker"), require("cssnano")] : []
              )
            }
          },
          {
            loader: "sass-loader",
            options: {
              importer: globImporter()
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".json", ".css", ".scss"]
  },
  externals: {
    jquery: "jQuery"
  }
}
