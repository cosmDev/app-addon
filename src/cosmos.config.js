import igniteConfig from './ignite.config.json'

export default [
  {
    chainId: igniteConfig.chainID,
    name: igniteConfig.chainID,
    desc: 'Description for ' + igniteConfig.chainID,
    apiURL: 'http://localhost:1317',
    rpcURL: 'http://localhost:26657',
    coinLookup: {
      viewDenom: igniteConfig.chainViewdenom,
      chainDenom: igniteConfig.chainDenom,
      addressPrefix: igniteConfig.chainPrefix,
    },
    feeMultiplier: 1.3,
    gasPrice: 0.025,
  },
]
