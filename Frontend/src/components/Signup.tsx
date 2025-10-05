import { useState } from "react";
import { Form, Button, Container, Row, Col, Alert, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom"

interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const [form, setForm] = useState<SignupForm>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate()


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { email, password, confirmPassword } = form;

    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        email,
        password,
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess("User has successfully signed up!");
        setForm({ email: "", password: "", confirmPassword: "" });
        setTimeout(() => {
           navigate("/login")
        }, 2000)

      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row className="w-100" style={{ maxWidth: "500px" }}>
        <Col>
          <Card className="p-4 shadow">
            <h2 className="text-center mb-4">Sign Up</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="confirmPassword" className="mb-4">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={!form.email || !form.password || !form.confirmPassword}
              >
                Sign Up
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
