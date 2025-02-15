import React, { useState, useEffect } from "react";
import "./RejectModal.css";
import { Modal } from "react-bootstrap";

const RejectModal = ({ showRejectModal, handleCloseReject, reason: initialReason }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    setReason(initialReason || "");
  }, [initialReason, showRejectModal]);

  const handleSubmit = () => {
    if (!reason.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      handleCloseReject();
    }, 500);
  };

  return (
    <Modal show={showRejectModal} animation onHide={handleCloseReject} className="Reject-popup">
      <Modal.Header closeButton className="border-0">
        <Modal.Title>Reject Reason</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <textarea
          className="form-control mt-2"
          placeholder="Enter reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer className="border-0">
        <button className="reject-confirm-btn"
          onClick={handleSubmit}
          disabled={isSubmitting || !reason.trim()}>Submit</button>
      </Modal.Footer>
    </Modal >
  );
};

export default RejectModal;