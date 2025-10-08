import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Mailbox: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return null;
  }

  return (
    <Container className="text-center mt-5">
      <h1>Welcome to your mail box</h1>
      <p>You are successfully logged in.</p>

      <div className="d-flex justify-content-center gap-3 mt-4">
        <Button variant="primary" onClick={() => navigate("/compose")}>
          Compose Mail
        </Button>

        <Button
          variant="danger"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Logout
        </Button>
      </div>
    </Container>
  );
};

export default Mailbox;
