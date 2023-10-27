// ~build/compiler.js
const { globSync } = require('glob')
const fs = require('fs')
const path = require('path')
const rollup = require('rollup')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('rollup-plugin-typescript2')
const autoprefixer = require('autoprefixer')
const postcss = require('postcss')
const sass = require('sass')
// const cssnano = require("cssnano");
const terser = require('@rollup/plugin-terser')
const htmlMinify = require('html-minifier')
const uglifyJS = require('uglify-js')
const resolveRoot = file => path.resolve(__dirname, path.join('../', file))
const tsconfigPackages = resolveRoot('tsconfig.packages.json')
const sep = path.sep
const pkg = require('../package.json')
const banner = `/*!
    * ${pkg.name} ${pkg.version}
    * (c) ${new Date().getFullYear()} ${pkg.author}
    * @license MIT
    */`

/**
 * 读取打包路径
 * @param {*} src
 * @param {*} dist
 * @returns
 */
function createPackages(src, dist) {
    return (type, ext) => {
        return globSync(`${src}/**/*.json`, { absolute: true }).map(file => {
            // 处理同类型文件
            ext = ext ?? type
            return type && ext
                ? {
                      input: file.replace(/(\.)json$/, `$1${type}`),
                      output: file
                          .replace(src, dist)
                          .replace(/(\.)json$/, `$1${ext}`),
                  }
                : {
                      input: file,
                      output: file.replace(src, dist),
                  }
        })
    }
}

/**
 * 写入文件,自动递归创建目录
 * @param {*} path
 * @param {*} data
 */
function writeFileSync(path, data) {
    let dir = path.split(sep).slice(0, -1).join(sep)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(path, data)
}

/**
 * 同步复制文件
 * @param {*} src
 * @param {*} dist
 */
function copyFileSync(src, dist) {
    let dir = dist.split(sep).slice(0, -1).join(sep)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
    fs.copyFileSync(src, dist)
}

/**
 * sass编译
 * @param {*} src
 * @param {*} dist
 */
function sassCompiler(src, dist) {
    createPackages(src, dist)('scss', 'wxss').forEach(({ input, output }) => {
        const res = sass.compile(input, { style: 'compressed' })
        postcss([autoprefixer])
            .process(res.css, {
                from: input,
                to: output,
            })
            .then(res => {
                writeFileSync(output, res.css)
            })
    })
}

/**
 * 编译ts
 * @param {*} src
 * @param {*} dist
 */
function tsCompiler(src, dist) {
    const plugins = [
        nodeResolve(),
        commonjs(),
        typescript({
            tsconfig: tsconfigPackages,
        }),
        terser(),
    ]

    createPackages(src, dist)('ts', 'js').forEach(({ input, output }) => {
        const rollupOptions = {
            input,
            output: {
                file: output,
                format: 'cjs',
                banner,
            },
            plugins,
        }

        rollup.rollup(rollupOptions).then(bundle => {
            bundle.write(rollupOptions.output)
            bundle.close()
        })
    })
}

/**
 * 复制文件
 * @param {*} src
 * @param {*} dist
 */
function copyJson(src, dist) {
    createPackages(src, dist)().forEach(({ input, output }) => {
        // copyFileSync(input, output)

        const file = fs.readFileSync(input)
        writeFileSync(output, JSON.stringify(JSON.parse(file.toString())))
    })
}

/**
 * 复制wxml
 * @param {*} src
 * @param {*} dist
 */
function copyWxml(src, dist) {
    createPackages(
        src,
        dist,
    )('wxml').forEach(({ input, output }) => {
        // copyFileSync(input, output)

        const file = fs.readFileSync(input)
        writeFileSync(
            output,
            htmlMinify.minify(file.toString(), {
                collapseWhitespace: true,
                sortAttributes: true,
                removeComments: true,
                keepClosingSlash: true,
            }),
        )
    })
}

/**
 * 复制wxs
 * @param {*} src
 * @param {*} dist
 */
function copyWxs(src, dist) {
    globSync(`${src}/**/*.wxs`, { absolute: true }).forEach(input => {
        const output = input.replace(src, dist),
            file = fs.readFileSync(input),
            res = uglifyJS.minify(file.toString())
        if (res.code) {
            writeFileSync(output, res.code)
        }
    })
}

sassCompiler(resolveRoot('packages'), resolveRoot('dist'))
tsCompiler(resolveRoot('packages'), resolveRoot('dist'))
copyJson(resolveRoot('packages'), resolveRoot('dist'))
copyWxml(resolveRoot('packages'), resolveRoot('dist'))
copyWxs(resolveRoot('packages'), resolveRoot('dist'))