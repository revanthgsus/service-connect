import React, { useCallback, useEffect, useRef, useState } from 'react';
import "./EditItem.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import PreLoader from '../../../../../common/PreLoader/PreLoader';
import CancelModal from '../../../../../common/CancelModal/CancelModal';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../../../../contexts/AuthContext';
import { itemValidationSchema } from '../../../../../utils/FormValidation';

const EditItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowTokenModal } = useAuth();
  const { itemData } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [cancelShow, setCancelShow] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});
  const fieldRefs = useRef({});

  const initialValues = {
    itemId: itemData?.itemId || '',
    itemName: itemData?.itemName || '',
    itemCode: itemData?.itemCode || '',
    itemType: itemData?.itemType || '',
    itemFee: itemData?.itemFee || '',
    labourFee: itemData?.labourFee || '',
    labourTax: itemData?.labourTax || '',
    itemTax: itemData?.itemTax || '',
    quantity: itemData?.quantity || '',
    minimumStockAlert: itemData?.minimumStockAlert || '',
    unitOfMeasurement: itemData?.unitOfMeasurement || '',
    warrantyPeriod: itemData?.warrantyPeriod || '',
  }

  const itemSections = [
    {
      title: "Basic Information",
      fields: [
        { label: "Item Name", name: "itemName", placeholder: "Enter item name", type: "text" },
        { label: "Item Code", name: "itemCode", placeholder: "Enter item code", type: "text" },
        { label: "Item Type", name: "itemType", placeholder: "Enter item type", type: "text" },
      ],
    },
    {
      title: "Cost Details",
      fields: [
        { label: "Item Fee", name: "itemFee", placeholder: "Enter item fee", type: "number" },
        { label: "Labour Fee", name: "labourFee", placeholder: "Enter labour fee", type: "number" },
        { label: "Labour Tax", name: "labourTax", placeholder: "Enter labour tax", type: "number" },
        { label: "Item Tax", name: "itemTax", placeholder: "Enter item tax", type: "number" },
      ],
    },
    {
      title: "Stock Information",
      fields: [
        { label: "Quantity", name: "quantity", placeholder: "Enter quantity", type: "text" },
        { label: "Minimum Stock Alert", name: "minimumStockAlert", placeholder: "Enter minimum stock", type: "text" },
        { label: "Unit of Measurement", name: "unitOfMeasurement", placeholder: "Enter measurement", type: "text" },
        { label: "Warranty Period", name: "warrantyPeriod", placeholder: "Enter warranty period", type: "text" },
      ],
    },
  ];

  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      const firstErrorField = Object.keys(formErrors).find(field => formTouched[field]);
      if (firstErrorField && fieldRefs.current[firstErrorField]) {
        setTimeout(() => {
          fieldRefs.current[firstErrorField].scrollIntoView({ behavior: "smooth", block: "center" });
        }, 500);
      }
    }
  }, [formErrors, formTouched]);

  const handleSubmit = useCallback(async (values, { setSubmitting }) => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const payload = {
      ...values,
    };

    try {
      const response = await axios.put(`${API_BASE_URL}/itemsList/updateItemsList`,
        payload, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (response?.data?.status === "success") {
        toast.success(response?.data?.message || "item updated successfully.");
        setTimeout(() => { navigate("/admin/items") }, 1000);
      } else {
        toast.error(response?.data?.error || "Failed to update item. Please try again.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || "An error occurred while saving the data.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  }, [navigate, setShowTokenModal]);


  const handleCancel = () => { setCancelShow(true) };
  const handleCancelClose = () => { setCancelShow(false) };
  const handleBack = () => { setCancelShow(true) };

  return (
    <>
      {loading ? (<PreLoader />
      ) : (
        <section className="edit-item">
          <div className="edit-header">
            <IoMdArrowRoundBack onClick={handleBack} />
            <h5>Edit item</h5>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={itemValidationSchema}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({ values, handleChange, touched, errors, isSubmitting }) => {
              setFormErrors(errors);
              setFormTouched(touched);
              return (
                <Form>
                  <div className="edit-form">
                    <h5 className="edititem-heading">Item Information</h5>

                    {itemSections.map((section, index) => (
                      <Row className="add-fields" key={index}>
                        <h5 className='subtitle-heading'>{section.title}</h5>
                        {section.fields.map((field, idx) => (
                          <Col key={idx} xxl={4} xl={4} lg={4} md={6} sm={6}>
                            <div className="input-wrapper">
                              <div className="form-group">
                                <label htmlFor={field.name}>{field.label}</label>
                                <Field
                                  id={field.name}
                                  type={field.type}
                                  name={field.name}
                                  placeholder={field.placeholder}
                                  className="form-control"
                                  value={values[field.name]}
                                  onChange={handleChange}
                                  ref={(el) => (fieldRefs.current[field.name] = el)}
                                />
                                <ErrorMessage name={field.name} component="div" className="error-message" />
                              </div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    ))}
                  </div>

                  <div className="form-submit-button">
                    <button type="button" className="cancel-button" onClick={handleCancel}>
                      Cancel</button>
                    <button type="submit" className="save-button" disabled={isSubmitting}>Save</button>
                  </div>
                </Form>
              )
            }}
          </Formik>
        </section>)}

      <CancelModal cancelShow={cancelShow} handleCancelClose={handleCancelClose} />
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  );
};

export default EditItem;
