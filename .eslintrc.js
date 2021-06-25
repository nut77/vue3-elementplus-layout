module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['plugin:vue/vue3-essential', 'standard', 'plugin:prettier/recommended', 'prettier/vue'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['vue'],
  rules: {
    // 以prettier规则为准
    'prettier/prettier': 2,
    // 0-'off' 1-'warn' 2-'error'
    'generator-star-spacing': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    semi: [2, 'always'],
    quotes: 'single',
    'no-extra-semi': 2,
    'space-before-function-paren': [0, 'always'],
    'no-else-return': 2,
    'no-empty-function': 2,
    'multiline-comment-style': 2,
    'no-inline-comments': 2,
    'no-lonely-if': 2,
    'no-multi-assign': 2,
    'no-trailing-spaces': [2, {skipBlankLines: true}],
    'object-curly-spacing': [2, 'never'],
    'vue/no-multiple-template-root': 0
  }
};
