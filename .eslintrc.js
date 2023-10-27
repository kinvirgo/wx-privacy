module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ['standard-with-typescript', 'plugin:prettier/recommended'],
    overrides: [
        {
            files: ['*.wxs'],
            parserOptions: {
                extraFileExtensions: ['.wxs'],
            },
            parser: '@babel/eslint-parser',
        },
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['tsconfig.json', 'tsconfig.packages.json'],
        tsconfigRootDir: __dirname,
    },
    plugins: ['@typescript-eslint'],
    rules: {
        // 屏蔽vue-router按需加载(需要使用async-await)报错
        '@typescript-eslint/promise-function-async': 0,
        // 屏蔽ts写强制返回类型
        '@typescript-eslint/explicit-function-return-type': 0,
        // 屏蔽非boolean类型if判断报错
        '@typescript-eslint/strict-boolean-expressions': 0,
        // 屏蔽&&、||报错
        '@typescript-eslint/prefer-optional-chain': 0,
        // 屏蔽promise.then()第二个参数报错
        '@typescript-eslint/no-floating-promises': 0,
        // 首选无效合并
        '@typescript-eslint/prefer-nullish-coalescing': 0,
        // 变量定义
        'one-var': ['error', 'consecutive'],
        // 允许静态方法
        '@typescript-eslint/no-extraneous-class': 0,
        // 允许{}空默认类型
        '@typescript-eslint/ban-types': 0,
        // calss中this别名
        '@typescript-eslint/no-this-alias': 0,
        // callback调用
        'n/no-callback-literal': 0,
        // promise
        '@typescript-eslint/no-misused-promises': 0,
    },
}
