import { SigningStargateClient, GasPrice } from '@cosmjs/stargate'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'
import cosmosConfig from '@/cosmos.config'

export async function selectSigner(chain, password) {
  let itemAccounts = await chrome.storage.local.get(['accounts'])
  const deserialized = await DirectSecp256k1HdWallet.deserialize(
    itemAccounts.accounts[0].data,
    password,
  )
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(deserialized.secret.data, {
    prefix: cosmosConfig[chain].coinLookup.addressPrefix,
  })
  const accounts = await wallet.getAccounts()

  const client = await SigningStargateClient.connectWithSigner(cosmosConfig[chain].rpcURL, wallet, {
    gasPrice: GasPrice.fromString(
      cosmosConfig[chain].gasPrice + cosmosConfig[chain].coinLookup.chainDenom,
    ),
  })
  return { client, accounts }
}
