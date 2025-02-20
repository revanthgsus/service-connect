import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { HiPlus } from "react-icons/hi";
import { FiUpload } from "react-icons/fi";
import { Col, Row } from "react-bootstrap";
import PreLoader from "./../../../../../common/PreLoader/PreLoader";
import "./AddQuote.css";
import { IoCloseCircleOutline } from "react-icons/io5";

const AddQuote = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const quoteData = [
    {
      label: "Additional Service",
      type: "text",
      placeholder: "Enter service name",
    },
    {
      fields: [
        {
          name: "Labor Fee",
          type: "number",
          placeholder: "Enter labor fee",
        },
        {
          name: "Item Fee",
          type: "number",
          placeholder: "Enter item fee",
        }
      ]
    },
    {
      label: "Total Amount",
      type: "number",
      placeholder: "Enter total amount",
    },
    {
      label: "Additional Instruction",
      type: "text",
      placeholder: "Enter description",
    },
  ];

  const handleBack = (e) => {
    e.preventDefault();
    setLoading(false);
    navigate(-1);
  };

  const handleImageUpload = (file) => {
    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("File size exceeds 5MB or invalid file type!");
    }
  };

  const removeSelectedImage = (event) => {
    event.stopPropagation(); // Prevents triggering the file input click event
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Drag & Drop Event Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const handleSend = (e) => {
    e.preventDefault();
    navigate(-1)
  }

  return (
    <>
      {loading ? (<PreLoader />
      ) : (
        <section className="additonal-container">
          <div className="heading-container">
            <div className="additional-header">
              <IoMdArrowRoundBack onClick={handleBack} />
              <h5>Add Quote</h5>
            </div>
            <div className="add-more-btn">
              <HiPlus />
              <h5> Add More Quote</h5>
            </div>
          </div>

          <div className="additional-quotes">
            <Row className="d-flex justify-content-center">
              <Col xxl={5} xl={5} lg={5} md={6} sm={8} className="mb-sm-4">
                <div className={`image-container ${dragging ? "dragging" : ""}`}>
                  <div className="image-section"
                    onClick={triggerFileInput}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="additional-image">
                      {selectedImage ? (
                        <div className="uploaded-image-container" onClick={(e) => e.stopPropagation()}>
                          <img
                            src={selectedImage}
                            alt="Uploaded Preview"
                            className="uploaded-image"
                          /> <br />
                          <IoCloseCircleOutline className="close-icon" onClick={removeSelectedImage} />
                        </div>
                      ) : (
                        <>
                          <FiUpload className="default-icon" />
                          <p className="file-size-info">
                            Drag & drop <br /> or <br /> Click to upload: JPG, JPEG, PNG, HEIF, HEIC, and SVG (Max 5MB)
                          </p>
                          <button className="file-info-btn">Browse files</button>
                        </>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png, image/jpeg, image/jpg, image/svg, image/heif, image/heic"
                        onChange={(e) => handleImageUpload(e.target.files[0])}
                        hidden
                      />
                    </div>
                  </div>
                </div>
              </Col>
              <Col xxl={7} xl={7} lg={7} md={6} sm={8}>
                {quoteData.map((item, index) => (
                  <div key={index} className="form-group">
                    {item.label && <label htmlFor={item.label}>{item.label}</label>}
                    {item.fields ? (
                      <div className="fees-container">
                        {item.fields.map((field, fieldIndex) => (
                          <div key={fieldIndex} className="fee-input">
                            <label htmlFor={field.name}>{field.name}</label>
                            <input
                              type={field.type}
                              placeholder={field.placeholder}
                              className="form-control"
                            />
                          </div>
                        ))}
                      </div>
                    ) : item.label === "Additional Instruction" ? (
                      <textarea
                        placeholder={item.placeholder}
                        className="form-control text-area"
                        rows={2}
                      />
                    ) : (
                      <input
                        type={item.type}
                        placeholder={item.placeholder}
                        className="form-control"
                      />
                    )}
                  </div>
                ))}
              </Col>
            </Row>
          </div>

          <button type="button" className="send-btn" onClick={handleSend}>
            Send Quote</button>
        </section>)}
    </>
  );
};

export default AddQuote;
