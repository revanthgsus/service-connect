import React, { useRef, useState } from "react";
import "./CreateItem.css";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FiUpload } from "react-icons/fi";
import { RiDownloadLine, RiFileExcel2Line } from "react-icons/ri";
import axios from "axios";
import API_BASE_URL from "../../../../../services/AuthService";
import { useAuth } from "../../../../../contexts/AuthContext";
import PreLoader from "./../../../../../common/PreLoader/PreLoader";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import UPLOAD_EXCEL_API from "../../../../../services/ExcelFile";

const CreateItem = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const companyName = sessionStorage.getItem("companyName");

  const handleBack = () => { navigate(-1) };

  const handleDownload = async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/itemsList/getAllItemsList/${companyName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.status === 200) {
        const data = response.data;

        const headers = [
          "S.No", "Item Code", "Item Name", "Item Type", "Item Fee", "Labour Fee",
          "Item Tax", "Labour Tax", "Unit of Measurement", "Quantity",
          "Minimum Stock Alert", "Warranty Period", "Company Name"
        ];

        const formattedData = data.map((item, index) => [
          index + 1,
          item.itemCode || "N/A",
          item.itemName || "N/A",
          item.itemType || "N/A",
          item.itemFee || "0",
          item.labourFee || "0",
          item.itemTax || "0",
          item.labourTax || "0",
          item.unitOfMeasurement || "N/A",
          item.quantity || "0",
          item.minimumStockAlert || "0",
          item.warrantyPeriod || "N/A",
          item.companyName || "N/A",
        ]);

        const worksheetData = [headers, ...formattedData];
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        // const headerStyle = {
        //   font: { bold: true, color: { rgb: "FFFFFF" } }, // White text
        //   fill: { fgColor: { rgb: "4F81BD" } }, // Blue background
        //   alignment: { horizontal: "center", vertical: "center" }, // Centered text
        //   border: {
        //     top: { style: "thin", color: { rgb: "000000" } },
        //     bottom: { style: "thin", color: { rgb: "000000" } },
        //     left: { style: "thin", color: { rgb: "000000" } },
        //     right: { style: "thin", color: { rgb: "000000" } },
        //   },
        // };

        // headers.forEach((_, colIndex) => {
        //   const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIndex });
        //   if (worksheet[cellRef]) {
        //     worksheet[cellRef].s = headerStyle;
        //   }
        // });

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Items-List");
        XLSX.writeFile(workbook, "Items-List.xlsx");
      } else {
        toast.error("Failed to download Items. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Error downloading file. Please try again.")
    } finally {
      setLoading(false);
    }
  };

  // upload api call
  const handleFileUpload = (file) => {
    if (file && file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setSelectedFile(file);
    } else {
      toast.error("Please upload a valid Excel file (.xlsx)");
      setSelectedFile(null);
    }
  };

  const formatFileSize = (size) => {
    return size < 1024 * 1024
      ? `${(size / 1024).toFixed(2)} KB`
      : `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an Excel file to upload.");
      return;
    }

    if (selectedFile.name !== "Items-List.xlsx") {
      toast.error("File name must be - Items-List.xlsx");
      return;
    }

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsUploading(true);

    try {
      const response = await axios.post(`${UPLOAD_EXCEL_API}/itemsList/uploadExcelFile`,
        formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.status === 200) {
        toast.success(response?.data || "File uploaded successfully.");
        setTimeout(() => {
          navigate("/admin/items");
        }, 500);
      } else {
        toast.error(response?.data || "Failed to upload file. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {loading ? (<PreLoader />
      ) : (
        <section className="item-container">
          <div className="item-header">
            <IoMdArrowRoundBack onClick={handleBack} />
            <h5>Add Item</h5>
          </div>

          <div className="item-form">
            <div className="file-container" onClick={triggerFileInput}>
              <div className="add-file" >
                {selectedFile ? (
                  <>
                    <RiFileExcel2Line className="uploaded-icon" />
                    <p className="file-name">
                      {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                  </>
                ) : (
                  <>
                    <FiUpload className="default-icon" />
                    <p className="file-label">
                      Click to upload Item List
                    </p>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  accept=".xlsx"
                  hidden />
              </div>
            </div>

            <div className="action-btn">
              <button className="upload-btn" onClick={handleUpload} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
              </button>
              <span className="download-btn" onClick={handleDownload} ><RiDownloadLine /></span>
            </div>
          </div>
        </section>
      )}

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  );
};

export default CreateItem;
