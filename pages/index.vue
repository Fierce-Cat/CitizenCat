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
            <v-btn disabled outlined small color="primary">
              <v-icon>mdi-cog-outline</v-icon>
              小插件
            </v-btn>
          </div>
        </template>
        <span>开发中</span>
      </v-tooltip>
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
              v-on:click="getTranslation(translating_text, original_lang, target_lang)"
              text
              outlined
              class="mt-2 mr-2"
              color="primary">翻译</v-btn>
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
              v-on:keydown.enter="getTranslation(translating_text, original_lang, target_lang)"
              class="translate-text"
            ></v-textarea>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" class="pa-0" style="background-color: #f5f5f5 !important">
          <v-tabs>
            <v-tab v-for="lang in output_lang" :key="lang.id" @click="updateTargetLang(lang.id)">
              {{ lang.name }}
            </v-tab>
          </v-tabs>
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
              Citizen Translate 是装载定制语料库，深度学习后，专攻星际公民相关词汇的在线翻译服务。
              虽然写着是专攻，但不在词库内的内容仍会使用公共翻译。
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              数据从哪里来？
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              Citizen Translate 的所有中英术语表均来自游戏社区，主要使用汉化组所发布的《SC全词汇中文对照表》。
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              我发现了问题！
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              Citizen Translate 欢迎所有的用户对本站数据提出建议，请加QQ：947169641 或发送邮件至 hyx5020#gmail.com (#替换为@)。
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
          <v-img src="https://support.robertsspaceindustries.com/hc/article_attachments/360022704853/MadeByTheCommunity_White.png"></v-img>
        </v-avatar>
        </div>
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
import { MD5 } from '@/server/js/md5'
import { debounce } from "@/server/js/util";

export default {
  name: 'IndexPage',
  data() {
    return {
      input_lang: [
        {id:'auto', name: '自动识别'},
        {id:'en', name: 'English'},
        // {id:'zh', name: '简体中文'},
      ],
      output_lang: [
        {id:'zh', name: '简体中文'},
        // {id:'cht', name: '繁体中文'},
        // {id:'en', name: 'English'}
      ],
      translating_text:"",
      original_lang: "auto",
      target_lang:"zh",
      translated_text:"翻译",
      info_panel: [0]
    }
  },
  methods:{
    getTranslation:function(text, original_lan, target_lan){
      this.translating_text=text;
      this.original_lang = original_lan;
      this.target_lang = target_lan;
      //初始化要传给api的数据
      const appid = this.$config.translateAppId;
      const key = this.$config.translateAppKey;
      const salt = (new Date).getTime();
      const query = this.translating_text;
      const encodedquery = encodeURI(query);
      const from  =this.original_lang;
      const to = this.target_lang;
      // 签名，注意这里在拼接query时，query必须是UTF8编码，如果中文不是UTF8编码，那么将会出现签名错误。并且不能用encodeURI进行编码。
      let str1 = appid+query+salt+key;
      let sign = MD5(str1);
      let action = '1';
      // 拼接请求的url，注意query需要URLencode
      this.$axios.$get(this.$config.baseURL + "/api/translate?q="+encodedquery+"&from="+from+"&to="+to+"&appid="+appid+"&salt="+salt+'&action='+action+"&sign="+sign)
        .then(res => {
          console.log(res);
          console.log(appid);
          // 判断是否返回了翻译结果 trans_result
          if(res.trans_result) {
            // 判断返回结果是否为多行，如果是，则拼接对象内的dst并返回值
            if (res.trans_result.length > 1 ) {
              let multi_line_result = ''
              for (let i = 0; i < res.trans_result.length; i++) {
                multi_line_result = multi_line_result + res.trans_result[i].dst + '\n'
              }
              this.translated_text = multi_line_result
            } else {
              this.translated_text = res.trans_result[0].dst
            }
          } else {
            this.translated_text = '翻译'
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
    // 用户停止输入500ms后，自动调用翻译接口getTranslation
    this.$watch('translating_text', debounce(function (val) {
      this.getTranslation(val, this.original_lang, this.target_lang)
    }, 500))
  },
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
.v-label {
  font-size: 24px !important;
  height: auto !important;
  line-height: 30px !important;
  top: 10px !important;
}
.translate-text {
  font-size: 24px !important;
  height: auto !important;
  line-height: 30px !important;
}
</style>
