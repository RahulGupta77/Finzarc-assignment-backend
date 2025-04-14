const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      data: {
        user: req.user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const getUserStats = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      {
        $match: { user: req.user._id },
      },
      {
        $group: {
          _id: "$status", // assuming 'status' field exists in your Task schema
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedStats = stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    const totalTasks = await Task.countDocuments({ user: req.user._id });
    formattedStats.total = totalTasks;

    res.status(200).json({
      status: "success",
      data: {
        stats: formattedStats,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = {
  getCurrentUser,
  getUserStats,
};
