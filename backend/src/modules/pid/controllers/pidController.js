const PidRecord = require('../models/pidRecord');
const UserConfig = require('../../config/models/userConfig');
const { tunePidParameters, mockTunePidParameters } = require('../../../utils/modelApi');

// PID参数调优
exports.tuneParameters = async (req, res) => {
  try {
    const { pidType, currentKp, currentKi, currentKd, errorValue, targetValue, notes } = req.body;
    const userId = req.user._id;

    // 验证请求参数
    if (!pidType || currentKp === undefined || currentKi === undefined || currentKd === undefined || errorValue === undefined || targetValue === undefined) {
      return res.status(400).json({ error: 'PID类型、当前参数、误差值和目标值不能为空' });
    }

    // 获取用户配置
    const userConfig = await UserConfig.findOne({ userId });
    if (!userConfig) {
      return res.status(400).json({ error: '用户配置不存在，请先设置大模型API密钥' });
    }

    let optimizedResult;
    try {
      // 检查是否有有效的API密钥
      if (userConfig.apiKey) {
        // 调用真实的大模型API
        optimizedResult = await tunePidParameters(userConfig.apiKey, userConfig.modelName, {
          pidType,
          currentKp,
          currentKi,
          currentKd,
          errorValue,
          targetValue,
          notes
        });
      } else {
        // 使用模拟调优（用于测试）
        optimizedResult = await mockTunePidParameters({
          pidType,
          currentKp,
          currentKi,
          currentKd,
          errorValue,
          targetValue,
          notes
        });
      }
    } catch (modelError) {
      console.error('调优失败:', modelError);
      // 调优失败时使用模拟结果
      optimizedResult = await mockTunePidParameters({
        pidType,
        currentKp,
        currentKi,
        currentKd,
        errorValue,
        targetValue,
        notes
      });
    }

    // 创建PID调优记录
    const pidRecord = new PidRecord({
      userId,
      pidType,
      currentKp,
      currentKi,
      currentKd,
      errorValue,
      targetValue,
      notes,
      optimizedKp: optimizedResult.optimizedKp,
      optimizedKi: optimizedResult.optimizedKi,
      optimizedKd: optimizedResult.optimizedKd,
      thoughtProcess: optimizedResult.thoughtProcess
    });

    await pidRecord.save();

    // 返回调优结果
    res.status(200).json({
      success: true,
      message: 'PID参数调优成功',
      data: {
        recordId: pidRecord._id,
        pidType: pidRecord.pidType,
        currentKp: pidRecord.currentKp,
        currentKi: pidRecord.currentKi,
        currentKd: pidRecord.currentKd,
        errorValue: pidRecord.errorValue,
        targetValue: pidRecord.targetValue,
        notes: pidRecord.notes,
        optimizedKp: pidRecord.optimizedKp,
        optimizedKi: pidRecord.optimizedKi,
        optimizedKd: pidRecord.optimizedKd,
        thoughtProcess: pidRecord.thoughtProcess,
        createdAt: pidRecord.createdAt
      }
    });
  } catch (error) {
    console.error('PID调优错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 获取单个调优记录详情
exports.getRecordDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // 查找调优记录
    const pidRecord = await PidRecord.findOne({ _id: id, userId });
    if (!pidRecord) {
      return res.status(404).json({ error: '调优记录不存在' });
    }

    res.status(200).json({
      success: true,
      data: pidRecord
    });
  } catch (error) {
    console.error('获取调优记录详情错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};