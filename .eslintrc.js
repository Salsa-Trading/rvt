module.exports = {
  root: true,
  settings: {
    react: {
      version: 'detect'
    }
  },
  ignorePatterns: [
    '/build/',
    '/node_modules/',
  ],
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:unicorn/recommended'],
  overrides: [
    // TypeScript
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json'
      },
      settings: {
        'import/extensions': ['.ts', '.tsx'],
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', 'tsx']
        },
        'import/resolver': {
          node: {
            extensions: ['.ts', '.tsx']
          }
        }
      },
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
      ],
      plugins: [
        '@typescript-eslint'
      ],
      rules: {
        // Custom rules
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/explicit-member-accessibility': ['error', {
          overrides: {
            constructors: 'off'
          }
        }],
        '@typescript-eslint/indent': [
          'error',
          2,
          {
            ignoredNodes: [
              // Generics are not properly indented
              'TSTypeParameterInstantiation',
              'TSInterfaceHeritage',

              // Intersected types not always properly indented
              'TSIntersectionType',

              // 'implements' and 'extends' keywords sometimes improperly indented
              'ClassDeclaration'
            ],
            offsetTernaryExpressions: true,
            SwitchCase: 1
          }
        ],
        '@typescript-eslint/no-invalid-this': 'error',
        '@typescript-eslint/no-throw-literal': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            // Allow unused arguments in functions
            args: 'none',
            varsIgnorePattern: '^[_T]',
            ignoreRestSiblings: true
          }
        ],
        '@typescript-eslint/no-useless-constructor': 'error',
        '@typescript-eslint/quotes': ['error', 'single', {avoidEscape: true}],
        '@typescript-eslint/object-curly-spacing': ['error', 'never'],
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/prefer-readonly': 'error',
        '@typescript-eslint/semi': 'error',
        '@typescript-eslint/space-before-function-paren': ['error', {
          anonymous: 'never',
          named: 'never',
          asyncArrow: 'ignore'
        }],
        '@typescript-eslint/type-annotation-spacing': ['error', {
          before: false,
          after: true,
          overrides: {
            arrow: {
              before: true
            }
          }
        }],

        // Disabled rules -- have TypeScript replacement
        indent: 'off',
        'no-invalid-this': 'off',
        'no-throw-literal': 'off',
        'no-unused-vars': 'off',
        'no-useless-constructor': 'off',
        'object-curly-spacing': 'off',
        quotes: 'off',
        semi: 'off',
        'space-before-function-paren': ['off'],

        // Disabled rules
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
        '@typescript-eslint/no-unnecessary-type-constraint': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/prefer-as-const': 'off',
        '@typescript-eslint/prefer-regexp-exec': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/triple-slash-reference': 'off',
        '@typescript-eslint/unbound-method': 'off'
      }
    },

    // JavaScript
    {
      files: ['**/*.js'],
      env: {
        node: true
      }
    },
  ],
  rules: {
    // Custom rules
    'arrow-spacing': ['error', {
      before: true,
      after: true
    }],
    'brace-style': [
      'error',
      '1tbs',
      {
        allowSingleLine: true
      }
    ],
    'comma-dangle': 'error',
    'comma-spacing': ['error', {before: false, after: true}],
    curly: 'error',
    eqeqeq: 'error',
    indent: [
      'error',
      2,
      {
        offsetTernaryExpressions: true,
        SwitchCase: 1
      }
    ],
    'key-spacing': ['error', {
      mode: 'strict'
    }],
    'jsx-quotes': ['error', 'prefer-single'],
    'linebreak-style': ['error', 'unix'],
    'no-throw-literal': ['error'],
    'prefer-const': [
      'error',
      {
        destructuring: 'all'
      }
    ],
    quotes: ['error', 'single', {avoidEscape: true}],
    'max-len': [
      'error',
      {
        code: 200,
        ignoreStrings: true,
        ignoreTemplateLiterals: true
      }
    ],
    'no-caller': 'error',
    'no-console': [
      'error',
      {
        allow: [
          'assert',
          'clear',
          'Console',
          'context',
          'count',
          'countReset',
          'debug',
          'dir',
          'dirxml',
          'error',
          'group',
          'groupCollapsed',
          'groupEnd',
          'info',
          'profile',
          'profileEnd',
          'table',
          'timeLog',
          'timeStamp',
          'warn'
        ]
      }
    ],
    'no-eval': 'error',
    'no-invalid-this': ['error'],
    'no-irregular-whitespace': ['error', {skipStrings: false}],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 2,
        maxEOF: 0,
        maxBOF: 0
      }
    ],
    'no-new-wrappers': 'error',
    'no-restricted-globals': ['error',
      'bbenchmark',
      'event',
      'fdescribe',
      'fit',
      'length',
      'name',
      'open',
      'performance',
      'ssuite',
      'status'
    ],
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true
      }
    ],
    'no-useless-constructor': 'error',
    'no-var': 'error',
    'no-sequences': 'error',
    'no-trailing-spaces': ['error'],
    'object-curly-spacing': ['error', 'never'],
    'prefer-object-spread': 'error',
    'quote-props': ['error', 'as-needed'],
    'react/jsx-equals-spacing': ['error', 'never'],
    'react/no-string-refs': ['error', {noTemplateLiterals: true}],
    'react/jsx-max-props-per-line': [2, {maximum: 1, when: 'multiline'}],
    'react/jsx-wrap-multilines': 'error',
    'semi-spacing': ['error', {
      before: false,
      after: true
    }],
    'space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'ignore'
    }],
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': ['error'],
    'spaced-comment': ['error', 'always', {
      markers: ['/'],
      exceptions: ['*', '-', '/']
    }],

    // Rules we can leave off permanently
    'arrow-body-style': 'off',
    'keyword-spacing': 'off',
    'no-async-promise-executor': 'off',
    'no-case-declarations': 'off',
    'no-constant-condition': 'off',
    'no-empty-pattern': 'off',
    'no-empty': 'off',
    'no-ex-assign': 'off',
    'no-extra-boolean-cast': 'off',
    'no-inner-declarations': 'off',
    'no-prototype-builtins': 'off',
    'no-useless-escape': 'off',
    'react/display-name': 'off',
    'react/jsx-boolean-value': 'off',
    'react/jsx-no-bind': 'off',
    'react/jsx-no-target-blank': 'off',
    'react/no-children-prop': 'off',
    'react/no-find-dom-node': 'off',
    'react/no-unescaped-entities': 'off',
    'react/prop-types': 'off',
    'unicorn/better-regex': 'off',
    'unicorn/catch-error-name': 'off',
    'unicorn/consistent-destructuring': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/escape-case': 'off',
    'unicorn/explicit-length-check': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/import-style': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-array-method-this-argument': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-await-expression-member': 'off',
    'unicorn/no-document-cookie': 'off',
    'unicorn/no-empty-file': 'off',
    'unicorn/no-for-loop': 'off',
    'unicorn/no-lonely-if': 'off',
    'unicorn/no-nested-ternary': 'off',
    'unicorn/no-new-array': 'off',
    'unicorn/no-null': 'off',
    'unicorn/no-object-as-default-parameter': 'off',
    'unicorn/no-process-exit': 'off',
    'unicorn/no-this-assignment': 'off',
    'unicorn/no-useless-undefined': 'off',
    'unicorn/numeric-separators-style': 'off',
    'unicorn/prefer-add-event-listener': 'off',
    'unicorn/prefer-array-flat': 'off',
    'unicorn/prefer-code-point': 'off',
    'unicorn/prefer-dom-node-append': 'off',
    'unicorn/prefer-dom-node-remove': 'off',
    'unicorn/prefer-export-from': 'off',
    'unicorn/prefer-math-trunc': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/prefer-negative-index': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/prefer-number-properties': 'off',
    'unicorn/prefer-optional-catch-binding': 'off',
    'unicorn/prefer-query-selector': 'off',
    'unicorn/prefer-regexp-test': 'off',
    'unicorn/prefer-spread': 'off',
    'unicorn/prefer-string-slice': 'off',
    'unicorn/prefer-switch': 'off',
    'unicorn/prefer-ternary': 'off', // using tslint's prefer-conditional-expression instead
    'unicorn/prefer-type-error': 'off',
    'unicorn/prevent-abbreviations': 'off'
  }
};
