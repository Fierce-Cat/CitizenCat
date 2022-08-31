<template>
  <v-container class="ma-0 pa-0">
    <v-container class="Navigation-Button-Group px-0">
      <v-btn outlined small color="primary" class="mr-2">
        <v-icon>mdi-format-text</v-icon>
        文字
      </v-btn>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <div v-on="on" style="display: inline-block">
            <v-btn disabled outlined small color="primary" class="mr-2">
              <v-icon>mdi-file-image</v-icon>
              图片
            </v-btn>
          </div>
        </template>
        <span>开发中</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <div v-on="on" style="display: inline-block">
            <v-btn disabled outlined small color="primary" class="mr-2">
              <v-icon>mdi-cog-outline</v-icon>
              小插件
            </v-btn>
          </div>
        </template>
        <span>开发中</span>
      </v-tooltip>
      <v-dialog
        v-model="dialog"
        width="500"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            outlined
            small
            class="mr-2"
            color="primary"
            v-bind="attrs"
            v-on="on"
          >
            选择术语库
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            术语库列表
          </v-card-title>

          <v-card-text class="mt-2 pb-0">
            在下方选择需要使用的术语库，并重新点击翻译。
          </v-card-text>
          <v-container fluid class="term-selector">
            <v-row class="ml-2">
              <v-col
                v-for="term in terms_list"
                :key="term.id"
                cols="6"
                class="pa-0">
                <v-switch
                  v-model="terms"
                  :label="term.name"
                  :value="term.id"
                  inset
                  class="text--accent-1"
                ></v-switch>
              </v-col>
            </v-row>
          </v-container>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="dialog = false"
            >
              确认
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
    <v-card>
      <v-row  class="ma-0 fill-height">
        <v-col cols="12" sm="6" class="pa-0">
          <v-container class="d-flex pa-0">
            <v-tabs>
              <v-tab v-for="lang in input_lang" :key="lang.id" @click="updateOriginalLang(lang.id)">
                {{ lang.name }}
              </v-tab>
            </v-tabs>
            <v-spacer></v-spacer>
            <v-btn
              v-on:click="getTranslation(translating_text, original_lang, target_lang, terms)"
              text
              outlined
              class="mt-2 mr-2"
              color="primary">翻译
              <v-progress-circular
                v-if="loading"
                size="20"
                width="3"
                indeterminate
                color="primary"
                class="ml-1"
              ></v-progress-circular>
            </v-btn>
          </v-container>
          <v-divider/>
          <v-card flat>
            <v-textarea
              v-model="translating_text"
              solo
              flat
              hide-details
              auto-grow
              name="translate-input"
              label="输入"
              maxlength="2000"
              v-on:keydown.enter="getTranslation(translating_text, original_lang, target_lang, terms)"
              class="translate-text"
            ></v-textarea>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" class="pa-0" style="background-color: #f5f5f5 !important">
          <v-container class="d-flex pa-0">
            <v-tabs>
              <v-tab v-for="lang in output_lang" :key="lang.id" @click="updateTargetLang(lang.id)">
                {{ lang.name }}
              </v-tab>
            </v-tabs>
            <v-spacer></v-spacer>
          </v-container>
          <v-divider/>
          <v-card flat color="grey lighten-4">
            <v-textarea
              solo
              flat
              hide-details
              auto-grow
              readonly
              name="translate-output"
              class="translate-text"
              v-model="translated_text"
              background-color="grey lighten-4"

            ></v-textarea>
          </v-card>
          <v-spacer></v-spacer>
        </v-col>
      </v-row>
    </v-card>
    <v-container class="site-info px-0">
      <v-card flat outlined>
        <v-expansion-panels
          accordion
          multiple
          v-model="info_panel">
          <v-expansion-panel>
            <v-expansion-panel-header>
              这是什么？
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              CitizenCat 是装载定制语料库，深度学习后，专攻星际公民相关词汇的在线翻译服务。
              虽然写着是专攻，但不在词库内的内容仍会使用公共翻译。
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              数据从哪里来？
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              CitizenCat 的所有中英术语表均来自游戏社区，主要使用汉化组所发布的《SC全词汇中文对照表》。
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              我发现了问题！
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              CitizenCat 欢迎所有的用户对本站数据提出建议，请加QQ：947169641 或发送邮件至 hyx5020#gmail.com (#替换为@)。
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </v-container>
    <v-container class="legal-info px-0">
      <v-card flat outlined>
        <div class="d-flex flex-no-wrap justify-space-between">
        <v-card-text>
          这是一个非官方的星际公民粉丝网站，不隶属于 Cloud Imperium 公司集团。
          本网站上并非由其作者或用户创作的所有内容均为其各自所有者的财产。<br>
          This is an unofficial Star Citizen fansite, not affiliated with the Cloud Imperium group of companies.
          All content on this site not authored by its host or users are property of their respective owners.
        </v-card-text>
        <v-avatar
          class="ma-3"
          size="80"
          tile
        >
          <v-img src="/img/MadeByTheCommunity_White.png"></v-img>
        </v-avatar>
        </div>
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
import { debounce } from "@/server/js/util";

