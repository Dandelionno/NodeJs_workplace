const path = require('path'); //nodejs的语法，引入路径模块，为了输出的时候找绝对路径
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const config = {
    entry: {
        index: './src/js/index.js',
        utils: './src/js/utils.js',
    },
    output:{    //输出
        path:path.resolve(__dirname,'dist'),    //path.resolve为nodejs的固定语法，用于找到当前文件的绝对路径
        filename:'js/[name].bundle.js'    //输出的文件名(可以以name/id/hash放在中括号里区分文件名)
    },
    devServer:{
        host:'localhost',   //服务器的ip地址
        port:1573,  //端口
        open:true,  //自动打开页面
        hot:true,   //开启热更新
    },
    plugins: [
        new CleanWebpackPlugin(),  //这个一定要放在最上面，作用是先删除dist目录再创建新的dist目录。里面的参数为要删除的目录，放在一个数组里面
        new HtmlWebpackPlugin({
            title:'webpack-test',    /*这个值对应html里的title*/
            template:'./src/index.html', //模板文件地址
            filename:'index.html',  //文件名，默认为index.html（路径相对于output.path的值）
            inject:true,    //script标签的位置，true/body为在</body>标签前，head为在<head>里，false表示页面不引入js文件
            hash:true,  //是否为引入的js文件添加hash值
            chunks:['index', 'utils'] //页面里要引入的js文件，值对应的是entry里的key。省略参数会把entry里所有文件都引入
            //excludeChunks:['one'],//页面里不能引入的js文件，与chunks刚好相反
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename:'css/index.css'    //文件目录会放入output.path里
        }),
        new webpack.HotModuleReplacementPlugin()    //引入热更新插件
    ],
    module:{
        rules:[
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test:/\.css$/,  //以点开始css结尾的文件
                use:[MiniCssExtractPlugin.loader,'css-loader']   //顺序不能搞错
            },
            {
                test:/\.(jpg|png|gif)$/,    //找到三种格式中的任意一种
                use:[{
                    loader:'url-loader',
                    options:{
                        limit:10*1024,  //小于该阈值就会转成base64
                        outputPath: 'images',
                        name: '[name].[ext]',
                    }
                }]
            },
            {
                test: /\.(ttf|eot|svg|woff|woff2)$/,
                use: [{
                    loader: 'file-loader',
                    options:{
                        outputPath: 'css/fonts',
                        publicPath: '/css/fonts',//引用文件路径
                        name: '[name].[ext]',
                    }
                }]
            },
        ]
    },
};

module.exports = config;