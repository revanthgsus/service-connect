import React, { useEffect, useState, useCallback } from 'react';
import "./AppointmentList.css";
import { HiPlus } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { FaRegEye } from "react-icons/fa6";
import { ReactComponent as Norecords } from "../../../../../assets/images/customer/no-records.svg";
import { ReactComponent as EmptyImage } from "../../../../../assets/images/customer/empty/appoint.svg";
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';
import PreLoader from './../../../../../common/PreLoader/PreLoader';
import RejectModal from '../../../../../common/RejectModal/RejectModal';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../../../../contexts/AuthContext';

const AppointmentList = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalAppointment, setTotalAppointment] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const customerId = sessionStorage.getItem("userId");

  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const itemsPerPage = 10;

  const tableHeadings = [
    { title: "S.No" },
    { title: "Service Type" },
    { title: "Appointment Date" },
    { title: "Serial Number" },
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

  const fetchAppointments = useCallback(async () => {

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
        setAppointments(response?.data?.customerAppointmentListPage || []);
        setTotalAppointment(response?.data?.count || 0);
      } else {
        toast.error(response?.data?.error || "Failed to fetch appointment data. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred while saving the data.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, status, debouncedSearch, customerId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    setAppointments([
      {
        id: 1, serviceType: "Tire replacement", appointmentDate: "14/02/2025", productSerialNo: "EX12345BAT2023", urgencyLevel: "Urgent", status: "Rejected",
        rejectReason: "The requested service is not available in your area at the moment. Please check back later or choose another service.",
      },
      { id: 2, serviceType: "Battery Testing", appointmentDate: "13/02/2025", productSerialNo: "EX12345BAT2023", urgencyLevel: "Standard", status: "Accepted" },
      { id: 3, serviceType: "Oil and filter change", appointmentDate: "14/02/2025", productSerialNo: "EX12345BAT2023", urgencyLevel: "Urgent", status: "Pending" },
      { id: 4, serviceType: "Car Routine Maintenance", appointmentDate: "12/02/2025", productSerialNo: "EX12345BAT2023", urgencyLevel: "Urgent", status: "Accepted" },

    ]);
    setTotalAppointment(4);
  }, []);

  const handleView = async (appointment) => {
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });

    if (appointment.status === "Rejected" && appointment.rejectReason) {
      setRejectReason(appointment.rejectReason);
      setShowRejectModal(true);
      return;
    }

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/customerMaster/viewAppointmentById/${appointment.Id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.status === 200) {
        navigate("view", { state: { appointmentData: response.data } });
      } else {
        toast.error("Failed to fetch appointment data. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred while fetch the data.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearchChange = (e) => setSearchInput(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);

  const handleCreate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      navigate("request");
    }, 300)
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {isLoading && <PreLoader />}
      {!isLoading && (
        <section className="appointment-list">
          <div className="top-alignment">
            <h5 className="appointment-heading">Appointments</h5>
            <button type="button" className="add-button" onClick={handleCreate}>
              <HiPlus />New Appointment
            </button>
          </div>

          <div className="table-list">
            <div className="list-top">
              <div className="search-wrapper">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search by Service type"
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
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <IoIosArrowDown className="arrow-icon" />
                </div>
              </div>
            </div>

            <div className="list-alignment">
              <table className="appointment-table">
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
                  {appointments.length === 0 ? (
                    totalAppointment === 0 ? (
                      <tr className="empty-data">
                        <td colSpan={tableHeadings.length}>
                          <EmptyImage />
                          <p className='pt-3'>Start your first Appointment today!</p>
                        </td>
                      </tr>
                    ) : (
                      <tr className="no-data">
                        <td colSpan={tableHeadings.length}>
                          <Norecords />
                          <h5>No Service Type Found!</h5>
                          <p>Once records are added, they’ll appear on this page.</p>
                        </td>
                      </tr>
                    )
                  ) : (
                    appointments.map((appointment, index) => (
                      <tr key={appointment.appointmentId} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{appointment.serviceType}</td>
                        <td>{appointment.appointmentDate}</td>
                        <td>{appointment.productSerialNo}</td>
                        <td>{appointment.urgencyLevel}</td>
                        <td>
                          <span
                            className={`status ${appointment.status.toLowerCase() === "accepted"
                              ? "accepted"
                              : appointment.status.toLowerCase() === "rejected"
                                ? "rejected" : "pending"}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <span className='view-icon' onClick={() => handleView(appointment)}>
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

      <RejectModal
        showRejectModal={showRejectModal}
        handleCloseReject={() => setShowRejectModal(false)} reason={rejectReason} />
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
