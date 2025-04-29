<template>
  <v-container fluid>
    <div class="mb-4">
      <v-btn icon="mdi-arrow-left" to="/start" size="small"></v-btn>
      <span class="text-h6 mt-6">Generate mnenomic</span>
    </div>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-list>
            <v-alert
              v-model="alertError"
              class="ma-4"
              variant="outlined"
              type="warning"
              border="top"
              closable
              close-label="Close Alert"
            >
              Bad password
            </v-alert>
            <v-list-item>
              <v-text-field
                v-model="name"
                variant="outlined"
                counter="12"
                label="Wallet name"
                class="mt-2"
                density="compact"
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-textarea
                v-model="mnemonic"
                auto-grow
                variant="outlined"
                label="Mnemonic"
                rows="4"
                class="mt-2"
                density="compact"
              >
                <v-btn block variant="tonal" @click="generateWallet()">
                  generate mnenomic
                </v-btn></v-textarea
              >
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model="password"
                variant="outlined"
                counter="6"
                label="Password"
                type="password"
                class="mt-2"
                density="compact"
              ></v-text-field>
              <v-btn block variant="tonal" @click="saveWallet()"> Save wallet </v-btn>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'

export default {
  data: () => ({
    passWord: '',
    dialogImport: false,
    dialogCreate: false,
    dialogMasterPassword: false,
    name: '',
    mnemonic: '',
    password: '',
    select: '',
    items: [],
    alertError: false,
    alertSuccess: false,
    alertDelete: false,
    passExist: false,
  }),
  mounted() {
    this.generateWallet()
  },
  methods: {
    async saveWallet() {
      /*       if (this.password.length < 6) {
        this.alertError = true;
        return;
      } */
      this.alertError = false
      const walletData = {
        name: this.name,
        mnemonic: this.mnemonic,
        password: this.password,
      }
      console.log(walletData)

      try {
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(this.mnemonic, {
          prefix: 'dev',
        })
        const [firstAccount] = await wallet.getAccounts()

        var finalWallet = await wallet.serialize(this.password)

        /* chrome.storage.local.set({ "accounts": { data: finalWallet, address: firstAccount.address, name: this.walletName } } , function(){
            //  Data's been saved boys and girls, go on home
        });  */
        let finalName = this.name
        chrome.storage.local.get(['accounts'], function (items) {
          console.log(items.accounts)

          if (typeof items.accounts !== 'undefined') {
            items.accounts.push({
              data: finalWallet,
              address: firstAccount.address,
              name: finalName,
            })
            console.log(items.accounts)
            chrome.storage.local.set({ accounts: items.accounts }, function () {
              //  Data's been saved boys and girls, go on home
            })
          } else {
            chrome.storage.local.set(
              { accounts: [{ data: finalWallet, address: firstAccount.address, name: finalName }] },
              function () {
                //  Data's been saved boys and girls, go on home
              },
            )
          }
        })

        /* await Preferences.set({
          key: this.walletName,
          value: JSON.stringify({ data: finalWallet, address: firstAccount.address, name: this.walletName })
        });        
        const list = await Preferences.keys(); */
        //notifAccountAdded(this.$toast, 'Account added')
        // await this.$store.dispatch('wallets/getAllWallets')
      } catch (error) {
        console.log(error)
        this.viewError = true
        this.viewErrorMsg = error
      }

      // Save the wallet to the store or local storage
    },
    async generateWallet() {
      const wallet = await DirectSecp256k1HdWallet.generate(12)
      console.log(wallet)
      this.mnemonic = wallet.mnemonic
    },
  },
}
</script>
