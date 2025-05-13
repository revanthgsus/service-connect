import React, { useEffect, useState, useCallback } from 'react';
import "./AppointmentList.css";
import { HiPlus } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { ReactComponent as Norecords } from "../../assets/images/comman/no-records.svg";
import { ReactComponent as EmptyImage } from "../../assets/images/comman/empty/appoint.svg";
import axios from 'axios';
import API_BASE_URL from '../../services/AuthService';
import PreLoader from '../../common/PreLoader/PreLoader';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

const AppointmentList = ({ userId, apiUrl, tableHeadings, filters, showCreateButton, renderRow }) => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalAppointment, setTotalAppointment] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const fetchAppointments = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      setIsLoading(false);
      return;
    }

    const userRole = sessionStorage.getItem("userRole");
    let userIdentifier = {};
    if (userRole === "Customer") {
      userIdentifier = { customerId: userId };
    } else if (userRole === "Advisor") {
      userIdentifier = { advisorId: userId };
    }

    const payload = {
      pageNo: currentPage,
      noOfDatas: itemsPerPage,
      ...userIdentifier,
      ...(status && { status }),
      ...(debouncedSearch && filters?.searchKey && { [filters.searchKey]: debouncedSearch }),
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/${apiUrl}`, payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200) {
        setAppointments(response?.data?.appointmentsListPage || [])
        setTotalAppointment(response?.data?.appointmentCount || 0);
      } else {
        toast.error("Unable to fetch appointment data. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred while fetch the data.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, status, debouncedSearch, userId, apiUrl, setShowTokenModal, filters]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);


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
        navigate("view", { state: { appointmentData: response?.data?.data } });
      } else {
        toast.error("Unable to retrieve appointment data. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred while fetch the data.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearchChange = (e) => setSearchInput(e.target.value);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPage(1);
  }
  const handleCreate = (e) => {
    e.preventDefault();
    navigate("request");
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Image for empty state & no records
  const noRecords = (debouncedSearch || status) && appointments.length === 0;
  const emptyState = !debouncedSearch && !status && appointments.length === 0;

  return (
    <>
      {isLoading && <PreLoader />}
      {!isLoading && (
        <section className="appointment-list">
          <div className="top-alignment">
            <h5 className="appointment-heading">Appointments</h5>

            {showCreateButton && (
              <button type="button" className="add-button" onClick={handleCreate}>
                <HiPlus />New Appointment
              </button>
            )}
          </div>

          <div className="table-list">
            <div className="list-top">
              <div className="search-wrapper">
                <input
                  type="search"
                  className="search-input"
                  placeholder={filters?.searchPlaceholder || "Search"}
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
                    {filters?.statusOptions?.map((options, index) => (
                      <option key={index} value={options}>{options}</option>
                    ))}
                  </select>
                  <IoIosArrowDown className="arrow-icon" />
                </div>
              </div>
            </div>

            <div className="list-alignment">
              <table className="appointment-table">
                <thead className="table-align">
                  <tr>
                    {Array.isArray(tableHeadings) &&
                      tableHeadings.map((heading, index) => (
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
                  ) : emptyState ? (
                    <tr className="empty-data">
                      <td colSpan={tableHeadings.length}>
                        <EmptyImage />
                        <p className='pt-3'>Start your first Appointment today!</p>
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appointment, index) =>
                      renderRow(appointment, index, currentPage, itemsPerPage, handleView)
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pagination-align">
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(totalAppointment / itemsPerPage)}
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

export default AppointmentList;
