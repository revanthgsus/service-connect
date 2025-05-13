import React, { useEffect, useState, useCallback } from 'react';
import "./ServiceHistory.css";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaRegEye } from "react-icons/fa6";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { ReactComponent as Norecords } from "../../../../../assets/images/comman/no-records.svg";
import PreLoader from './../../../../../common/PreLoader/PreLoader';
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../../../../contexts/AuthContext';

const ServiceHistory = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();

  const [history, setHistory] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalHistory, setTotalHistory] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const itemsPerPage = 10;

  const tableHeadings = [
    { title: "S.No" },
    { title: "Service ID" },
    { title: "Product Serial Number" },
    { title: "Invoice Date" },
    { title: "Paid Amount" },
    { title: "" },
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const fetchHistory = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    const userRole = sessionStorage.getItem("userRole");
    const userId = sessionStorage.getItem("userId");

    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const roleConfig = {
      Customer: {
        endpoint: `${API_BASE_URL}/customerMaster/getCustomerInvoicesListPage`,
        idKey: "customerId",
      },
      Advisor: {
        endpoint: `${API_BASE_URL}/advisorMaster/getAdvisorInvoicesListPage`,
        idKey: "advisorId",
      },
    };

    const config = roleConfig[userRole];

    const payload = {
      pageNo: currentPage,
      noOfDatas: itemsPerPage,
      [config.idKey]: userId,
      ...(debouncedSearch && { id: debouncedSearch }),
    };

    try {
      const response = await axios.post(config.endpoint, payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200) {
        setHistory(response?.data?.invoicesListPage || []);
        setTotalHistory(response?.data?.count || 0);
      } else {
        toast.error("Failed to fetch serice history. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred while fetch the data.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch, setShowTokenModal]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);


  // const handleView = async (history) => {
  //   document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });

  //   const token = sessionStorage.getItem("authToken");
  //   if (!token) {
  //     setShowTokenModal(true);
  //     return;
  //   }

  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/customerMaster/viewAppointmentById/${history.appointmentId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (response?.status === 200 && response?.data?.status === "success") {
  //       navigate("view", { state: { appointmentData: response?.data?.data } });
  //     } else {
  //       toast.error("Unable to retrieve appointment data. Please try again.");
  //     }
  //   } catch (error) {
  //     toast.error(error?.response?.data?.error || "An error occurred while fetch the data.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  const handleSearchChange = (e) => setSearchInput(e.target.value);

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    navigate(-1);
  }

  const handleView = (e) => {
    e.preventDefault();
    navigate("/customer/appointments/servicehistory")
  }

  return (
    <>
      {isLoading && <PreLoader />}
      {!isLoading && (
        <section className="history-list">
          <div className="top-alignment">
            <IoMdArrowRoundBack onClick={handleBack} />
            <h5>Service History</h5>
          </div>

          <div className="table-list">
            <div className="list-top">
              <div className="search-wrapper">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search by Service ID or serial number"
                  value={searchInput}
                  onChange={handleSearchChange}
                />
                <IoSearch className="search-icon" />
              </div>
            </div>

            <div className="list-alignment">
              <table className="history-table">
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
                  {history.length === 0 ? (
                    <tr className="no-data">
                      <td colSpan={tableHeadings.length}>
                        <Norecords />
                        <h5>No Records Found!</h5>
                        <p>Once records are added, they’ll appear on this page.</p>
                      </td>
                    </tr>
                  ) : (
                    history.map((history, index) => (
                      <tr key={history.serviceId} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{history.serviceId}</td>
                        <td>{history.emailAddress}</td>
                        <td>{history.dueDate}</td>
                        <td>{history.paidAmount ? `₹ ${history.paidAmount}` : "0"}</td>
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
                count={Math.ceil(totalHistory / itemsPerPage)}
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

export default ServiceHistory;
