const express = require("express");
const router = express.Router();

const Email = require("../models/Email");

// DELETE an email
router.delete("/history/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEmail = await Email.findByIdAndDelete(id);

    if (!deletedEmail) {
      return res.status(404).json({
        message: "Email not found"
      });
    }

    res.status(200).json({
      message: "Email deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting email",
      error: error.message
    });
  }
});


const getEmailHistory = async (req, res) => {
  try {
    const emails = await Email.find().sort({
      createdAt: -1
    });

    res.status(200).json(emails);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching emails",
      error: error.message
    });
  }
};



const saveEmail = async (req, res) => {
  try {
    const { subject, recipient, body } = req.body;

    const email = await Email.create({
      subject,
      recipient,
      body
    });

    res.status(201).json({
      message: "Email saved successfully",
      email
    });

  } catch (error) {
    res.status(500).json({
      message: "Error saving email",
      error: error.message
    });
  }
};


module.exports = { deleteEmail, getEmailHistory, saveEmail };