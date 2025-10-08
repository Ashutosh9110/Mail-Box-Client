// src/hooks/useSendMail.js
import axios from "axios";

export const useSendMail = () => {
  const sendMail = async (formData) => {
    return axios.post("http://localhost:5000/api/v1/mails/send", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };
  return { sendMail };
};
