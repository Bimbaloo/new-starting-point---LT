const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');     //自动将[css][js][title]等信息绑定在html的插件
const CleanWebpackPlugin = require('clean-webpack-plugin');   //自动清理指定[dist]的插件
const webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/index.js'
    },
    devtool: 'inline-source-map',               // 启用source map
    devServer: {
        contentBase: path.join(__dirname, "dist"), // 默认打开路径
        host: '127.0.0.1',                      // IP路径
        port: 9000,                             // 端口号
        open: true,                             // 是否自动打开
        openPage: 'index.html',                 // 自动打开页面
        compress: true,                         // 启动gzip压缩
        hot: true                               // 热更新模块
    },
    plugins: [  //插件
        new CleanWebpackPlugin(['dist']),       //清理dist文件
        new HtmlWebpackPlugin({                 //自动将j[css][js][title]等信息绑定到生产html的插件
            title: 'Output Management',
            chunks: ['print', 'app'],
            chunksSortMode: 'manual'  //手动排序
        }),
        new webpack.HotModuleReplacementPlugin() // webpack内置的hot插件
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {  //loader
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }, {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }, {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    }
};