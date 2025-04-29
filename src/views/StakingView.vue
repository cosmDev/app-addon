<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-card
        prepend-icon="mdi-information-slab-box-outline"
        text="Here is the list of all validators"
        title="All validators"
      >
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">VP</th>
              <th class="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in store.allValidators" :key="item.operator_address">
              <!-- {{ item }} -->
              <td>{{ item.description.moniker }}</td>
              <td>{{ item.tokens / 1000000 }}</td>
              <td>
                <v-icon
                  icon="mdi-transfer-down"
                  @click="configDelegation(1, item.operator_address, item.description.moniker)"
                ></v-icon>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-col>
    <!-- 
        <v-col cols="12" md="6">
          <v-card
            href="https://play.vuetifyjs.com"
            prepend-icon="$vuetify-play"
            target="_blank"
            text="Test Vuetify out in our playground"
            title="Create a Playground"
          ></v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card
            href="https://bin.vuetifyjs.com"
            prepend-icon="mdi-delete"
            target="_blank"
            text="Create a new bin to store your code"
            title="Create a Bin"
          ></v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card
            href="https://issues.vuetifyjs.com"
            prepend-icon="$warning"
            target="_blank"
            text="File a bug report for Vuetify"
            title="Report a Bug"
          ></v-card>
        </v-col> -->
  </v-row>

  <div class="text-center pa-4">
    <v-dialog v-model="dialog" width="auto" scroll-strategy="none">
      <v-card
        max-width="400"
        prepend-icon="mdi-arrange-send-to-back"
        text="Here you can set a new delegation on validator selected"
        title="Staking"
      >
        <v-card-text>
          <v-text-field
            v-model="delegateAmount"
            label="Amount to delegate"
            variant="outlined"
            density="compact"
          ></v-text-field>
          <v-text-field
            v-model="password"
            variant="outlined"
            label="Password"
            type="password"
            class="mt-2"
            density="compact"
          ></v-text-field>
        </v-card-text>

        <v-btn block variant="tonal" text="Stake!" @click="delegateNow()"></v-btn>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogReturnTx" width="auto" scroll-strategy="none">
      <v-card max-width="400" title="Staking">
        <v-card-text>
          {{ dialogReturnTxText }}
        </v-card-text>

        <v-btn block variant="tonal" text="Close" @click="dialogReturnTx = false"></v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import {
  defaultRegistryTypes,
  SigningStargateClient,
  GasPrice,
  calculateFee,
} from '@cosmjs/stargate'
import { coin, coins } from '@cosmjs/proto-signing'
import bech32 from 'bech32'

import { useDataStore } from '@/stores/data.js'
import cosmosConfig from '@/cosmos.config'
import { selectSigner } from '@/libs/signer'

export default {
  name: 'StakingView',
  data: () => ({
    theme: 'light',
    drawer: null,
    cosmosConfig,

    dialog: false,
    dialogReturnTx: false,

    delegateTo: '',
    delegateAmount: '',
    delegateName: '',
    password: '',
  }),
  setup() {
    const store = useDataStore()
    return { store }
  },
  methods: {
    configDelegation(amount, validator, name) {
      this.delegateTo = validator
      this.delegateAmount = amount
      this.delegateName = name
      console.log('configDelegation', this.delegateTo, this.delegateAmount)
      this.dialog = true
    },
    async delegateNow() {
      this.step1 = false
      this.step2 = true

      if (this.delegateNow) {
        let signer = await selectSigner(this.store.setChainSelected, this.password)

        if (!signer) {
          console.error('No signer found')
          return
        }
        const foundMsgType = defaultRegistryTypes.find(
          (element) => element[0] === '/cosmos.staking.v1beta1.MsgDelegate',
        )

        const finalAmount = {
          denom: cosmosConfig[this.store.setChainSelected].coinLookup.chainDenom,
          amount: (this.delegateAmount * 1000000).toString(),
        }
        const finalMsg = {
          typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({
            delegatorAddress: signer.accounts[0].address,
            validatorAddress: this.delegateTo,
            amount: finalAmount,
          }),
        }
        // Fee/Gas
        let gasEstimation = ''
        try {
          gasEstimation = await signer.client.simulate(
            signer.accounts[0].address,
            [finalMsg],
            'Delegate Tokens',
          )
        } catch (error) {
          console.error('Error estimating gas:', error)
          this.dialog = false
          this.dialogReturnTx = true
          this.dialogReturnTxText = `Error simulate transaction!` + error

          return
        }
        const usedFee = calculateFee(
          Math.round(gasEstimation * cosmosConfig[this.store.setChainSelected].feeMultiplier),
          GasPrice.fromString(
            cosmosConfig[this.store.setChainSelected].gasPrice +
              cosmosConfig[this.store.setChainSelected].coinLookup.chainDenom,
          ),
        )
        this.gasFee = { fee: usedFee.amount[0].amount / 1000000, gas: usedFee.gas }

        const feeAmount = coins(
          usedFee.amount[0].amount,
          cosmosConfig[this.store.setChainSelected].coinLookup.chainDenom,
        )
        let finalFee = {
          amount: feeAmount,
          gas: usedFee.gas,
          // granter: this.store.setFeePayer,
        }

        try {
          const result = await signer.client.signAndBroadcast(
            signer.accounts[0].address,
            [finalMsg],
            finalFee,
            '',
          )
          console.log(result)
          this.txResult = result
          this.dialog = false
          this.dialogReturnTx = true
          this.dialogReturnTxText = `Transaction sent!`
        } catch (error) {
          this.dialog = false
          this.dialogReturnTx = true
          this.dialogReturnTxText = `Error sending transaction!` + error
          console.error(error)
        }
      }
    },
  },
}
</script>
