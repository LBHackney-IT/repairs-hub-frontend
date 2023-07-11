module.exports = {
  presets: ['next/babel'],
  plugins: [
    require('@babel/plugin-proposal-decorators').default,
    {
      legacy: true
    }
  ]
}
