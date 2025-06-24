module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [2, 'always', 200],
    'subject-case': [
      2,
      'always',
      ['sentence-case', 'pascal-case', 'upper-case']
    ]
  }
}
