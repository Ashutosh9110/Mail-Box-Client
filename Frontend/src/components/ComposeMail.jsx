import { useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";

export default function ComposeMail() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleSend = async () => {
    const body = JSON.stringify(convertToRaw(editorState.getCurrentContent()));

    try {
      await axios.post("http://localhost:5000/api/mails/send", {
        sender: localStorage.getItem("userEmail"), // assume user is logged in
        receiver: to,
        subject,
        body,
      });

      alert("Mail sent successfully!");
      setTo("");
      setSubject("");
      setEditorState(EditorState.createEmpty());
    } catch (err) {
      console.error(err);
      alert("Failed to send mail");
    }
  };

  return (
    <div className="container mt-4">
      <div className="border rounded-3 shadow-sm p-3" style={{ background: "#fff" }}>
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
        <div className="mb-3" style={{ border: "1px solid #ccc", minHeight: "200px" }}>
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            toolbar={{
              options: ["inline", "fontSize", "colorPicker", "link", "emoji", "remove", "history"],
              inline: { options: ["bold", "italic", "underline", "strikethrough"] },
            }}
          />
        </div>
        <button className="btn btn-primary" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
