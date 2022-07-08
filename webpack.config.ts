import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

const common: Configuration = {
    mode: isDev ? 'development' : 'production',
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
    },
    externals: ['fsevents'],
    output: {
        publicPath: './',
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        assetModuleFilename: 'assets/[name][ext]'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: path.join(__dirname, 'src'),
                loader: 'ts-loader'
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: isDev
                        }
                    }
                ]
            },
            {
                test: /\.(ico|png|jpe?g|svg|eot|woff?2?)$/,
                type: 'asset/resource'
            }
        ]
    },
    watch: isDev,
    devtool: isDev ? 'inline-source-map' : undefined,
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 20000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }
};

const main: Configuration = {
    ...common,
    target: 'electron-main',
    entry: {
        main: './src/main.ts'
    }
};

const preload: Configuration = {
    ...common,
    target: 'electron-preload',
    entry: {
        preload: './src/preload.ts',
        'preload-console': './src/preload-console.ts'
    }
};

const renderer: Configuration = {
    ...common,
    target: 'web',
    entry: {
        app: './src/web/index.tsx'
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: './src/web/index.html'
        })
    ]
};

const console: Configuration = {
    ...common,
    target: 'web',
    entry: {
        console: './src/console/index.ts'
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: './src/console/console.html',
            filename: 'console.html'
        })
    ]
};

const config = isDev ? [renderer, console] : [main, preload, renderer, console];
export default config;
