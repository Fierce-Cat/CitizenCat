<template>
  <v-app dark>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      flat
      color="white"
    >
      <v-toolbar-title v-text="title" />
      <v-subheader>
        XX中英术语库
      </v-subheader>
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
      <span>XX Translate &copy; {{ new Date().getFullYear() }} Created by <a href="https://github.com/Fierce-Cat" class="text-decoration-none">FierceCat</a></span>
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
      title: 'XX Translate'
    }
  }
}
</script>
