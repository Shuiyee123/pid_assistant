const https = require('https');
const http = require('http');

// 调用大模型API进行PID参数调优
exports.tunePidParameters = async (apiKey, modelName, pidData) => {
  try {
    const { pidType, currentKp, currentKi, currentKd, errorValue, targetValue, notes } = pidData;

    // 构建请求体
    const requestBody = {
      model: modelName,
      messages: [
        {
          role: "system",
          content: "你是一个专业的PID参数调优专家，擅长分析控制系统的PID参数并提供优化建议。"
        },
        {
          role: "user",
          content: `请帮我优化以下PID参数：\n\n` +
            `PID类型: ${pidType}\n` +
            `当前KP值: ${currentKp}\n` +
            `当前KI值: ${currentKi}\n` +
            `当前KD值: ${currentKd}\n` +
            `当前误差值: ${errorValue}\n` +
            `目标值: ${targetValue}\n` +
            `备注: ${notes || '无'}\n\n` +
            `请提供以下内容：\n` +
            `1. 优化后的KP、KI、KD值\n` +
            `2. 详细的调优思考过程，解释为什么要这样调整参数\n` +
            `3. 预期的调优效果\n\n` +
            `请以JSON格式返回结果，包含以下字段：\n` +
            `{\n` +
            `  "optimizedKp": 数值,\n` +
            `  "optimizedKi": 数值,\n` +
            `  "optimizedKd": 数值,\n` +
            `  "thoughtProcess": "详细的调优思考过程"\n` +
            `}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    };

    // 构建HTTP请求选项
    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(JSON.stringify(requestBody))
      }
    };

    // 发送请求
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            
            if (response.error) {
              reject(new Error(`模型API错误: ${response.error.message}`));
              return;
            }

            if (!response.choices || !response.choices[0] || !response.choices[0].message) {
              reject(new Error('模型API返回格式错误'));
              return;
            }

            const content = response.choices[0].message.content;
            
            // 提取JSON格式的结果
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
              reject(new Error('模型返回的结果格式不符合要求'));
              return;
            }

            const result = JSON.parse(jsonMatch[0]);
            resolve(result);
          } catch (error) {
            reject(new Error(`解析模型响应失败: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`请求模型API失败: ${error.message}`));
      });

      req.write(JSON.stringify(requestBody));
      req.end();
    });
  } catch (error) {
    console.error('调用模型API出错:', error);
    throw error;
  }
};

// 模拟大模型API响应（用于测试）
exports.mockTunePidParameters = async (pidData) => {
  try {
    const { currentKp, currentKi, currentKd, errorValue } = pidData;

    // 简单的模拟调优逻辑
    const optimizedKp = currentKp * (1 + (errorValue > 0 ? 0.1 : -0.1));
    const optimizedKi = currentKi * (1 + (errorValue > 0 ? 0.05 : -0.05));
    const optimizedKd = currentKd * (1 + (errorValue > 0 ? 0.15 : -0.15));

    const thoughtProcess = `基于当前PID参数和误差值分析：\n` +
      `1. 当前KP值为 ${currentKp}，误差值为 ${errorValue}，需要${errorValue > 0 ? '增加' : '减少'}比例增益以提高响应速度\n` +
      `2. 当前KI值为 ${currentKi}，需要${errorValue > 0 ? '增加' : '减少'}积分增益以消除稳态误差\n` +
      `3. 当前KD值为 ${currentKd}，需要${errorValue > 0 ? '增加' : '减少'}微分增益以抑制超调\n` +
      `4. 优化后的参数预期会提高系统的响应速度和稳定性，减少误差值`;

    return {
      optimizedKp: parseFloat(optimizedKp.toFixed(4)),
      optimizedKi: parseFloat(optimizedKi.toFixed(4)),
      optimizedKd: parseFloat(optimizedKd.toFixed(4)),
      thoughtProcess
    };
  } catch (error) {
    console.error('模拟调优出错:', error);
    throw error;
  }
};