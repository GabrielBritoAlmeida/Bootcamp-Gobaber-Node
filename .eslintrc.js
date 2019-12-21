module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    camelcase: 'off',
    'prettier/prettier': 'error',
    //não obriga usar o this
    'class-methods-use-this': 'off',
    //permite receber o parametro e fazer alterações
    'no-param-reassign': 'off',
    //não reclama da varivel declarada sem uso
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
  },
};
