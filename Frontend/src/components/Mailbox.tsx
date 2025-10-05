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
      <Button
        variant="danger"
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Logout
      </Button>
    </Container>
  );
};

export default Mailbox;
