const http = require("http");
const url = require("url");
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
});

const server = http.createServer(async (req, res) => {
    // 处理请求逻辑
    const urlParams = url.parse(req.url, true);
    const { question, users } = urlParams.query;

    // 构建对话prompt，模拟用户发送问题
    const prompt = `${users}请根据以上JSON数据，回答${question}这个问题，如果回答不了就回答暂不清楚！`;

    // 使用OpenAI客户端发送对话请求，获取回复
    const response = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0, // 设置回复的随机度，0表示确定回复
    });

    // 从回复中提取内容
    console.log(response, response.choices[0].message);
    const result = response.choices[0].message.content || '';

    // 构造返回给客户端的信息
    let info = {
        message: result,
    };

    // 设置CORS头部信息，允许跨域请求
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 设置HTTP响应头部信息和状态码，并发送JSON格式的响应
    res.statusCode = 200;
    res.setHeader('Content-type', 'test/json');
    res.end(JSON.stringify(info));
});

server.listen(8899, function() {
    console.log('server is running')
})