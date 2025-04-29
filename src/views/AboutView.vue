<template>
  <v-container>
    <v-row>
      <!--         <v-col cols="12" md="6">
          <v-card
            href="https://vuetifyjs.com/introduction/why-vuetify/#feature-guides"
            prepend-icon="mdi-information-slab-box-outline"
            target="_blank"
            text="Start with our dedicated feature guides"
            title="About our blockchain"
          ></v-card>
        </v-col> -->
      <v-col cols="12" md="6">
        <v-card
          prepend-icon="mdi-information-slab-box-outline"
          text="Start with our dedicated feature guides"
          title="Info of blockchain"
        >
          <v-table density="compact">
            <tbody>
              <tr>
                <td>Chain name</td>
                <td>{{ cosmosConfig[0].name }}</td>
              </tr>
              <tr>
                <td>Chain id</td>
                <td>{{ cosmosConfig[0].chainId }}</td>
              </tr>
              <tr>
                <td>Api URL</td>
                <td>{{ cosmosConfig[0].apiURL }}</td>
              </tr>
              <tr>
                <td>Rpc URL</td>
                <td>{{ cosmosConfig[0].rpcURL }}</td>
              </tr>
              <tr>
                <td>View Denom</td>
                <td>{{ cosmosConfig[0].coinLookup.viewDenom }}</td>
              </tr>
              <tr>
                <td>Chain Denom</td>
                <td>{{ cosmosConfig[0].coinLookup.chainDenom }}</td>
              </tr>
              <tr>
                <td>Address Prefix</td>
                <td>{{ cosmosConfig[0].coinLookup.addressPrefix }}</td>
              </tr>
              <tr>
                <td>Fee Multiplier</td>
                <td>{{ cosmosConfig[0].feeMultiplier }}</td>
              </tr>
              <tr>
                <td>Gas Price</td>
                <td>{{ cosmosConfig[0].gasPrice }}</td>
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
  </v-container>
</template>
<script>
import cosmosConfig from '@/cosmos.config'

export default {
  name: 'AboutView',
  data: () => ({
    theme: 'light',
    drawer: null,
    cosmosConfig,
  }),
  setup() {
    const store = useDataStore()
    return { store }
  },
}
</script>
