import { useState } from "react";
import { Container, Button, Table, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Inbox = () => {
  const navigate = useNavigate();
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem("email"); // store user email at login

  const fetchInbox = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/mails/inbox/${email}`
      );
      setMails(res.data);
    } catch (err) {
      console.error("Error fetching inbox:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="p-5"
      style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📥 Inbox</h2>

        <div>
          <Button variant="primary" onClick={fetchInbox} className="me-3">
            {loading ? <Spinner animation="border" size="sm" /> : "Check Latest Messages"}
          </Button>

          <Button variant="success" onClick={() => navigate("/compose")}>
            Compose Mail
          </Button>
        </div>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>From</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Received On</th>
          </tr>
        </thead>
        <tbody>
          {mails.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center">
                No messages found.
              </td>
            </tr>
          ) : (
            mails.map((mail) => (
              <tr key={mail._id}>
                <td>{mail.sender}</td>
                <td>{mail.subject}</td>
                <td>{mail.body}</td>
                <td>{new Date(mail.timestamp).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default Inbox;
