import { useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ComposeMail() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const navigate = useNavigate();

  const handleSend = async () => {
    const body = JSON.stringify(convertToRaw(editorState.getCurrentContent()));

    try {
      await axios.post("http://localhost:5000/api/v1/mails/send", {
        sender: localStorage.getItem("userEmail"),
        receiver: to,
        subject,
        body,
      });

      alert("Mail sent successfully!");
      navigate("/mailbox");
    } catch (err) {
      console.error(err);
      alert("Failed to send mail");
    }
  };

  return (
    <div
      className="d-flex flex-column justify-content-start align-items-center p-4"
      style={{
        height: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div
        className="w-100 shadow-lg rounded-3 p-3 bg-white"
        style={{ maxWidth: "900px", height: "90vh" }}
      >
        <div className="mb-2 d-flex justify-content-between align-items-center">
          <h4>New Message</h4>
          <button className="btn btn-outline-secondary" onClick={() => navigate("/mailbox")}>
            ✖ Close
          </button>
        </div>

        <input
          type="email"
          className="form-control mb-2"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />

        <input
          type="text"
          className="form-control mb-2"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <div className="flex-grow-1 mb-3 border" style={{ minHeight: "400px" }}>
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            toolbar={{
              options: ["inline", "fontSize", "colorPicker", "link", "emoji", "remove", "history"],
              inline: { options: ["bold", "italic", "underline", "strikethrough"] },
            }}
          />
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary" onClick={() => navigate("/mailbox")}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
