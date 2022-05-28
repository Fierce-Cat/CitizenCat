import express from 'express';
let request = require('request');
const app = express();
app.use(express.json());

// 创建一个ping路径，返回pong
app.get('/server/ping', (req, res) => {
  res.json({
    message: 'pong'
  });
});

// 请求路径为/server/translate 时，传递传入的from/to/query，并返回百度云智能翻译的翻译结果
app.post('/server/translate', (req, res) => {
  // 定义百度云智能翻译的key和secret
  const apiKey = process.env.TRANSLATE_API_KEY;
  const apiSecret = process.env.TRANSLATE_SECRET_KEY;
  // 先获取token
  let options = {
    url: 'https://aip.baidubce.com/oauth/2.0/token' + '?grant_type=client_credentials' + '&client_id=' + apiKey + '&client_secret=' + apiSecret,
    method: 'POST',
  }
  // 发送带token的翻译请求
  request(options, function (error, response, body) {
      // 返回token
      let token = JSON.parse(body).access_token
      // 定义百度云智能翻译的请求参数
      let options = {
        url: 'https://aip.baidubce.com/rpc/2.0/mt/texttrans/v1' + '?access_token=' + token,
        method: 'POST',
        json: {
          "q": req.body.query,
          "from": req.body.from,
          "to": req.body.to,
          "termIds": process.env.TERM_IDS
        },
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        }
      }
      console.log(options)
      // 发送请求
      request(options, function (error, response, body) {
          // 返回结果
          res.send(body)
      })
  })
})

export default app;
