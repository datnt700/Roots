export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allowed types for this project
    'type-enum': [
      2,
      'always',
      [
        'feat', // new feature
        'fix', // bug fix
        'docs', // documentation
        'style', // formatting, no code change
        'refactor', // code change that's neither fix nor feat
        'perf', // performance improvement
        'test', // adding or fixing tests
        'build', // build system or external deps
        'ci', // CI/CD changes
        'chore', // other changes (e.g. release)
        'revert', // revert a commit
      ],
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'header-max-length': [2, 'always', 100],
  },
}