export default {
  name: 'IndexPage',
  data() {
    return {
      input_lang: [
        {id:'auto', name: '自动识别'},
        {id:'en', name: 'English'},
        {id:'zh', name: '简体中文'},
      ],
      output_lang: [
        {id:'zh', name: '简体中文'},
        {id:'en', name: 'English'}
      ],
      terms_list: [
        {id:'xwmg5zdg2d', name: '游戏术语'},
        {id:'4k6qdl3gxl', name: 'UEE机构'},
        {id:'r4pgjddgz5', name: '飞船/组件'},
        {id:'o98gwkzg3n', name: '公司/组织/商店'},
        {id:'x76q1zdezw', name: '地点'},
        {id:'d9mg4znqpx', name: '星球星系'},
      ],
      translating_text:"",
      terms: [],
      original_lang: "auto",
      target_lang:"zh",
      translated_text:"翻译",
      info_panel: [0],
      loading: 0,
      dialog: false,
    }
  },
  methods:{
    getTranslation:function(text, original_lan, target_lan, terms){
      // display loading
      this.loading = 1;
      this.translating_text=text;
      this.original_lang = original_lan;
      this.target_lang = target_lan;
      this.optional_terms = terms;
      this.translated_text = "...";
      //初始化要传给api的数据
      const query = this.translating_text;
      const from  =this.original_lang;
      const to = this.target_lang;

      //将terms转换为字符串
      let termIds = "";
      if (this.optional_terms && this.optional_terms.length > 0) {
        termIds = this.optional_terms.join(",");
      }

      // 向server/translate 发送query/from/to 并获取翻译结果
      let url = this.$config.baseURL + '/server/translate'
      this.$axios.$post(url, {
        "query": query,
        "from": from,
        "to": to,
        "optional_termIds": termIds
      })
        .then(res => {
          let result = res.result;
          // 判断是否返回了翻译结果 trans_result
          if(result && result.trans_result) {
            // 判断返回结果是否为多行，如果是，则拼接对象内的dst并返回值
            if (result.trans_result.length > 1 ) {
              let multi_line_result = ''
              for (let i = 0; i < result.trans_result.length; i++) {
                multi_line_result = multi_line_result + decodeURIComponent(result.trans_result[i].dst) + '\n'
              }
              this.translated_text = multi_line_result
              this.loading = 0;
            } else {
              this.translated_text = decodeURIComponent(result.trans_result[0].dst)
              this.loading = 0;
            }
            this.loading = 0;
          } else {
            this.translated_text = '翻译'
            this.loading = 0;
          }


        })
    },

    updateOriginalLang (id) {
      this.original_lang = id
    },
    updateTargetLang (id) {
      this.target_lang = id
    },

  },
  created () {
    // 用户停止输入1000ms后，自动调用翻译接口getTranslation
    this.$watch('translating_text', debounce(function (val) {
      this.getTranslation(val, this.original_lang, this.target_lang, this.terms)
    }, 1000))
  },
  head () {
    return {
      title: '首页'
    }
  }
}
</script>
<style>
.v-textarea .v-label {
  font-size: 24px !important;
  height: auto !important;
  line-height: 30px !important;
  top: 10px !important;
}
.translate-text {
  font-size: 18px !important;
  height: auto !important;
  line-height: 28px !important;
}
</style>
