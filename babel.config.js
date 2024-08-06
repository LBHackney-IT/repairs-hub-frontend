// module.exports = {
//   presets: ['next/babel'],
//   plugins: [
//     '@babel/plugin-proposal-class-properties',
//     '@babel/plugin-transform-private-methods',
//   ],
// }


module.exports = {
  "presets": ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "regenerator": true
      }
    ]
  ],
  "env": {
    "test": {
      "presets": [
        [
          "@babel/preset-env",
          {
            "targets": "current node"
          }
        ]
      ]
    }
  }
}#