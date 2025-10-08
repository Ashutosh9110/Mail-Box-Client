import { useState } from "react";
import axios from "axios";

interface SignupPayload {
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const useAuthApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  //Signup function
  const signup = async (payload: SignupPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post("http://localhost:5000/api/v1/users/signup", payload);
      if (res.status === 200 || res.status === 201) {
        setSuccess("User has successfully signed up!");
      }
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post("http://localhost:5000/api/v1/users/login", payload);
      if (res.status === 200) {
        setSuccess("Login successful!");
        localStorage.setItem("token", res.data.token);
      }
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signup, login, loading, error, success, setError, setSuccess };
};
