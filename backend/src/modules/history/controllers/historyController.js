const PidRecord = require('../../pid/models/pidRecord');

// 获取历史调优记录
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, pidType } = req.query;

    // 构建查询条件
    const query = { userId };
    if (pidType) {
      query.pidType = pidType;
    }

    // 计算分页参数
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // 查询历史记录
    const [records, total] = await Promise.all([
      PidRecord.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .exec(),
      PidRecord.countDocuments(query).exec()
    ]);

    // 计算总页数
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: {
        records,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages
        }
      }
    });
  } catch (error) {
    console.error('获取历史记录错误:', error);
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