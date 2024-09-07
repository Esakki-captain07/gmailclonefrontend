import React, { useState, useEffect } from 'react';
import AxiosService from '../utils/AxiosService';
import ApiRoutes from '../utils/ApiRoutes';
import toast from 'react-hot-toast';

function Compose({ onSend, onClose, initialEmailData }) {
  const [recipients, setRecipients] = useState(initialEmailData?.recipients || '');
  const [subject, setSubject] = useState(initialEmailData?.subject || '');
  const [body, setBody] = useState(initialEmailData?.body || '');
  const [attachments, setAttachments] = useState(initialEmailData?.attachments || []);
  const [isDraft, setIsDraft] = useState(initialEmailData?.draft || false);

  useEffect(() => {
    if (initialEmailData) {
      setRecipients(initialEmailData.recipients);
      setSubject(initialEmailData.subject);
      setBody(initialEmailData.body);
      setAttachments(initialEmailData.attachments || []);
      setIsDraft(initialEmailData.draft || false);
    }
  }, [initialEmailData]);

  const handleSendOrSave = async (e) => {
    e.preventDefault(); 
    if (!recipients || !subject || !body) {
      toast.error("All fields are required");
      return;
    }

    try {
      const emailData = { 
        _id: initialEmailData?._id, 
        recipients, 
        subject, 
        body, 
        attachments,
        draft: isDraft
      };

      const endpoint = isDraft ? ApiRoutes.SAVE_DRAFT.path : ApiRoutes.SEND_MAIL.path;

      await AxiosService.post(endpoint, emailData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });

      toast.success(isDraft ? "Draft saved successfully!" : "Email sent successfully!");
      onSend(emailData);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "An unexpected error occurred.");
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (validateExtension(selectedFile.name)) {
      let reader = new FileReader();

      reader.onload = () => {
        setAttachments(prev => [...prev, { name: selectedFile.name, data: reader.result }]);
      };

      reader.readAsDataURL(selectedFile);
    } else {
      toast.error('Invalid file type');
    }
  };

  const validateExtension = (fileName) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
    const extension = fileName.split('.').pop();
    return allowedExtensions.includes(extension.toLowerCase());
  };

  return (
    <div className="compose-overlay">
      <div className="compose-email">
        <div className='compose-top'>
          <button className="compose-close" onClick={onClose}>×</button>
          <h5>{initialEmailData ? 'Edit Message' : 'New Message'}</h5>
        </div>
        <div className="compose-field">
          <input type="email" placeholder="To" value={recipients} onChange={(e) => setRecipients(e.target.value)} 
          />
        </div>
        <div className="compose-field">
          <input type="text" placeholder="Subject"value={subject} onChange={(e) => setSubject(e.target.value)} 
          />
        </div>
        <div className="compose-field">
          <textarea placeholder="Message"value={body}onChange={(e) => setBody(e.target.value)} ></textarea>
        </div>
        <div className="compose-field">
          <input type="file" onChange={handleFileChange} multiple/>
          {attachments.length > 0 && (
            <div className="attachment-preview">
              {attachments.map((file, index) => (
                <div key={index}>
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="compose-buttons">
          <label>
            <input type="checkbox" checked={isDraft}onChange={() => setIsDraft(!isDraft)} />
            Save as Draft
          </label>&nbsp;
          <button onClick={handleSendOrSave}>
            {isDraft ? 'Save Draft' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Compose;
