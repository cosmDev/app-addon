<template>
  <main>
    <!--     <v-container fluid>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-card>
            <v-card-title>My wallet</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              {{ this.store.accounts[this.store.selectedAccount].address }}</v-card-text
            >
          </v-card>
        </v-col>
      </v-row>
    </v-container> -->
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-card>
            <v-card-title>Total tokens</v-card-title>
            <v-card-subtitle>
              {{ this.store.accounts[this.store.selectedAccount].address }}
            </v-card-subtitle>
            <v-divider class="mt-2"></v-divider>
            <v-card-text>
              <p class="text-right">
                {{ this.store.totalTokens }}
                <strong>{{ defaultChain.coinLookup.viewDenom }}</strong>
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid>
      <v-row>
        <v-col cols="6">
          <v-card class="pa-2 mb-2">
            <v-row>
              <v-col sm="4">
                <span class="font-weight-bold">Available</span>
              </v-col>
              <v-col sm="4" class="text-right">
                <v-btn size="x-small" variant="tonal" class="mb-2" @click="dialogSend = true">
                  <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <p class="text-right mt-2">
              {{ store.spendableBalances }} <strong>{{ defaultChain.coinLookup.viewDenom }}</strong>
            </p>
          </v-card>
          <v-card class="pa-2 mb-2">
            <p class="text-left">Delegated</p>
            <v-divider></v-divider>
            <p class="text-right mt-2">
              {{ store.totalDelegations }} <strong>{{ defaultChain.coinLookup.viewDenom }}</strong>
            </p>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="pa-2 mb-2">
            <v-row>
              <v-col sm="4">
                <span class="font-weight-bold">Rewards </span>
              </v-col>
              <v-col sm="4" class="text-right">
                <v-btn
                  disabled
                  size="x-small"
                  variant="tonal"
                  class="mb-2"
                  @click="dialogGetReward = true"
                >
                  <v-icon>mdi-arrow-down-thin</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <p class="text-right mt-2">
              {{ store.totalRewards }} <strong>{{ defaultChain.coinLookup.viewDenom }}</strong>
            </p>
          </v-card>
          <v-card class="pa-2 mb-2">
            <p class="text-left">Unbonding</p>
            <v-divider></v-divider>
            <p class="text-right mt-2">
              {{ store.totalUnbound }} <strong>{{ defaultChain.coinLookup.viewDenom }}</strong>
            </p>
          </v-card>
        </v-col>
        <!--         <v-col>
          <v-btn block variant="tonal" class="mb-2" @click="dialogSend = true">
            <v-icon>mdi-arrow-right</v-icon>
            Send
          </v-btn>
          <v-btn disabled block variant="tonal"  @click="dialogGetReward = true"> Get reward </v-btn> 
        </v-col> -->
      </v-row>

      <v-dialog
        v-model="dialogSend"
        transition="dialog-bottom-transition"
        fullscreen
        scroll-strategy="none"
      >
        <v-card>
          <v-toolbar>
            <v-btn icon="mdi-close" @click="dialogSend = false"></v-btn>

            <v-toolbar-title>Send</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-sheet
              v-if="returnSend"
              class="pa-4 text-center mx-auto"
              elevation="12"
              max-width="600"
              rounded="lg"
              width="100%"
            >
              <v-icon class="mb-5" color="success" icon="mdi-check-circle" size="112"></v-icon>

              <h2 class="text-h5 mb-6">Your tx is send</h2>

              <p class="mb-4 text-medium-emphasis text-body-2">
                This is the tx hash, click
                <a class="text-decoration-none text-info" href="#">{{
                  returnSendData?.transactionHash
                }}</a>

                <br />

                Otherwise, you're done!
              </p>

              <v-divider class="mb-4"></v-divider>

              <div class="text-end">
                <v-btn
                  class="text-none"
                  color="success"
                  variant="flat"
                  width="90"
                  rounded
                  @click="dialogSend = false"
                >
                  Close
                </v-btn>
              </div>
            </v-sheet>

            <v-row v-if="!returnSend" dense>
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  v-model="sendTo"
                  label="Send to"
                  required
                  density="compact"
                  variant="outlined"
                  name="addressTo"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  v-model="amountToSend"
                  label="Amount"
                  required
                  density="compact"
                  variant="outlined"
                  name="amountToSend"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  v-model="password"
                  label="Password*"
                  variant="outlined"
                  persistent-hint
                  required
                  density="compact"
                ></v-text-field>
                <v-btn
                  text="Send now!"
                  block
                  variant="tonal"
                  @click="startSendToken()"
                  :loading="loading"
                ></v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="dialogGetReward"
        transition="dialog-bottom-transition"
        fullscreen
        scroll-strategy="none"
      >
        <v-card>
          <v-toolbar>
            <v-btn icon="mdi-close" @click="dialogGetReward = false"></v-btn>

            <v-toolbar-title>Get rewards</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-row dense>
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  v-model="password"
                  label="Password*"
                  variant="outlined"
                  persistent-hint
                  required
                  density="compact"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text="Close" variant="plain" @click="dialogGetReward = false"></v-btn>

            <v-btn
              color="primary"
              text="Get rewards"
              variant="tonal"
              @click="dialogGetReward = false"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </main>
</template>
<script>
import { useDataStore } from '@/stores/data.js'
import cosmosConfig from '@/cosmos.config'

export default {
  name: 'HomeView',
  data: () => ({
    theme: 'light',
    drawer: null,
    cosmosConfig,
    defaultChain: cosmosConfig[0],
    dialogSend: false,
    dialogGetReward: false,

    // Form data
    sendTo: '',
    amountToSend: '',
    password: '',

    // Form validation
    returnSend: false,
    returnSendData: '',

    loading: false,
  }),
  setup() {
    const store = useDataStore()

    return {
      store,
    }
  },
  methods: {
    async startSendToken() {
      // Logic to send token
      this.loading = true
      let returnSend = await this.store.broadcastSendToken(
        this.sendTo,
        this.amountToSend,
        'stake',
        this.password,
      )
      this.returnSendData = returnSend
      console.log('returnSend', returnSend)
      if (returnSend.code === 0) {
        this.returnSend = true
      } else {
        this.returnSend = false
      }
    },
    getReward() {
      // Logic to get reward
      this.dialogGetReward = false
    },
  },
}
</script>
