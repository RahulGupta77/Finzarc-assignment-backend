const { Task } = require("../models");

const getCurrentUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: "error",
        error: "Unauthorized access. User not authenticated.",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user: req.user,
      },
    });
  } catch (err) {
    console.error("Error in getCurrentUser:", err.message);
    res.status(500).json({
      status: "error",
      error: "Internal server error while fetching user data.",
    });
  }
};

const getUserStats = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: "error",
        error: "Unauthorized access. User not authenticated.",
      });
    }

    const stats = await Task.aggregate([
      {
        $match: { user: req.user._id },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedStats = stats.reduce(
      (acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      },
      { pending: 0, "in-progress": 0, completed: 0 }
    );

    const totalTasks = await Task.countDocuments({ user: req.user._id });
    formattedStats.total = totalTasks;

    res.status(200).json({
      status: "success",
      data: {
        stats: formattedStats,
      },
    });
  } catch (err) {
    console.error("Error in getUserStats:", err.message);
    res.status(500).json({
      status: "error",
      error: "Internal server error while fetching user stats.",
    });
  }
};

module.exports = {
  getCurrentUser,
  getUserStats,
};
