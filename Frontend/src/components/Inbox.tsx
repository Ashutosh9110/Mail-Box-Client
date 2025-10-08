// src/components/Inbox.jsx
import { Container, Button, Table, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMailApi } from "../hooks/useMailApi";
import { usePolling } from "../hooks/usePolling";

const Inbox = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const [showSent, setShowSent] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);

  const {
    mails,
    loading,
    fetchInbox,
    fetchSent,
    markAsRead,
    deleteMail,
  } = useMailApi(email);

  // ✅ Poll inbox every 2s only if inbox is active
  usePolling(fetchInbox, 2000, !showSent);

  const toggleMailView = () => {
    showSent ? fetchInbox() : fetchSent();
    setShowSent((prev) => !prev);
    setSelectedMail(null);
  };

  const handleMailClick = (mail) => {
    setSelectedMail(mail);
    if (!showSent && !mail.read) {
      markAsRead(mail._id);
    }
  };

  const unreadCount = mails.filter((m) => !m.read).length;

  return (
    <Container fluid className="p-5" style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          {showSent ? "Sent Messages" : `Inbox ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
        </h2>
        <div>
          <Button variant="primary" onClick={() => navigate("/compose")} className="me-3">
            Compose a new email
          </Button>
          <Button variant={showSent ? "secondary" : "info"} className="me-3" onClick={toggleMailView}>
            {showSent ? "Check Inbox" : "Check Sent Messages"}
          </Button>
          <Button variant="success" onClick={() => navigate("/mailbox")}>Back to Homepage</Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
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
              <tr><td colSpan={5} className="text-center">No messages found.</td></tr>
            ) : (
              mails.map((mail) => (
                <tr
                  key={mail._id}
                  onClick={() => handleMailClick(mail)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: showSent ? "#fff" : mail.read ? "#fff" : "#eaf3ff",
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
                        deleteMail(mail._id);
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
          <Button variant="secondary" onClick={() => setSelectedMail(null)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Inbox;
