const Feedback = require('../models/feedback');
const PidRecord = require('../../pid/models/pidRecord');

// 提交反馈记录
exports.submitFeedback = async (req, res) => {
  try {
    const { pidRecordId, rating, comment } = req.body;
    const userId = req.user._id;

    // 验证请求参数
    if (!pidRecordId || rating === undefined) {
      return res.status(400).json({ error: '调优记录ID和评分不能为空' });
    }

    // 验证评分范围
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: '评分必须在1-5之间' });
    }

    // 验证调优记录是否存在且属于当前用户
    const pidRecord = await PidRecord.findOne({ _id: pidRecordId, userId });
    if (!pidRecord) {
      return res.status(404).json({ error: '调优记录不存在' });
    }

    // 检查是否已经提交过反馈
    let feedback = await Feedback.findOne({ userId, pidRecordId });

    if (feedback) {
      // 更新现有反馈
      feedback.rating = rating;
      feedback.comment = comment;
      await feedback.save();
    } else {
      // 创建新反馈
      feedback = new Feedback({
        userId,
        pidRecordId,
        rating,
        comment
      });
      await feedback.save();
    }

    res.status(200).json({
      success: true,
      message: '反馈提交成功',
      data: feedback
    });
  } catch (error) {
    console.error('提交反馈错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 获取指定调优记录的反馈
exports.getFeedback = async (req, res) => {
  try {
    const { pidRecordId } = req.params;
    const userId = req.user._id;

    // 验证调优记录是否存在且属于当前用户
    const pidRecord = await PidRecord.findOne({ _id: pidRecordId, userId });
    if (!pidRecord) {
      return res.status(404).json({ error: '调优记录不存在' });
    }

    // 查询反馈
    const feedback = await Feedback.findOne({ userId, pidRecordId });

    res.status(200).json({
      success: true,
      data: feedback || null
    });
  } catch (error) {
    console.error('获取反馈错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 获取用户的所有反馈记录
exports.getUserFeedback = async (req, res) => {
  try {
    const userId = req.user._id;

    // 查询用户的所有反馈
    const feedbackList = await Feedback.find({ userId })
      .populate('pidRecordId', 'pidType optimizedKp optimizedKi optimizedKd createdAt')
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json({
      success: true,
      data: feedbackList
    });
  } catch (error) {
    console.error('获取用户反馈错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};