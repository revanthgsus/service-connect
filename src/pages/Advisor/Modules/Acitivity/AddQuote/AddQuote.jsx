import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { HiPlus } from "react-icons/hi";
import { FiUpload } from "react-icons/fi";
import { Col, Row } from "react-bootstrap";
import PreLoader from "./../../../../../common/PreLoader/PreLoader";
import "./AddQuote.css";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useAuth } from "../../../../../contexts/AuthContext";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import API_BASE_URL from "../../../../../services/AuthService";
import WarrantyModal from "../../../../../common/WarrantyModal/WarrantyModal";
import UPLOAD_FILE_API from "../../../../../services/UploadFile";

const AddQuote = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const location = useLocation();
  const { activityData } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  // const [selectedWarrantyData, setSelectedWarrantyData] = useState(null);
  const [uploadedImageId, setUploadedImageId] = useState(null);

  const companyName = sessionStorage.getItem('companyName');

  const [formData, setFormData] = useState({
    itemCode: "",
    itemName: "",
    labourFee: "",
    itemFee: "",
    itemTax: "",
    labourax: "",
    totalAmount: "",
    additionalInstruction: "",
    warrantyStatus: "",
    imageId: ""
  });

  const debounceTimers = useRef({});
  const fileInputRef = useRef(null);

  const quoteData = [
    { label: "Item Name", type: "text", placeholder: "Enter item name", field: "itemName" },
    {
      fields: [
        { name: "Labour Fee", type: "number", placeholder: "Enter labour fee", field: "labourFee" },
        { name: "Item Fee", type: "number", placeholder: "Enter item fee", field: "itemFee" }
      ]
    },
    { label: "Total Amount", type: "number", placeholder: "Enter total amount", field: "totalAmount" },
    { label: "Additional Instruction", type: "text", placeholder: "Enter description", field: "additionalInstruction" },
  ];

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "itemCode") {
      if (debounceTimers.current) {
        clearTimeout(debounceTimers.current);
      }
      debounceTimers.current = setTimeout(() => {
        if (value.trim() !== "") {
          fetchItemDetails(value.trim());
        }
      }, 1000);
    }

    if (field === "labourFee" || field === "itemFee") {
      const labourFee = field === "labourFee" ? value : formData.labourFee;
      const itemFee = field === "itemFee" ? value : formData.itemFee;
      const total = Number(labourFee) + Number(itemFee);
      setFormData((prev) => ({ ...prev, totalAmount: total }));
    }
  };

  const fetchItemDetails = async (itemCode) => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const customerId = activityData?.data?.customerId;
    const productName = activityData?.data?.productName;
    const productSerialNo = activityData?.data?.productSerialNo;

    const payload = {
      itemCode: itemCode,
      customerId: customerId,
      companyName: companyName,
      productName: productName,
      productSerialNo: productSerialNo,
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/itemsList/getItemByItemCode`, payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.status === "success") {
        const item = response.data?.item;
        const total = Number(item.labourFee) + Number(item.itemFee);
        setFormData((prev) => ({
          itemCode,
          itemName: item.itemName || "",
          labourFee: item.labourFee || "",
          labourTax: item.labourTax || "",
          itemFee: item.itemFee || "",
          itemTax: item.itemTax || "",
          totalAmount: total || "",
          warrantyStatus: item.warrantyStatus || ""
        }));
      } else {
        toast.error("No matching item found in records.");
      }
    } catch {
      toast.error("Something went wrong. Please try again later");
    } finally {
      setLoading(false);
    }
  };


  // handle view warranty modal
  // const handleView = (itemDetails) => {
  //   setSelectedWarrantyData(itemDetails);
  //   setPopupOpen(true);
  // };


  const handleImageUpload = async (file) => {
    if (!file || file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB.");
      return;
    }

    const token = sessionStorage.getItem("authToken");
    const userId = sessionStorage.getItem("userId");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result); // Show preview
    };
    reader.readAsDataURL(file);


    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadResponse = await axios.post(`${UPLOAD_FILE_API}/v1/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const fileName = uploadResponse?.data?.fileName || file.name;
      setUploadedImageId(fileName);

      if (uploadResponse.status !== 200) {
        toast.error('Image upload failed.');
        return;
      }

      // step 2
      const updateResponse = await axios.put(
        `${API_BASE_URL}/userMaster/updateImageId/${userId}/${fileName}`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (updateResponse?.data?.status === "success") {
        // toast.success('Profile picture updated successfully.');
      } else {
        toast.error("Failed to upload image.");
      }
    } catch {
      toast.error('Something went wrong. Please try again');
    } finally {
      setLoading(false);
    }
  }

  const handleSend = async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    if (!formData.itemCode || !formData.itemName || !formData.totalAmount) {
      toast.error("Please fill all required fields.");
      return;
    }

    const payload = [
      {
        itemCode: formData.itemCode,
        itemName: formData.itemName,
        labourFee: formData.labourFee,
        itemFee: formData.itemFee,
        itemTax: formData.itemTax || 0,
        labourTax: formData.labourTax || 0,
        totalAmount: formData.totalAmount,
        imageId: uploadedImageId,
        appointmentId: activityData.data.appointmentId,
        customerId: activityData.data.customerId,
        additionalInstruction: formData.additionalInstruction,
      }
    ];


    try {
      const response = await axios.post(`${API_BASE_URL}/advisorMaster/addAdditionalQuotes`, payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.status === "success") {
        toast.success("Quote sent successfully!");
        setTimeout(() => navigate(-1), 1000);
      } else {
        toast.error(response?.data?.message || "Failed to add quote");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading ? (<PreLoader />
      ) : (
        <section className="additional-container">
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
              <Col xxl={5} xl={5} lg={5} md={6} sm={8}>
                <div className={`image-container ${dragging ? "dragging" : ""} mt-3`}>
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
                <div className="form-group">
                  <label htmlFor="itemCode">Item Code</label>
                  {/* {formData.warrantyStatus && (
                    <span
                      className={`warranty-status ${formData.warrantyStatus
                        .replace(/\s/g, "")
                        .toLowerCase()}`}
                      onClick={handleView}
                    >
                      {formData.warrantyStatus}
                    </span>
                  )} */}
                  {/* <span onClick={() => handleView(formData)}
                    className={`warranty-status s
                            ${formData.warrantyStatus === "Warranty Covered" ? "covered"
                        : formData.warrantyStatus === "Expired" ? "expired"
                          : formData.warrantyStatus === "Claimed" ? "claimed"
                            : formData.warrantyStatus === "Declined" ? "declined"
                              : formData.warrantyStatus === "Already Claimed" ? "alreadyclaimed"
                                : formData.warrantyStatus === "View & claim" ? "viewclaim" : ""}`}>

                    {formData.warrantyStatus === "No" ? ""
                      : formData.warrantyStatus}
                  </span>
                  {warrantyStatus && (
                    <span className={`warranty-status ${warrantyStatus.replace(/\s/g, "").toLowerCase()}`}>
                      {warrantyStatus}
                    </span> */}
                  {/* )} */}
                  <input
                    type="text"
                    placeholder="Enter item code"
                    className="form-control"
                    value={formData.itemCode}
                    onChange={(e) => handleChange("itemCode", e.target.value)}
                  />
                </div>

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
                              value={formData[field.field]}
                              onChange={(e) => handleChange(field.field, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    ) : item.label === "Additional Instruction" ? (
                      <textarea
                        placeholder={item.placeholder}
                        className="form-control text-area"
                        rows={2}
                        value={formData[item.field]}
                        onChange={(e) => handleChange(item.field, e.target.value)}
                      />
                    ) : (
                      <input
                        type={item.type}
                        placeholder={item.placeholder}
                        className="form-control"
                        value={formData[item.field]}
                        onChange={(e) => handleChange(item.field, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </Col>
            </Row>
          </div>

          <button
            type="button"
            className="send-btn"
            onClick={handleSend}
            disabled={loading}>
            {loading ? "Sending..." : "Send Quote"}</button>
        </section>
      )}

      <WarrantyModal
        show={popupOpen}
        handleClose={() => setPopupOpen(false)}
      // warrantyData={selectedWarrantyData}
      />
      <ToastContainer
        position="top-center"
        autoClose={1000}
        theme="light"
        hideProgressBar={true}
      />
    </>
  );
};

export default AddQuote;
