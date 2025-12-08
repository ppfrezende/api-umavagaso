module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn', // or 'error' for a more strict approach
      {
        args: 'all', // Check all arguments for usage
        argsIgnorePattern: '^_', // Ignore arguments starting with underscore
        caughtErrors: 'all', // Check caught errors in catch blocks
        caughtErrorsIgnorePattern: '^_', // Ignore caught errors starting with underscore
        destructuredArrayIgnorePattern: '^_', // Ignore destructured array elements starting with underscore
        varsIgnorePattern: '^_', // Ignore variables starting with underscore
        ignoreRestSiblings: true, // Ignore rest siblings in object destructuring
      },
    ],
  },
};
