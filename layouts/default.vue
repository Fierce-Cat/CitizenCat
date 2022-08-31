<template>
  <v-app dark>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      flat
    >
      <v-toolbar-title v-text="title" />
      <v-subheader>
        星际公民英中术语库
      </v-subheader>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <v-divider></v-divider>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>CitizenCat &copy; {{ new Date().getFullYear() }} Created by <a href="https://github.com/Fierce-Cat" target="_blank" class="text-decoration-none">FierceCat</a></span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      clipped: false,
      fixed: false,
      title: 'CitizenCat Translate',
      legal_dialog: false,
    }
  }
}
</script>
