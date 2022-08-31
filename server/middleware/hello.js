import express from 'express';
let request = require('request');
const app = express();
app.use(express.json());

app.get('/ximeng/hello', (req, res) => {
  res.json('world');
});

app.post('/ximeng/translate', (req, res) => {
  // 定义百度云智能翻译的key和secret
  console.log(req.body)
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
    // 发送带token的翻译请求vv
    let options = {
      url: 'https://aip.baidubce.com/rpc/2.0/mt/texttrans/v1' + '?access_token=' + token,
      method: 'POST',
      header: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      json: {
        "from": req.body.from,
        "to": req.body.to,
        "q": req.body.query
      }
    }
    request(options, function (error, response, body) {
      res.send(body)
    })
  })
})
export default app;
