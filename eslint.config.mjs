import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/multi-word-component-names': 'off',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'vue/html-self-closing': ['error', {
      html: { void: 'always', normal: 'always', component: 'always' },
    }],
  },
})
