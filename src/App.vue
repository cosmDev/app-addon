<template>
  <v-app :theme="theme" id="inspire">
    <v-navigation-drawer v-model="drawer">
      <v-list color="transparent">
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          @click="() => $router.push({ name: 'home' })"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-box"
          title="Accounts"
          @click="() => $router.push({ name: 'accounts' })"
        ></v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list color="transparent">
        <v-list-item
          v-for="(account, index) in store.accounts"
          :key="index"
          :title="account.name"
          prepend-icon="mdi-account-box"
          @click="changeAccount(index)"
        >
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block> Logout </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar v-if="store.isLogged">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>{{ cosmosConfig[0].name }} </v-app-bar-title>
      <v-spacer></v-spacer>

      <v-btn icon @click="toggleTheme">
        <v-icon>{{ theme === 'light' ? 'mdi-lightbulb-on' : 'mdi-lightbulb-off' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-banner
        v-if="store.chainOffline"
        color="warning"
        icon="mdi-wifi-strength-alert-outline"
        lines="one"
      >
        <template v-slot:text> Blockchain Offline </template>

        <template v-slot:actions>
          <v-btn @click="store.initRpc()" text> Retry </v-btn>
        </template>
      </v-banner>
      <RouterView />
    </v-main>

    <v-bottom-navigation v-if="store.isLogged">
      <v-btn value="recent" to="/index.html">
        <v-icon>mdi-home</v-icon>

        <span>Home</span>
      </v-btn>
      <v-btn value="txs" to="/txs">
        <v-icon>mdi-bank-transfer</v-icon>

        <span>Txs</span>
      </v-btn>

      <v-btn value="staking" to="/staking">
        <v-icon>mdi-alpha-s-circle</v-icon>

        <span>Staking</span>
      </v-btn>

      <v-btn value="nearby" to="/about">
        <v-icon>mdi-information</v-icon>

        <span>About</span>
      </v-btn>
      <!--       <v-btn value="config" @click="dialogConfig = !dialogConfig">
        <v-icon>mdi-cog</v-icon>

        <span>Config</span>
      </v-btn> -->
    </v-bottom-navigation>

    <!--     <v-dialog
      v-model="dialogConfig"
      transition="dialog-bottom-transition"
      fullscreen
      scroll-strategy="none"
    >
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn prepend-icon="mdi-cog" size="small" text="Settings" v-bind="activatorProps"></v-btn>
      </template>

      <v-card>
        <v-toolbar>
          <v-btn icon="mdi-close" @click="dialogConfig = false"></v-btn>

          <v-toolbar-title>Settings</v-toolbar-title>
        </v-toolbar>

        <v-list lines="two">
          <v-list-subheader>User Controls</v-list-subheader>
          <v-list-item
            subtitle="Require password for purchase or use password to restrict purchase"
            title="Password"
            link
            @click="mainPass = !mainPass"
          >
          </v-list-item>
          <v-list>
            <v-list-item v-if="mainPass" subtitle="Set your password to access the wallet">
              <v-text-field
                v-if="mainPass"
                variant="outlined"
                type="password"
                density="compact"
                class="mt-2"
              ></v-text-field>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>

          <v-list-subheader>General</v-list-subheader>
          <v-list-item subtitle="Set main password to access the wallet" title="Main Password">
            <template v-slot:prepend>
              <v-list-item-action start>
                <v-checkbox-btn v-model="mainPass"></v-checkbox-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
          {{ this.store.autoRefresh }}
          <v-list-item
            subtitle="Get the latest data from the blockchain"
            title="Auto refresh"
            @click="this.store.autoRefresh = !this.store.autoRefresh"
          >
            <template v-slot:prepend>
              <v-list-item-action start>
                <v-checkbox-btn v-model="this.store.autoRefresh"></v-checkbox-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog> -->
  </v-app>

  <!--   <v-app v-else :theme="theme" >
 

 

    <v-main> 
  <v-empty-state
    headline="Welcome,"
    icon="$vuetify"
    title="What would you like to do today?"
  >
 
      <v-row>
        <v-col cols="12" md="6">
          <v-card 
            prepend-icon="mdi-account-plus" 
            text="Create a new wallet"
            title="Create wallet"
            to="/create-wallet"
          ></v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card
            href="https://play.vuetifyjs.com"
            prepend-icon="mdi-import"
            target="_blank"
            text="Import an existing wallet"
            title="Import wallet"
          ></v-card>
        </v-col> 
      </v-row> 
  </v-empty-state> 

  <RouterView />
    </v-main>
   
  </v-app> -->
</template>

<script>
import { ref, defineComponent } from 'vue'
import cosmosConfig from '@/cosmos.config'
import { useDataStore } from '@/stores/data.js'

export default {
  data: () => ({
    cosmosConfig,
    theme: ref('light'),
    drawer: null,

    dialogConfig: false,
    autoRefresh: false,
    mainPass: false,
    // To fix:
    mainPassword: '',
  }),
  setup() {
    const store = useDataStore()
    //console.log(store.isLogged)

    return {
      store,
    }
  },
  watch: {
    autoRefresh(newVal) {
      if (newVal) {
        this.store.autoRefresh = true
      } else {
        this.store.autoRefresh = false
      }
      console.log('Auto refresh changed to: ', newVal)
    },
  },
  async mounted() {
    await this.store.initRpc()
    let itemAccounts = await chrome.storage.local.get(['accounts'])
    // console.log("itemAccounts", itemAccounts.accounts)

    if (itemAccounts.accounts && itemAccounts.accounts.length > 0) {
      this.store.isLogged = true
      this.store.accounts = itemAccounts.accounts
      console.log('itemAccounts', itemAccounts.accounts)
      this.store.addrWallet = itemAccounts.accounts[0].address
      console.log('address', this.store.addrWallet)

      await this.store.getBankModule()
      await this.store.getStakingModule()
      await this.store.getDistribModule()
      await this.store.getWalletAmount()
      await this.store.getAllValidators()

      setInterval(async () => {
        if (this.store.autoRefresh) {
          await this.store.getBankModule()
          await this.store.getStakingModule()
          await this.store.getDistribModule()
          await this.store.getWalletAmount()
        }
      }, 5000) // Refresh data every ** seconds
    } else {
      this.store.isLogged = false
    }

    if (this.store.isLogged) {
      this.$router.push({ name: 'home' })
    } else {
      this.$router.push({ name: 'start' })
    }
  },
  methods: {
    changeAccount(index) {
      this.store.selectedAccount = index
      this.$router.push({ name: 'home' })
      this.drawer = false
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    },
  },
}
</script>

<style>
html {
  width: 400px;
  height: 500px;
}
</style>
