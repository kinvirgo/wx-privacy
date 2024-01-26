module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ['standard-with-typescript', 'plugin:prettier/recommended'],
    overrides: [
        // 解析.wxs
        {
            files: ['*.wxs'],
            parser: '@babel/eslint-parser',
        },
    ],
    // 语法分析器
    parser: '@typescript-eslint/parser',
    // 语法分析器选项
    parserOptions: {
        // ECMAScript版本
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmafeatures: {},
        project: ['./tsconfig.json'],
        extraFileExtensions: ['.wxs'],
    },
    rules: {
        // 屏蔽-显式函数返回类型
        '@typescript-eslint/explicit-function-return-type': 0,
        // 屏蔽-非boolean类型if判断
        '@typescript-eslint/strict-boolean-expressions': 0,
        // 合并变量定义
        'one-var': ['error', { const: 'consecutive' }],
    },
}
