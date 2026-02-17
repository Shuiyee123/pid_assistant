const UserConfig = require('../models/userConfig');

// 获取用户配置
exports.getUserConfig = async (req, res) => {
  try {
    const userId = req.user._id;

    // 查询用户配置
    let config = await UserConfig.findOne({ userId });

    if (!config) {
      // 如果配置不存在，创建默认配置
      config = new UserConfig({
        userId,
        apiKey: '',
        modelName: 'gpt-3.5-turbo'
      });
      await config.save();
    }

    res.status(200).json({
      success: true,
      data: {
        id: config._id,
        userId: config.userId,
        apiKey: '', // 不返回API密钥，只返回空字符串
        modelName: config.modelName,
        createdAt: config.createdAt,
        updatedAt: config.updatedAt
      }
    });
  } catch (error) {
    console.error('获取用户配置错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 更新用户配置
exports.updateUserConfig = async (req, res) => {
  try {
    const { apiKey, modelName } = req.body;
    const userId = req.user._id;

    // 验证请求参数
    if (!modelName) {
      return res.status(400).json({ error: '模型名称不能为空' });
    }

    // 查询用户配置
    let config = await UserConfig.findOne({ userId });

    if (config) {
      // 更新现有配置
      config.apiKey = apiKey || config.apiKey;
      config.modelName = modelName;
      await config.save();
    } else {
      // 创建新配置
      config = new UserConfig({
        userId,
        apiKey: apiKey || '',
        modelName
      });
      await config.save();
    }

    res.status(200).json({
      success: true,
      message: '配置更新成功',
      data: {
        id: config._id,
        userId: config.userId,
        apiKey: '', // 不返回API密钥，只返回空字符串
        modelName: config.modelName,
        createdAt: config.createdAt,
        updatedAt: config.updatedAt
      }
    });
  } catch (error) {
    console.error('更新用户配置错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};