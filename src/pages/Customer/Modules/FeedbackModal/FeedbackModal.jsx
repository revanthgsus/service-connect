import React, { useState } from "react";
import "./FeedbackModal.css";
import { Modal } from "react-bootstrap";
import { Box, Rating, SvgIcon } from '@mui/material';
import { HiOutlineStar } from "react-icons/hi2";
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from "../../../../contexts/AuthContext";
import axios from "axios";
import API_BASE_URL from "../../../../services/AuthService";

const FeedbackModal = ({ show, onHide, orderId }) => {
  const { setShowTokenModal } = useAuth();
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const RoundedStar = (props) => (
    <SvgIcon {...props} sx={{ color: "#FFCD19", fontSize: 30, }}>
      <path
        d="M12 2.5c.5 0 1 .3 1.2.8l2.4 4.9 5.3.8c.5.1.9.5 1 1 .1.5-.1 1-.5 1.3l-3.8 3.7.9 5.3c.1.5-.1 1-.5 1.3-.4.3-.9.3-1.4.1L12 18.8l-4.8 2.5c-.5.2-1 .2-1.4-.1-.4-.3-.6-.8-.5-1.3l.9-5.3L2.4 11c-.4-.3-.6-.8-.5-1.3.1-.5.5-.9 1-1l5.3-.8 2.4-4.9c.2-.5.7-.8 1.2-.8z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0"
      />
    </SvgIcon>
  );

  const handleSubmit = async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    if (!orderId) {
      toast.error("Order ID missing.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      orderId: orderId,
      rating: rating,
      review: review.trim(),
    };

    try {
      const response = await axios.put(`${API_BASE_URL}/paymentMaster/feedback`, payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.status === "success") {
        toast.success("Thank you for your feedback!");
        onHide();
        setReview("");
        setRating(1);
      } else {
        toast.error("Failed to submit feedback.");
      }
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal show={show} animation onHide={onHide} backdrop="static"
        className="feedback-popup" dialogClassName="modal-dialog-centered">
        <Modal.Header className="border-0 mt-4"></Modal.Header>
        <Modal.Body>
          <h5 className="mb-2">Give Me Feedback</h5>
          <Box>
            <Rating
              name="custom-rating"
              value={rating}
              icon={<RoundedStar />}
              onChange={(event, newValue) => { setRating(newValue) }}
              emptyIcon={<HiOutlineStar />}
              sx={{ fontSize: 30 }}
            />
          </Box>

          <textarea
            className="form-control text-area"
            placeholder="Write a review..."
            rows={6}
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer className="border-0">
          <button className="feedback-btn"
            onClick={handleSubmit}
            disabled={isSubmitting || review.trim() === ""}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </Modal.Footer>
      </Modal >

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  );
};

export default FeedbackModal;