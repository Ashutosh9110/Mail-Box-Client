import { useState, useEffect } from "react";
import { Container, Button, Table, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Inbox = () => {
  const navigate = useNavigate();
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);
  const [showSent, setShowSent] = useState(false); // 👈 NEW
  const email = localStorage.getItem("email");

  const fetchInbox = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/mails/inbox/${email}`);
      setMails(res.data);
    } catch (err) {
      console.error("Error fetching inbox:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSent = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/mails/sent/${email}`);
      setMails(res.data);
    } catch (err) {
      console.error("Error fetching sent mails:", err);
    } finally {
      setLoading(false);
    }
  };

  // load inbox by default
  useEffect(() => {
    fetchInbox();
  }, []);

  const toggleMailView = () => {
    if (showSent) {
      fetchInbox();
    } else {
      fetchSent();
    }
    setShowSent(!showSent);
    setSelectedMail(null);
  };

  const handleMailClick = async (mail) => {
    setSelectedMail(mail);
    if (!showSent && !mail.read) {
      try {
        await axios.patch(`http://localhost:5000/api/v1/mails/read/${mail._id}`);
        setMails((prev) =>
          prev.map((m) => (m._id === mail._id ? { ...m, read: true } : m))
        );
      } catch (err) {
        console.error("Error marking mail as read:", err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this mail?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/v1/mails/delete/${id}`);
      setMails((prev) => prev.filter((mail) => mail._id !== id));
    } catch (err) {
      console.error("Error deleting mail:", err);
      alert("Failed to delete mail");
    }
  };

  const unreadCount = mails.filter((m) => !m.read).length;

  return (
    <Container
      fluid
      className="p-5"
      style={{ backgroundColor: "#f5f7fa", minHeight: "100vh", width: "100vw" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          {showSent
            ? "Sent Messages"
            : `Inbox ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
        </h2>

        <div>
          <Button
            variant="primary"
            onClick={() => navigate("/compose")}
            className="me-3"
          >
            Compose a new email
          </Button>

          <Button
            variant={showSent ? "secondary" : "info"}
            className="me-3"
            onClick={toggleMailView}
          >
            {showSent ? "Check Inbox" : "Check Sent Messages"}
          </Button>

          <Button variant="success" onClick={() => navigate("/mailbox")}>
            Back to Homepage
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table hover responsive>
          <thead>
            <tr>
              {!showSent && <th>Status</th>}
              <th>{showSent ? "To" : "From"}</th>
              <th>Subject</th>
              <th>{showSent ? "Sent On" : "Received On"}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mails.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  No messages found.
                </td>
              </tr>
            ) : (
              mails.map((mail) => (
                <tr
                  key={mail._id}
                  onClick={() => handleMailClick(mail)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: showSent
                      ? "#fff"
                      : mail.read
                      ? "#fff"
                      : "#eaf3ff",
                  }}
                >
                  {!showSent && (
                    <td style={{ textAlign: "center" }}>
                      {!mail.read && (
                        <span
                          style={{
                            display: "inline-block",
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: "#007bff",
                          }}
                        ></span>
                      )}
                    </td>
                  )}
                  <td>{showSent ? mail.receiver : mail.sender}</td>
                  <td>{mail.subject}</td>
                  <td>{new Date(mail.timestamp).toLocaleString()}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(mail._id);
                      }}
                    >
                      🗑 Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {/* Modal to show full message */}
      <Modal show={!!selectedMail} onHide={() => setSelectedMail(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedMail?.subject}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>From:</strong> {selectedMail?.sender}</p>
          <hr />
          <div dangerouslySetInnerHTML={{ __html: selectedMail?.body }}></div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedMail(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Inbox;
