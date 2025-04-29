<template>
  <v-table density="compact">
    <thead>
      <tr>
        <th class="text-left">Type</th>
        <th class="text-left">Date</th>
        <th class="text-left">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in this.store.lastTransactions" :key="item.name">
        <td>
          <v-chip class="ma-2" label variant="outlined">{{ item.titleMsg }} </v-chip>
        </td>
        <td>{{ formatDate(item.timestamp) }}</td>
        <td>
          <v-icon v-if="item.code === 0" color="success" icon="mdi-check-bold"></v-icon>
          <v-icon v-else color="error" icon="mdi-close-thick"></v-icon>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
<script>
import { useDataStore } from '@/stores/data.js'
import cosmosConfig from '@/cosmos.config'

export default {
  data() {
    return {
      theme: 'light',
      drawer: null,
      cosmosConfig,

      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
        },
        {
          name: 'Eclair',
          calories: 262,
        },
        {
          name: 'Cupcake',
          calories: 305,
        },
        {
          name: 'Gingerbread',
          calories: 356,
        },
        {
          name: 'Jelly bean',
          calories: 375,
        },
        {
          name: 'Lollipop',
          calories: 392,
        },
        {
          name: 'Honeycomb',
          calories: 408,
        },
        {
          name: 'Donut',
          calories: 452,
        },
        {
          name: 'KitKat',
          calories: 518,
        },
      ],
    }
  },
  setup() {
    // You can use the setup function to define reactive properties and methods
    const store = useDataStore()
    return {
      store,
    }
  },
  mounted() {
    this.store.getTransactions()
  },
  methods: {
    formatDate(date) {
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }
      return new Date(date).toLocaleString('en-US', options)
    },
    formatNum(num) {
      return num.toLocaleString('en-US')
    },
  },
}
</script>
