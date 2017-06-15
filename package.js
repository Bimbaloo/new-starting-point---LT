module.exports = {
    context:process.cwd(), //确定了webpack的编译上下文（这个参数可以不写，默认的）
    watch: true,           //监听文件，文件改变时，让webpack动态编译
    entry: './index.js',   // ==>context ==>'./index.js'
    devtool: 'source-map', // 开发者工具 ==>'source-map ==> 资源映射表' chrome debug ==> 调试的时候调试源文件
    output: {
        path: path.resolve(process.cwd(), 'dist/'),  // 导处目录
        filename: '[name].js'                        // 导出文件的文件名
    },
    // alias 别名.require('jquery') ==> requery(process.cwd()+'src/lib/jquery.js')
    resolve: {
        alias: {jquery: 'src/lib/jquery.js',}
    },
    // 插件
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            _: 'underscore',
            React: 'react'
        }),
        new WebpackNotifierPlugin()
    ],
    // webpack对module处理的核心
    module: {
        loaders: [{
            // 对匹配到的文件（.js&.jsx）通过加载器进行处理。除了/node_modules/目录下的文件
            test: /\.js[x]?$/,        //正则表达式  .js .jsx
            exclude: /node_modules/,  //排除的目录
            loader: 'babel-loader'    //加载器，用来处理相关文件
            // 将一种代码形式转化成另一种代码形式
        }, {
            test: /\.less$/,
            loaders: ['style-loader', 'css-loader', 'less-loader']
        }, {
            test: /\.(png|jpg|gif|woff|woff2|ttf|eot|svg|swf)$/,
            loader: "file-loader?name=[name]_[sha512:hash:base64:7].[ext]"
        }, {
            test: /\.html/,
            loader: "html-loader?" + JSON.stringify({minimize: false})
        }]
    }
};