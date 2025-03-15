import React, { useEffect, useState, useCallback } from 'react';
import "./QuoteList.css";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { FaRegEye } from "react-icons/fa6";
import { ReactComponent as Norecords } from "../../../../../assets/images/customer/no-records.svg";
import { ReactComponent as EmptyImage } from "../../../../../assets/images/customer/empty/quote.svg";
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';
import PreLoader from './../../../../../common/PreLoader/PreLoader';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../../../../contexts/AuthContext';

const QuoteList = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const customerId = sessionStorage.getItem("userId");

  const itemsPerPage = 10;

  const tableHeadings = [
    { title: "S.No" },
    { title: "Service ID" },
    { title: "Service Type" },
    { title: "Appointment Date" },
    { title: "Priority Level" },
    { title: "Status" },
    { title: "" },
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);


  const fetchQuotes = useCallback(async () => {

    const token = sessionStorage.getItem("authToken");
    // if (!token) {
    //   setShowTokenModal(true);
    //   return;
    // }

    const payload = {
      pageNo: currentPage,
      noOfDatas: itemsPerPage,
      customerId,
      ...(status && { status }),
      ...(debouncedSearch && { input: debouncedSearch }),
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/customerMaster/getAppointmentsListPage`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);

      if (response?.status === 200 && response.status === "success") {
        setQuotes(response?.data?.customerQuotesListPage || []);
        setTotalQuotes(response?.data?.count || 0);
      } else {
        toast.error(response?.data?.error || "Failed to fetch quotes data. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred while saving the data.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, status, debouncedSearch, customerId]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  useEffect(() => {
    setQuotes([
      { id: 1, serviceId: "SR-12345", serviceType: "Car Routine Maintenance", appointmentDate: "12/02/2025", urgencyLevel: "Urgent", status: "Accepted", },
      {
        id: 2, serviceId: "SR-12346", serviceType: "Battery Testing", appointmentDate: "13/02/2025", urgencyLevel: "Standard", status: "Accepted",
      },
      {
        id: 3, serviceId: "SR-12347", serviceType: "Oil and filter change", appointmentDate: "14/02/2025",
        urgencyLevel: "Urgent", status: "In Progress",
      },
    ]);

    setTotalQuotes(3);
  }, []);

  const handleView = async (appointmentId) => {
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/advisorMaster/viewComplaintsByAppointmentId/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.status === 200) {
        navigate("quotesummary", { state: { complaintData: response.data } });
      } else {
        toast.error("Failed to fetch quotes data. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred while fetch the data.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearchChange = (e) => setSearchInput(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {isLoading && <PreLoader />}
      {!isLoading && (
        <section className="quote-list">
          <h5 className="quote-heading">Quotes</h5>

          <div className="table-list">
            <div className="list-top">
              <div className="search-wrapper">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search by Service ID"
                  value={searchInput}
                  onChange={handleSearchChange}
                />
                <IoSearch className="search-icon" />
              </div>

              <div className="status-wrapper">
                <div className="select-container">
                  <select
                    name="status"
                    id="status-select"
                    className="status-select"
                    value={status}
                    onChange={handleStatusChange}>
                    <option value="">Status</option>
                    <option value="accepted">Accepted</option>
                    <option value="inprogress">In Progress</option>
                  </select>
                  <IoIosArrowDown className="arrow-icon" />
                </div>
              </div>
            </div>

            <div className="list-alignment">
              <table className="quote-table">
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
                  {quotes.length === 0 ? (
                    totalQuotes === 0 ? (
                      <tr className="empty-data">
                        <td colSpan={tableHeadings.length}>
                          <EmptyImage />
                          <p className='pt-3'>Start your first Quotes today!</p>
                        </td>
                      </tr>
                    ) : (
                      <tr className="no-data">
                        <td colSpan={tableHeadings.length}>
                          <Norecords />
                          <h5>No Service ID Found!</h5>
                          <p>Once records are added, they’ll appear on this page.</p>
                        </td>
                      </tr>
                    )
                  ) : (
                    quotes.map((quotes, index) => (
                      <tr key={quotes.id} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{quotes.serviceId}</td>
                        <td>{quotes.serviceType}</td>
                        <td>{quotes.appointmentDate}</td>
                        <td>{quotes.urgencyLevel}</td>
                        <td>
                          <span className={`status ${quotes.status.toLowerCase() === 'accepted' ? 'accepted' : 'inprogress'}`}>
                            {quotes.status}
                          </span>
                        </td>
                        <td>
                          <span className='view-icon' onClick={handleView}>
                            <FaRegEye />
                          </span>
                        </td>
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
                count={Math.ceil(totalQuotes / itemsPerPage)}
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
                }}
              />
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

export default QuoteList;
