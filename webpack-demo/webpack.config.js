const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        print: './src/print.js',
        app: './src/index.js'
    },
    plugins: [  //插件
        new CleanWebpackPlugin(['dist']),       //清理dist文件
        new HtmlWebpackPlugin({                 //默认将js绑定到html中
            title: 'Output Management',
            chunks: ['print', 'app'],
            chunksSortMode: 'manual'  //手动排序
            /* 函数排序方式 */
            // chunksSortMode: function (chunk1, chunk2) {  
            //     var order = ['print', 'app'];
            //     var order1 = order.indexOf(chunk1.names[0]);
            //     var order2 = order.indexOf(chunk2.names[0]);
            //     return order1 - order2;  
            // }
        })
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