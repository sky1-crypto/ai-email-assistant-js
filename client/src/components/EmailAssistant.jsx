
import { useState } from "react";
import { generateEmail, reviseEmail } from "../services/emailService";

function EmailAssistant() {
  const questions = [
    "Who do you want to send the email to? Enter their email address.",
    "What is the recipient's name?",
    "What is the purpose of your email?",
  ];
  const [feedback, setFeedback] = useState("");
  const [revising, setRevising] = useState(false);
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [form, setForm] = useState({
    recipient: "",
    recipientName: "",
    topic: "",
    tone: "professional",
  });

  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      text: questions[0],
    },
  ]);

  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addMessage = (sender, text) => {
    setMessages((prev) => [
      ...prev,
      { sender, text },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const value = answer.trim();

    if (!value || loading) return;

    if (step === 0) {
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      if (!validEmail) {
        setError("Please enter a valid email address.");
        return;
      }
    }

    setError("");
    addMessage("user", value);
    setAnswer("");

    const fields = [
      "recipient",
      "recipientName",
      "topic",
    ];

    const updatedForm = {
      ...form,
      [fields[step]]: value,
    };

    setForm(updatedForm);

    if (step < 2) {
      setStep(step + 1);
      addMessage("assistant", questions[step + 1]);
      return;
    }

    setLoading(true);
    addMessage("assistant", "Generating your email...");

    try {
      const result = await generateEmail(updatedForm);

      setEmail(result);
      addMessage(
        "assistant",
        "Your email draft is ready! Please review it below."
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Could not generate the email."
      );
      addMessage(
        "assistant",
        "I couldn't generate the email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = () => {
    const gmailUrl = new URL(
      "https://mail.google.com/mail/?view=cm&fs=1"
    );

    gmailUrl.searchParams.set("to", form.recipient);
    gmailUrl.searchParams.set("su", email.subject);
    gmailUrl.searchParams.set("body", email.body);

    window.open(gmailUrl.toString(), "_blank", "noopener,noreferrer");
  };

  const handleRevision = async () => {
    if (!feedback.trim() || revising) return;

    setRevising(true);
    setError("");

    try {
      const revised = await reviseEmail({
        ...form,
        feedback,
        currentEmail: email,
      });

      setEmail(revised);
      setFeedback("");
      addMessage("user", `Please revise: ${feedback}`);
      addMessage("assistant", "Here is your revised draft.");
    } catch (err) {
      setError(
        err.response?.data?.error || "Revision failed"
      );
    } finally {
      setRevising(false);
    }
  };

  return (
    <div className="assistant">
      <h1>AI Email Assistant</h1>
      <p>Your personal email writing assistant</p>

      <div className="chat-box">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender}`}
          >
            <strong>
              {message.sender === "assistant"
                ? "Assistant"
                : "You"}
            </strong>

            <p>{message.text}</p>
          </div>
        ))}
      </div>

      {!email && (
        <form onSubmit={handleSubmit}>
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Send"}
          </button>
        </form>
      )}

      {error && <p className="error">{error}</p>}

      {email && (
        <div className="email-preview">
          <h2>Your Email Draft</h2>

          <label>Subject</label>
          <input
            value={email.subject}
            onChange={(e) =>
              setEmail({ ...email, subject: e.target.value })
            }
          />

          <label>Body</label>
          <textarea
            value={email.body}
            onChange={(e) =>
              setEmail({ ...email, body: e.target.value })
            }
          />

          <label>What would you like to change?</label>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Example: Make it shorter and more polite..."
          />

          <button
            type="button"
            onClick={handleRevision}
            disabled={revising || !feedback.trim()}
          >
            {revising ? "Revising..." : "Revise Email"}
          </button>
          
          <div className="approval-buttons">
            <button onClick={handleApproval}>
              Approve & Open Gmail
            </button>

            <button
              type="button"
              className="reject-btn"
              onClick={() => {
                setEmail(null);
                setStep(0);
                setForm({
                  recipient: "",
                  recipientName: "",
                  topic: "",
                  tone: "professional",
                });
                setMessages([
                  {
                    sender: "assistant",
                    text: questions[0],
                  },
                ]);
              }}
            >
              Start Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailAssistant;
