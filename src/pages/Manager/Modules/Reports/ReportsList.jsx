import React, { useEffect, useState, useCallback } from 'react';
import "./ReportsList.css";
import { IoSearch } from "react-icons/io5";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { ReactComponent as Norecords } from "../../../../assets/images/comman/no-records.svg";
import { ReactComponent as EmptyImage } from "../../../../assets/images/comman/empty/activity.svg";
import PreLoader from './../../../../common/PreLoader/PreLoader';
import axios from 'axios';
import API_BASE_URL from '../../../../services/AuthService';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../../../contexts/AuthContext';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from 'dayjs';
import { ImDownload } from "react-icons/im";
import * as XLSX from "xlsx";

const ReportsList = () => {
  const { setShowTokenModal } = useAuth();
  const [reports, setReports] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [dateRange, setDateRange] = useState([null]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalReports, setTotalReports] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const itemsPerPage = 10;

  const companyName = sessionStorage.getItem("companyName");
  const companyLocation = sessionStorage.getItem("companyLocation");

  const tableHeadings = [
    { title: "S.No" },
    { title: "Service ID" },
    { title: "Advisor Name" },
    { title: "Customer Name" },
    { title: "Appointment Date" },
    { title: "Paid Status" },
    { title: "Total Amount" },
    { title: "Due Amount" },
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const fetchServices = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const [startDate, endDate] = dateRange;
    const payload = {
      pageNo: currentPage,
      noOfDatas: itemsPerPage,
      companyName,
      companyLocation,
      ...(startDate && endDate && {
        fromDate: dayjs(startDate).format('YYYY-MM-DD'),
        toDate: dayjs(endDate).format('YYYY-MM-DD'),
      }),
      ...(debouncedSearch && { serviceId: debouncedSearch }),
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/managerMaster/getReportsListPage`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200) {
        setReports(response?.data?.reportsListPage || []);
        setTotalReports(response?.data?.count || 0);
      } else {
        toast.error("Failed to fetch services data. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred while saving the data.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, dateRange, debouncedSearch, setShowTokenModal, companyName, companyLocation]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

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
          item.labourTax || "",
          item.unitOfMeasurement || "N/A",
          item.quantity || "0",
          item.minimumStockAlert || "0",
          item.warrantyPeriod || "N/A",
          item.companyName || "N/A",
        ]);

        const worksheetData = [headers, ...formattedData];
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        const headerStyle = {
          font: { bold: true, color: { rgb: "FFFFFF" } }, // White text
          fill: { fgColor: { rgb: "4F81BD" } }, // Blue background
          alignment: { horizontal: "center", vertical: "center" }, // Centered text
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };

        headers.forEach((_, colIndex) => {
          const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIndex });
          if (worksheet[cellRef]) {
            worksheet[cellRef].s = headerStyle;
          }
        });

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Reports-List");
        XLSX.writeFile(workbook, "Reports-List.xlsx");
      } else {
        toast.error("Failed to download Items. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Error downloading file. Please try again.")
    } finally {
      setIsLoading(false);
      setDateRange(false);


      // dummy setrange
    }
  };


  const handleSearchChange = (e) => setSearchInput(e.target.value);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Image for empty state & no records
  const noRecords = (debouncedSearch || (dateRange[0] && dateRange[1])) && reports.length === 0;
  const emptyState = !debouncedSearch && !dateRange[0] && !dateRange[1] && reports.length === 0;

  return (
    <>
      {isLoading ? (<PreLoader />
      ) : (
        <section className="reports-list">
          <div className="top-alignment">
            <h5 className="reports-heading">Reports List</h5>
            <button type="button" className="download-button" onClick={handleDownload}>
              <ImDownload />Download
            </button>
          </div>

          <div className="table-list">
            <div className="list-top">
              <div className="search-wrapper">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search by Service ID"
                  value={searchInput}
                  onChange={handleSearchChange} />
                <IoSearch className="search-icon" />
              </div>

              <div className="status-wrapper">
                <div className="select-container">
                  {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker className='status-select' value={dateRange}
                      onChange={(newValue) => {
                        setDateRange(newValue);
                        setCurrentPage(1);
                      }} />
                  </LocalizationProvider> */}
                </div>
              </div>
            </div>

            <div className="list-alignment">
              <table className="reports-table">
                <thead className="table-align">
                  <tr>
                    {tableHeadings.map((heading, index) => (
                      <th key={index} className="table-heading">
                        {heading.title}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {noRecords ? (
                    <tr className="no-data">
                      <td colSpan={tableHeadings.length}>
                        <Norecords />
                        <h5>No Service ID Found!</h5>
                        <p>Once records are added, they’ll appear on this page.</p>
                      </td>
                    </tr>
                  ) : emptyState ? (
                    <tr className="empty-data">
                      <td colSpan={tableHeadings.length}>
                        <EmptyImage />
                        <p className='pt-3'>Start your first service today!</p>
                      </td>
                    </tr>
                  ) : (
                    reports.map((report, index) => (
                      <tr key={report.id} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{report.serviceId}</td>
                        <td>{report.advisorName}</td>
                        <td>{report.customerName}</td>
                        <td>{report.appointmentDate}</td>
                        <td>
                          <span
                            className={`status ${report.paidStatus.toLowerCase() === "paid" ? "paid"
                              : report.paidStatus.toLowerCase() === "partial paid" ? "partialpaid"
                                : "unpaid"}`}>
                            {report.paidStatus.charAt(0).toUpperCase() + report.paidStatus.slice(1)}
                          </span>
                        </td>
                        <td>{report.totalAmount}</td>
                        <td>{report.dueAmount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pagination-align">
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(totalReports / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "var(--text-color)",
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#01848D !important",
                    color: "#ffffff",
                  },
                  "& .Mui-selected:hover": {
                    backgroundColor: "#028d96 !important",
                  },
                }} />
            </Stack>
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

export default ReportsList;
