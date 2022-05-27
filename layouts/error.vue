<template>
    <v-container style="height: 200px">
      <h1 v-if="error.statusCode === 404">
        {{ pageNotFound }}
      </h1>
      <h1 v-else>
        {{ otherError }}
      </h1>
      <span>Error Code: {{error.statusCode}}</span><br>
      <v-btn
        text
        outlined
        class="mt-2 mr-2"
        color="primary"
        nuxt
        to="/">返回主页
      </v-btn>
    </v-container>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: 'The page you are looking for could not be found.',
      otherError: 'An error occurred'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
