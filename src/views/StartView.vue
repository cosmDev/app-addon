<template>
  <v-container fluid>
    <v-empty-state headline="CosmDev" icon="mdi-atom" title="Select what you want to do">
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-card
              to="/create-wallet"
              prepend-icon="mdi-folder-plus"
              text="Create a new wallet chain"
              title="Create new wallet"
            ></v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card
              href="https://play.vuetifyjs.com"
              prepend-icon="mdi-file-import"
              text="Import an existing wallet"
              title="Import wallet"
            ></v-card>
          </v-col>

          <!-- <v-col cols="12" md="6">
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
    </v-empty-state>
  </v-container>
</template>
