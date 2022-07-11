import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
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
    optimization: isDev ? undefined : {
        minimize: true,
        minimizer: [new TerserPlugin()],
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
        'preload-launcher': './src/preload-launcher.ts',
        preload: './src/preload.ts',
        'preload-console': './src/preload-console.ts'
    }
};

const launcher: Configuration = {
    ...common,
    target: 'web',
    entry: {
        launcher: './src/launcher/index.tsx'
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: './src/launcher/index.html',
            filename: 'launcher.html'
        })
    ]
};

const app: Configuration = {
    ...common,
    target: 'web',
    entry: {
        app: './src/app/index.tsx'
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: './src/app/index.html'
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
            template: './src/console/index.html',
            filename: 'console.html'
        })
    ]
};

const config = isDev ? [launcher, app, console] : [main, preload, launcher, app, console];
export default config;
