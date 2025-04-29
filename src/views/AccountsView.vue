<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-card
          v-for="(account, index) in store.accounts"
          :key="index"
          :title="account.name"
          append-icon="mdi-trash-can-outline"
          :text="truncate(account.address)"
          class="ma-2"
          elevation="0"
          border
        >
          <template v-slot:append>
            <v-btn
              icon="mdi-trash-can-outline"
              @click="deleteWallet(index)"
              size="small"
              variant="plain"
            ></v-btn>
          </template>
        </v-card>
        <v-btn variant="tonal" to="/start" class="ma-2">
          <v-icon>mdi-account-plus</v-icon>
          Create new account
        </v-btn>
      </v-col>
      <v-snackbar v-model="dialogDelete" :timeout="2000">
        {{ dialtext }}

        <template v-slot:actions>
          <v-btn variant="text" @click="dialogDelete = false"> Close </v-btn>
        </template>
      </v-snackbar>
    </v-row>
  </v-container>
</template>
<script>
import { useDataStore } from '@/stores/data.js'

export default {
  name: 'AccountsView',
  data: () => ({
    theme: 'light',
    drawer: null,
    dialogDelete: false,
    dialtext: `Account deleted`,
  }),
  setup() {
    const store = useDataStore()
    return {
      store,
    }
  },
  methods: {
    truncate(fullStr, strLen = 8, separator = ' ... ', frontChars = 8, backChars = 25) {
      if (fullStr.length <= strLen) return fullStr

      return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars)
    },

    async deleteWallet(walletId) {
      try {
        let allWallets = await chrome.storage.local.get(['accounts'])

        //let arr = allWallets.accounts.filter(x => x !== walletId);

        for (var i = 0; i < allWallets.accounts.length; i++) {
          if (i === walletId) {
            allWallets.accounts.splice(i, 1)
            break
          }
        }
        chrome.storage.local.set({ accounts: allWallets.accounts })
        this.store.accounts = allWallets.accounts
        this.dialogDelete = true

        this.store.selectedAccount = 0

        if (this.store.accounts.length === 0) {
          this.store.isLogged = false
          this.$router.push({ name: 'start' })
        }
      } catch (error) {
        console.log(error)
        this.dialogDelete = true
        this.dialtext = `Error deleting account`
      }
    },
  },
}
</script>
