// src/hooks/useMailApi.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useMailApi = (email) => {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch inbox mails
  const fetchInbox = useCallback(async () => {
    if (!email) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/mails/inbox/${email}`);
      const newMails = res.data;
      setMails((prev) => {
        const prevIds = prev.map((m) => m._id).join(",");
        const newIds = newMails.map((m) => m._id).join(",");
        return prevIds !== newIds ? newMails : prev;
      });
    } catch (err) {
      setError(err);
      console.error("Error fetching inbox:", err);
    }
  }, [email]);

  // Fetch sent mails
  const fetchSent = useCallback(async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/mails/sent/${email}`);
      setMails(res.data);
    } catch (err) {
      setError(err);
      console.error("Error fetching sent mails:", err);
    } finally {
      setLoading(false);
    }
  }, [email]);

  // Mark mail as read
  const markAsRead = async (mailId) => {
    try {
      await axios.patch(`http://localhost:5000/api/v1/mails/read/${mailId}`);
      setMails((prev) => prev.map((m) => (m._id === mailId ? { ...m, read: true } : m)));
    } catch (err) {
      console.error("Error marking mail as read:", err);
    }
  };

  // Delete mail
  const deleteMail = async (mailId) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/mails/delete/${mailId}`);
      setMails((prev) => prev.filter((m) => m._id !== mailId));
    } catch (err) {
      console.error("Error deleting mail:", err);
      alert("Failed to delete mail");
    }
  };

  return {
    mails,
    loading,
    error,
    fetchInbox,
    fetchSent,
    markAsRead,
    deleteMail,
    setMails,
  };
};
