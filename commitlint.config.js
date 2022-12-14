module.exports = {
  parserPreset: {
    parserOpts: {
      headerPattern: /^(?:(:\w+:)\s)?\[(\w+)\] (.+)/,
      headerCorrespondence: ['type', 'scope', 'subject'],
    },
  },
  plugins: [
    {
      rules: {
        'header-match-team-pattern': (parsed) => {
          const {type, scope, subject} = parsed
          if (type == null && scope == null && subject == null) {
            return [
              false,
              'Header must be in format :gitmoji:? [scope] subject',
            ]
          }
          return [true, '']
        },
        'gitmoji-type-enum': (parsed, _when, expectedValue) => {
          const {type} = parsed
          if (type && !expectedValue.includes(type)) {
            return [
              false,
              `type must be one of ${expectedValue}
                            see https://gitmoji.dev`,
            ]
          }
          return [true, '']
        },
      },
    },
  ],
  rules: {
    'header-match-team-pattern': [2, 'always'],
    'gitmoji-type-enum': [
      2,
      'always',
      [':bug:', ':sparkles:', ':ambulance:', ':art:', ':zap:', ':lock:'],
    ],
  },
}
