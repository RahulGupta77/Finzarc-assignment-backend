const { Task } = require("../models");

const getAllTasks = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: "error",
        error: "Unauthorized access. User not authenticated.",
      });
    }

    const filter = { user: req.user.id };

    const [tasks, totalTasks, statusCounts, priorityCounts] = await Promise.all(
      [
        Task.find(filter).sort({ createdAt: -1 }),
        Task.countDocuments(filter),
        Task.aggregate([
          { $match: { user: req.user._id } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        Task.aggregate([
          { $match: { user: req.user._id } },
          { $group: { _id: "$priority", count: { $sum: 1 } } },
        ]),
      ]
    );

    const statusSummary = {};
    statusCounts.forEach((item) => (statusSummary[item._id] = item.count));

    const prioritySummary = {};
    priorityCounts.forEach((item) => (prioritySummary[item._id] = item.count));

    res.status(200).json({
      status: "success",
      data: {
        tasks,
        totalTasks,
        statusSummary: {
          pending: statusSummary["pending"] || 0,
          inProgress: statusSummary["in-progress"] || 0,
          completed: statusSummary["completed"] || 0,
        },
        prioritySummary: {
          low: prioritySummary["low"] || 0,
          medium: prioritySummary["medium"] || 0,
          high: prioritySummary["high"] || 0,
        },
      },
    });
  } catch (error) {
    console.error("Error in getAllTasks:", error.message);
    res.status(500).json({
      status: "error",
      error: "Internal server error while fetching tasks.",
    });
  }
};

const getTask = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: "error",
        error: "Unauthorized access. User not authenticated.",
      });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        status: "error",
        error: "Task not found or unauthorized.",
      });
    }

    res.status(200).json({
      status: "success",
      data: { task },
    });
  } catch (error) {
    console.error("Error in getTask:", error.message);
    res.status(500).json({
      status: "error",
      error: "Internal server error while fetching task.",
    });
  }
};

const createTask = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: "error",
        error: "Unauthorized access. User not authenticated.",
      });
    }

    const { title, description, status, priority, completed } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        status: "error",
        error: "Task title is required and must be a non-empty string.",
      });
    }

    const newTask = await Task.create({
      title: title.trim(),
      description: description?.trim() || "",
      status: status || "pending",
      priority: priority || "medium",
      completed: completed ?? false,
      user: req.user.id,
    });

    res.status(201).json({
      status: "success",
      data: { task: newTask },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        status: "error",
        error: messages.join(", "),
      });
    }

    console.error("Error in createTask:", error.message);
    res.status(500).json({
      status: "error",
      error: "Internal server error while creating task.",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: "error",
        error: "Unauthorized access. User not authenticated.",
      });
    }

    const { title, description, status, priority, completed } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (completed !== undefined) updates.completed = completed;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        status: "error",
        error: "Task not found or unauthorized.",
      });
    }

    res.status(200).json({
      status: "success",
      data: { task },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        status: "error",
        error: messages.join(", "),
      });
    }

    console.error("Error in updateTask:", error.message);
    res.status(500).json({
      status: "error",
      error: "Internal server error while updating task.",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: "error",
        error: "Unauthorized access. User not authenticated.",
      });
    }

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        status: "error",
        error: "Task not found or unauthorized.",
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.error("Error in deleteTask:", error.message);
    res.status(500).json({
      status: "error",
      error: "Internal server error while deleting task.",
    });
  }
};

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
