import React, { useEffect, useState, useCallback } from 'react';
import "./EscalateList.css";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { ReactComponent as Norecords } from "../../../../../assets/images/comman/no-records.svg";
import PreLoader from '../../../../../common/PreLoader/PreLoader';
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService.js';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../../../../contexts/AuthContext';
import { IoMdArrowRoundBack } from 'react-icons/io';

const EscalateList = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const [escalate, setEscalate] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  // const [totalEscalate, setTotalEscalate] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const itemsPerPage = 10;

  const companyName = sessionStorage.getItem("companyName");
  const companyLocation = sessionStorage.getItem("companyLocation");

  const tableHeadings = [
    { title: "S.No" },
    { title: "Advisor ID" },
    { title: "Customer Name" },
    { title: "Advisor Name" },
    { title: "Priority Level" },
    { title: "Requested Date" },
    { title: "" },
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const fetchEscalate = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const payload = {
      companyName,
      companyLocation,
      ...(debouncedSearch && { input: debouncedSearch }),
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/managerMaster/getEscalateServiceListPage`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200) {
        setEscalate(response?.data?.escalateServiceListPage || []);
        // setTotalEscalate(response?.data?.escalateServiceListPage?.length || 0);
      } else {
        toast.error("Failed to fetch Escalate data. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred while fetch the data.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, setShowTokenModal, companyName, companyLocation]);

  useEffect(() => {
    fetchEscalate();
  }, [fetchEscalate]);


  const handleView = async (appointment) => {
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/customerMaster/viewAppointmentById/${appointment.appointmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.status === 200 && response?.data?.status === "success") {
        navigate("/manager/dashboard/viewescalate",
          { state: { appointmentData: response?.data?.data } });
      } else {
        toast.error("Unable to retrieve appointment data. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred while fetch the data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => setSearchInput(e.target.value);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = (e) => {
    e.preventDefault()
    navigate(-1);
  }

  // Image for no records
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = escalate.slice(startIndex, startIndex + itemsPerPage);
  const noRecords = debouncedSearch && escalate.length === 0;

  return (
    <>
      {isLoading ? <PreLoader /> : (
        <section className="escalate-list">
          <div className="header">
            <IoMdArrowRoundBack onClick={handleBack} />
            <h5>Escalate Service</h5>
          </div>

          <div className="table-list">
            <div className="search-wrapper">
              <input
                type="search"
                className="search-input"
                placeholder="Search by advisor name or ID"
                value={searchInput}
                onChange={handleSearchChange} />
              <IoSearch className="search-icon" />
            </div>

            <div className="list-alignment">
              <table className="escalate-table">
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
                        <h5>No Records Found!</h5>
                        <p>Once records are added, they’ll appear on this page.</p>
                      </td>
                    </tr>
                  ) : (
                    currentData.map((escalate, index) => (
                      <tr key={escalate.id} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{escalate.appointment.advisorId}</td>
                        <td>{escalate.appointment.customerName}</td>
                        <td>{escalate.appointment.advisorName}</td>
                        <td>{escalate.appointment.priorityLevel}</td>
                        <td>{escalate.appointment.appointmentDate}</td>
                        <td>
                          <span className='details-icon'
                            onClick={() => handleView(escalate.appointment)}>
                            <OpenInNewOutlinedIcon />
                          </span>
                        </td>
                      </tr>
                    ))
                  )
                  }
                </tbody>
              </table>
            </div>
          </div >

          <div className="pagination-align">
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(escalate.length / itemsPerPage)}
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
        </section >
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

export default EscalateList;
