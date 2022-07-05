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
        path: path.resolve(__dirname, isDev ? 'dist' : 'build'),
        filename: '[name].js',
        assetModuleFilename: 'assets/[name][ext]'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: isDev,
                        },
                    }
                ],
            },
            {
                test: /\.(ico|png|jpe?g|svg|eot|woff?2?)$/,
                type: 'asset/resource',
            },
        ],
    },
    watch: isDev,
    devtool: isDev ? 'inline-source-map' : undefined,
};

const main: Configuration = {
    ...common,
    target: 'electron-main',
    entry: {
        main: './src/main.ts',
    },
};

const preload: Configuration = {
    ...common,
    target: 'electron-preload',
    entry: {
        preload: './src/preload.ts',
    },
};

const renderer: Configuration = {
    ...common,
    target: 'web',
    entry: {
        app: './src/web/index.tsx',
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: './src/web/index.html',
        }),
    ],
};

const config = isDev ? renderer : [main, preload, renderer];
export default config;
