import express from 'express';
let request = require('request');
const app = express();
app.use(express.json());

// 创建一个ping路径，返回pong
app.get('/server/hello', (req, res) => {
  res.json({
    message: 'world'
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
      // 判断是否带optional_termIds
      if (req.body.optional_termIds) {
        // 带optional_termIds，则发送带optional_termIds的翻译请求
        let options = {
          url: 'https://aip.baidubce.com/rpc/2.0/mt/texttrans/v1' + '?access_token=' + token,
          method: 'POST',
          json: {
            "from": req.body.from,
            "to": req.body.to,
            "q": req.body.query,
            "termIds": req.body.optional_termIds
          }
        }
        request(options, function (error, response, body) {
          res.send(body)
        })
      } else {
        // 不带optional_termIds，则发送不带optional_termIds的翻译请求
        let options = {
          url: 'https://aip.baidubce.com/rpc/2.0/mt/texttrans/v1' + '?access_token=' + token,
          method: 'POST',
          json: {
            "from": req.body.from,
            "to": req.body.to,
            "q": req.body.query
          }
        }
        request(options, function (error, response, body) {
          res.send(body)
        })
      }
  })
})

export default app;
