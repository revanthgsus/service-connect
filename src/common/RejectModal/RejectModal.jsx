import React, { useState, useEffect } from "react";
import "./RejectModal.css";
import { Modal } from "react-bootstrap";

const RejectModal = ({ showRejectModal, handleCloseReject, onSubmitReject, rejectionReason }) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isReadOnly = rejectionReason && rejectionReason !== "-";

  useEffect(() => {
    if (showRejectModal) {
      if (rejectionReason && rejectionReason !== "-") {
        setReason(rejectionReason);
      } else {
        setReason("");
      }
    }
  }, [showRejectModal, rejectionReason]);

  // handleSubmit function for reject reason
  const handleSubmit = () => {
    if (!reason.trim()) return;

    setIsSubmitting(true);
    onSubmitReject(reason.trim());
    setIsSubmitting(false);
    handleCloseReject();
  };

  return (
    <Modal show={showRejectModal} animation onHide={handleCloseReject}
      className="reject-popup" centered  >
      <Modal.Header closeButton className="border-0 mt-2">
      </Modal.Header>
      <Modal.Body>
        <h5>Reject Reason</h5>
        <textarea
          className="form-control text-area mt-4"
          placeholder="Enter reason..."
          rows={7}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          readOnly={isReadOnly}
        />
      </Modal.Body>
      <Modal.Footer className="border-0">
        {!isReadOnly && (
          <button
            className="reject-btn"
            onClick={handleSubmit}
            disabled={isSubmitting || reason.trim() === ""}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </Modal.Footer>
    </Modal >
  );
};

export default RejectModal;