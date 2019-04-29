// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ['plugin:vue/essential', 'airbnb-base'],
  // required to lint *.vue files
  plugins: ['vue'],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    'linebreak-style': ['off', 'windows'],
    // don't require .vue extension when importing
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        vue: 'never'
      }
    ],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state', // for vuex state
          'acc', // for reduce accumulators
          'e' // for e.returnvalue
        ]
      }
    ],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': [
      'error',
      {
        optionalDependencies: ['test/unit/index.js']
      }
    ],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 1,
    semi: [2, 'always'],
    'no-unused-vars': 1,
    'comma-dangle': 0,
    strict: 0,
    'consistent-return': 0,
    'no-trailing-spaces': 0,
    'space-before-blocks': 0,
    'no-empty': 0,
    'max-len': 0,
    'no-mixed-operators': 0,
    'prefer-const': 0,
    'func-names': 0,
    'guard-for-in': 0,
    'no-restricted-syntax': 0,
    'no-plusplus': 0,
    'no-unused-expressions': 0,
    eqeqeq: 0,
    'global-require': 0,
    'no-bitwise': 0,
    'no-param-reassign': 0,
    'prefer-template': 0,
    'object-shorthand': 0,
    'quote-props': 0,
    'arrow-body-style': 1,
    radix: 0
  }
};
