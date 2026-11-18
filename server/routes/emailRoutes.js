
const express = require("express");
const router = express.Router();

const {
  deleteEmail
} = require("../controllers/emailController");

router.delete("/history/:id", deleteEmail);

router.put("/history/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, recipient, body } = req.body;

    const updatedEmail = await Email.findByIdAndUpdate(
      id,
      {
        subject,
        recipient,
        body
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedEmail) {
      return res.status(404).json({
        message: "Email not found"
      });
    }

    res.status(200).json({
      message: "Email updated successfully",
      email: updatedEmail
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating email",
      error: error.message
    });
  }
});


module.exports = router;
