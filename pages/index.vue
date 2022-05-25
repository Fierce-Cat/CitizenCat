<template>
  <v-container fluid class="ma-0 pa-0" style="max-width: 1200px">
    <v-container class="Navigation-Button-Group px-0">
      <v-btn outlined class="text--primary">
        <v-icon>mdi-format-text</v-icon>
        文字
      </v-btn>
    </v-container>
    <v-card flat outlined min-height="200px">
      <v-row justify="top" class="ma-0">
        <v-col cols="12" sm="6" class="pa-0" style="height:100%">
          <v-container class="d-flex pa-0">
            <v-tabs>
              <v-tab>English</v-tab>
              <v-tab>简体中文</v-tab>
              <v-tab>繁体中文</v-tab>
            </v-tabs>
            <v-spacer></v-spacer>
            <v-btn flat outlined class="mt-2 mr-2" color="primary">翻译</v-btn>
          </v-container>
          <v-divider/>
          <v-card flat>
            <v-textarea
              solo
              flat
              hide-details
              auto-grow
              height="200px"
              name="input-7-4"
              label="输入栏"
            ></v-textarea>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" class="pa-0">
          <v-tabs>
            <v-tab>简体中文</v-tab>
            <v-tab>繁体中文</v-tab>
            <v-tab>English</v-tab>
          </v-tabs>
          <v-divider/>
          <v-card flat color="grey lighten-3">
            <v-textarea
              solo
              flat
              hide-details
              auto-grow
              readonly
              height="200px"
              name="input-7-4"
              class="text--primary"
              label="输出栏"
              value="输出栏"
              background-color="grey lighten-4"
            ></v-textarea>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-container class="site-info px-0">
      <v-card flat outlined>
        <v-card-title>这是什么？</v-card-title>
        <v-card-text>这是装载定制语料库，深度学习后，专攻XX中英互译的在线翻译服务（AI还没就绪）。</v-card-text>
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: 'IndexPage',
  head () {
    return {
      title: '首页'
    }
  }
}
</script>
<style>
.right-border {
  border-right: 1px solid #e0e0e0;
}
</style>
