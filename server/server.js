
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateEmail } from "./services/gemini.js";
import connectDB from "./config/db.js";
import Email from "./models/Email.js";

dotenv.config();

await connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const emailRoutes = require("./routes/emailRoutes");

app.use("/api/email", emailRoutes);
app.get("/", (req, res) => {
    res.send("AI Email Assistant Backend is running!");
});

app.post("/api/email/generate", async (req, res) => {
    try {
        const { recipient, recipientName, topic, tone } = req.body;

        if (!recipient || !recipientName || !topic) {
            return res.status(400).json({
                error: "Recipient, name and topic are required",
            });
        }

        const email = await generateEmail({
            recipient,
            recipientName,
            topic,
            tone,
        });

        const savedEmail = await Email.create({
            recipient,
            recipientName,
            topic,
            tone,
            subject: email.subject,
            body: email.body,
        });

        res.status(200).json({
            success: true,
            email: savedEmail,
        });

    } catch (error) {
        console.error("Email generation error:", error);

        res.status(500).json({
            success: false,
            error: "Failed to generate email",
        });
    }
});



app.post("/api/email/revise", async (req, res) => {
    try {
        const { recipient, recipientName, topic, tone, feedback, currentEmail } = req.body;

        if (!feedback || !currentEmail?.body || !currentEmail?.subject) {
            return res.status(400).json({
                error: "Feedback and current email are required",
            });
        }

        const revisedEmail = await reviseEmail({
            recipient,
            recipientName,
            topic,
            tone,
            feedback,
            currentEmail,
        });

        res.json({
            success: true,
            email: revisedEmail,
        });
    } catch (error) {
        console.error("Revision error:", error);
        res.status(500).json({
            error: "Failed to revise email",
        });
    }
});

app.get("/api/email/history", async (req, res) => {
    try {
        const emails = await Email.find()
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({
            success: true,
            emails,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to fetch email history",
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
