import { useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import draftToHtml from "draftjs-to-html";

export default function ComposeMail() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState(""); 
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [attachments, setAttachments] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setAttachments([...e.target.files]);
  };
  
  const handleSend = async () => {
  const rawContent = convertToRaw(editorState.getCurrentContent());
  const bodyHtml = draftToHtml(rawContent);

  const formData = new FormData();
  formData.append("sender", localStorage.getItem("userEmail"));
  formData.append("receiver", to);
  formData.append("subject", subject);
  formData.append("body", bodyHtml);

  attachments.forEach((file) => formData.append("attachments", file));

  try {
    await axios.post("http://localhost:5000/api/v1/mails/send", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Mail sent successfully!");
    navigate("/mailbox");
  } catch (err) {
    console.error(err);
    alert("Failed to send mail");
    }
  };


  const uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({ data: { link: e.target.result } });
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
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
            options: [
              "inline",
              "blockType",
              "fontSize",
              "fontFamily",
              "list",
              "textAlign",
              "colorPicker",
              "link",
              "embedded",
              "emoji",
              "image",
              "remove",
              "history",
            ],
            fontSize: {
              options: [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48],
            },
            fontFamily: {
              options: ["Arial", "Georgia", "Impact", "Tahoma", "Times New Roman", "Verdana"],
            },
            link: {
              defaultTargetOption: "_blank",
              showOpenOptionOnHover: true,
            },
            image: {
              uploadCallback: uploadImageCallBack,
              alt: { present: true, mandatory: false },
              previewImage: true,
              inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
            },
          }}
        />

        </div>


        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-3">
          <div className="d-flex align-items-center gap-2">
            <label htmlFor="attachments" className="fw-semibold mb-0">
              📎 Attach files:
            </label>
            <input
              id="attachments"
              type="file"
              multiple
              onChange={handleFileChange}
              className="form-control"
              style={{ width: "auto", maxWidth: "205px" }}
            />
          </div>

          <div className="d-flex gap-2 ms-auto">
            <button
              className="btn btn-outline-secondary px-4"
              onClick={() => navigate("/mailbox")}
            >
              Cancel
            </button>
            <button className="btn btn-primary px-4" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>

        {attachments.length > 0 && (
          <ul className="mt-2 small text-muted">
            {attachments.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        )}

      </div>
    </div>
  );
}
