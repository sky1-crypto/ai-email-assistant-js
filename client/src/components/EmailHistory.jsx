
import { useEffect, useState } from "react";
import "./EmailHistory.css";
import { toast } from "react-toastify";

function EmailHistory() {
    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editData, setEditData] = useState({
        subject: "",
        recipient: "",
        body: ""
    });
    const startEditing = (email) => {
        setSelectedEmail(email);

        setEditData({
            subject: email.subject,
            recipient: email.recipient,
            body: email.body
        });

        setIsEditing(true);
    };


    const saveEmail = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/email/history/${selectedEmail._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(editData)
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update email");
            }

            const data = await response.json();

            setEmails((prev) =>
                prev.map((email) =>
                    email._id === selectedEmail._id
                        ? data.email
                        : email
                )
            );

            setSelectedEmail(data.email);
            setIsEditing(false);
            toast.success("Email updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update email");
        }
    };


    const deleteEmail = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/email/history/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete email");
            }

            setEmails((prevEmails) =>
                prevEmails.filter((email) => email._id !== id)
            );

            if (selectedEmail?._id === id) {
                setSelectedEmail(null);
            }

            toast.success("Email deleted successfully!");

        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/email/history"
                );

                const data = await response.json();
                setEmails(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div>
            <h2>Email History</h2>

            {emails.map((email) => (
                <div key={email._id} className="email-card">
                    <h3>{email.subject}</h3>
                    <p>To: {email.recipient}</p>

                    <p>
                        {email.body.slice(0, 100)}...
                    </p>

                    <button onClick={() => setSelectedEmail(email)}>
                        View Email
                    </button>

                    <button onClick={() => deleteEmail(email._id)}>
                        Delete
                    </button>
                </div>
            ))}


            {selectedEmail && (
                <div className="email-details">

                    {isEditing ? (
                        <>
                            <input
                                value={editData.subject}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        subject: e.target.value
                                    })
                                }
                            />

                            <input
                                value={editData.recipient}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        recipient: e.target.value
                                    })
                                }
                            />

                            <textarea
                                value={editData.body}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        body: e.target.value
                                    })
                                }
                            />

                            <button onClick={saveEmail}>
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <>
                            <h2>{selectedEmail.subject}</h2>
                            <p>To: {selectedEmail.recipient}</p>
                            <p>{selectedEmail.body}</p>

                            <button onClick={() => startEditing(selectedEmail)}>
                                Edit Email
                            </button>
                        </>
                    )}

                    <button onClick={() => {
                        setSelectedEmail(null);
                        setIsEditing(false);
                    }}>
                        Close
                    </button>

                </div>
            )}

        </div>
    );
}

export default EmailHistory;
