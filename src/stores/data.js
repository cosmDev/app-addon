import { defineStore } from 'pinia'
import Long from 'long'
import axios from 'axios'
import { createProtobufRpcClient, QueryClient } from '@cosmjs/stargate'
import { Tendermint37Client } from '@cosmjs/tendermint-rpc'
import cosmosConfig from '@/cosmos.config'
import { setMsg } from '../libs/msgType'
import { selectSigner } from '@/libs/signer'

import * as bank from 'cosmjs-types/cosmos/bank/v1beta1/query'
import * as auth from 'cosmjs-types/cosmos/auth/v1beta1/query'
import * as staking from 'cosmjs-types/cosmos/staking/v1beta1/query'
import * as distrib from 'cosmjs-types/cosmos/distribution/v1beta1/query'

export const useDataStore = defineStore('data', {
  state: () => {
    return {
      dataIsLoaded: Boolean(false),
      rpcClient: null,
      rpcBase: null,
      sdkVersion: '',
      ibcVersion: '',
      chainOffline: Boolean(true),
      setChainSelected: Number(0),
      addrWallet: String,
      nameWallet: String,
      chainId: String,
      wallet: String,
      isLogged: Boolean(false),
      accounts: [],
      sessions: {},
      selectedAccount: Number(0),

      spendableBalances: Number(0),
      totalSupply: String,
      totalSupplyPrice: String,
      allWalletBalances: [],
      totalTokens: String,
      fiatWalletValue: String,
      totalDelegations: Number(0),
      totalUnbound: Number(0),
      totalRewards: Number(0.0),
      totalMyValidators: Number(0),
      totalDelegationsRewards: [],
      myDelegatorWithdrawAddress: String,
      allAuthz: [],
      lastTransactions: [],

      allValidators: [],
      countAllValidators: Number(0),

      // auto refresh
      autoRefresh: Boolean(true),
      autoRefreshTime: Number(5),
    }
  },
  actions: {
    async initRpc() {
      if (this.rpcClient) {
        this.rpcBase.disconnect()
      }
      try {
        const client = await Tendermint37Client.connect(cosmosConfig[this.setChainSelected].rpcURL)
        const queryClient = new QueryClient(client)
        const rpcClient = createProtobufRpcClient(queryClient)
        this.rpcClient = rpcClient
        this.rpcBase = client

        this.chainOffline = false
      } catch (e) {
        console.log('error', e)
        this.chainOffline = true
      }
    },
    async getWalletAmount() {
      let totalToken =
        Number(this.spendableBalances) +
        Number(this.totalDelegations) +
        Number(this.totalUnbound) +
        Number(this.totalRewards)

      this.totalTokens = totalToken.toFixed(6)
      // this.fiatWalletValue = totalToken * this.chainSelectedPrice;
    },
    async getBankModule() {
      const queryBank = new bank.QueryClientImpl(this.rpcClient)

      let spendableBalances = await queryBank.SpendableBalances({
        address: this.addrWallet,
      })
      console.log('spendableBalances', spendableBalances)

      let allBalances = await queryBank.AllBalances({
        address: this.addrWallet,
      })

      const found = spendableBalances.balances.find(
        (element) => element.denom === cosmosConfig[this.setChainSelected].coinLookup.chainDenom,
      )
      // TODO: fix this
      let returnValue = ''
      if (found?.amount > 0) {
        returnValue = found?.amount / 1000000
      } else {
        returnValue = 0
      }

      let totalSupply = await queryBank.SupplyOf({
        denom: cosmosConfig[this.setChainSelected].coinLookup.chainDenom,
      })
      this.spendableBalances = returnValue
      this.totalSupply = totalSupply.amount.amount
      this.totalSupplyPrice = (totalSupply.amount.amount / 1000000) * this.chainSelectedPrice
      this.allWalletBalances = allBalances.balances
    },
    async getStakingModule() {
      const queryStaking = new staking.QueryClientImpl(this.rpcClient)
      let getPoolStaking = await queryStaking.Pool({})
      let delegatorValidators = await queryStaking.DelegatorDelegations({
        delegatorAddr: this.addrWallet,
        pagination: {
          countTotal: false,
          key: '',
          offset: Long.fromNumber(0, true),
          limit: Long.fromNumber(200, true),
          reverse: false,
        },
      })

      let total = 0
      let allUnbound = await queryStaking.DelegatorUnbondingDelegations({
        delegatorAddr: this.addrWallet,
      })
      let totalUnbound = 0

      for (let i of delegatorValidators.delegationResponses) {
        total += Number(i.balance.amount)
      }
      if (allUnbound.unbondingResponses.length > 0) {
        for (let i of allUnbound.unbondingResponses) {
          for (let j of i.entries) {
            totalUnbound += Number(j.balance)
          }
        }
      } else {
        totalUnbound = 0.0
      }

      this.totalDelegations = (total / 1000000).toFixed(2)
      this.totalUnbound = (totalUnbound / 1000000).toFixed(2)
      this.poolStaking = getPoolStaking.pool
    },
    async getDistribModule() {
      const queryDistrib = new distrib.QueryClientImpl(this.rpcClient)
      const queryDistribResult = await queryDistrib.DelegationTotalRewards({
        delegatorAddress: this.addrWallet,
      })
      const found = queryDistribResult.total.find(
        (element) => element.denom === cosmosConfig[this.setChainSelected].coinLookup.chainDenom,
      )
      let returnValue = ''
      if (queryDistribResult.total.length > 0) {
        returnValue = Number(found.amount / 1000000000000000000000000).toFixed(6)
      } else {
        returnValue = 0.0
      }

      let oldValue = this.totalRewards
      this.totalMyValidators = queryDistribResult.rewards.length
      this.totalDelegationsRewards = queryDistribResult.rewards
      this.totalRewards = returnValue

      const queryWithdrawAddressResult = await queryDistrib.DelegatorWithdrawAddress({
        delegatorAddress: this.addrWallet,
      })
      // console.log('DelegatorWithdrawAddress', queryWithdrawAddressResult)
      this.myDelegatorWithdrawAddress = queryWithdrawAddressResult.withdrawAddress
    },
    async getAuthzModule() {
      const queryAuthz = new authz.QueryClientImpl(this.rpcClient)
      const queryAuthzResult = await queryAuthz.GranterGrants({
        granter: this.addrWallet,
      })

      // console.log('Authz', queryAuthzResult)

      for (let i = 0; i < queryAuthzResult.grants.length; i++) {
        queryAuthzResult.grants[i].finaleAuthzType = GenericAuthorization.decode(
          queryAuthzResult.grants[i].authorization.value,
        )
        let finalsTxs = setAuthzMsg(queryAuthzResult.grants[i].finaleAuthzType)
        queryAuthzResult.grants[i].finalData = finalsTxs
      }

      this.allAuthz = queryAuthzResult.grants
    },
    async getTransactions() {
      const resultSender = await axios(
        cosmosConfig[this.setChainSelected].apiURL +
          '/cosmos/tx/v1beta1/txs?query=message.sender=%27' +
          this.addrWallet +
          '%27&limit=10&order_by=2',
      )
      const resultRecipient = await axios(
        cosmosConfig[this.setChainSelected].apiURL +
          '/cosmos/tx/v1beta1/txs?query=transfer.recipient=%27' +
          this.addrWallet +
          '%27&limit=10&order_by=2',
      )
      const finalTxs = await resultSender.data.tx_responses.concat(
        resultRecipient.data.tx_responses,
      )
      let push_array = []
      for (let i of finalTxs) {
        let finalsTxs = setMsg(i.tx.body.messages[0], this.addrWallet, i.timestamp, i.txhash, {
          code: i.code,
          log: i.raw_log,
        })
        push_array.push(finalsTxs)
      }

      this.lastTransactions = push_array

      // console.log(finalSyntax)
      //this.lastTransactions = finalTxs
    },
    async getAllValidators() {
      let pingAllVal = await fetch(
        cosmosConfig[this.setChainSelected].apiURL +
          '/cosmos/staking/v1beta1/validators?pagination.limit=500&status=BOND_STATUS_BONDED',
      )

      let getValidators = await pingAllVal.json()
      this.allValidators = getValidators.validators
      this.countAllValidators = getValidators.validators.length
    },

    // Broadcast part
    async broadcastSendToken(recipientAddress, amount, denom, password) {
      let signer = await selectSigner(this.setChainSelected, password)
      console.log('signer send tx', signer)

      try {
        const msgSend = {
          fromAddress: this.addrWallet,
          toAddress: recipientAddress,
          amount: [
            {
              denom: denom,
              amount: String(amount),
            },
          ],
        }

        const txBody = {
          messages: [
            {
              typeUrl: '/cosmos.bank.v1beta1.MsgSend',
              value: msgSend,
            },
          ],
          memo: '',
        }

        const gasEstimate = 200000 // Adjust based on your network
        const fee = {
          amount: [
            {
              denom: denom,
              amount: String(5000), // Adjust fee amount
            },
          ],
          gas: String(gasEstimate),
        }

        console.log('txBody', txBody)

        const signedTx = await signer.client.signAndBroadcast(
          this.addrWallet,
          txBody.messages,
          fee,
          txBody.memo,
        )

        if (signedTx.code !== undefined && signedTx.code !== 0) {
          throw new Error(`Transaction failed with code: ${signedTx.code}, log: ${signedTx.rawLog}`)
        }

        console.log('Transaction successful:', signedTx)
        return signedTx
      } catch (error) {
        console.error('Error broadcasting transaction:', error)
        throw error
      }
    },
  },
})
