export default {
  pinnedPackages: [
    { name: '@types/chai', reason: 'esm-only' },
    { name: '@types/sinon-chai', reason: 'esm-only' },
    
    { name: 'react', reason: 'v19 requires further changes' },
    { name: '@types/react', reason: 'v19 requires further changes' },
    { name: 'react-dom', reason: 'v19 requires further changes' },
    { name: '@types/react-dom', reason: 'v19 requires further changes' },
  ],
};
