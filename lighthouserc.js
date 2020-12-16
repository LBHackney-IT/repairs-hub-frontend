module.exports = {
  ci: {
    collect: {
      startServerCommand: 'PORT=3005 yarn start',
      startServerReadyPattern: 'ready on',
      url: ['http://localhost:3005/'],
      numberOfRuns: 2,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.8 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
