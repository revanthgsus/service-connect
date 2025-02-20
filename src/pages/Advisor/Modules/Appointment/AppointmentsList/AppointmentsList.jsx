import React, { useEffect, useState } from 'react';
import "./AppointmentsList.css";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { ReactComponent as Norecords } from "../../../../../assets/images/advisor/no-records.svg";
import PreLoader from './../../../../../common/PreLoader/PreLoader';
import RejectModal from '../../../../../common/RejectModal/RejectModal';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';

const AppointmentsList = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [totalAppointment, setTotalAppointment] = useState(0);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const itemsPerPage = 10;

  const tableHeadings = [
    { title: "S.No" },
    { title: "Cust ID" },
    { title: "Customer Name" },
    { title: "Urgency Level" },
    { title: "Appointment Date" },
    { title: "Location" },
    { title: "Status" },
    { title: "" },
  ];

  useEffect(() => {
    setAppointments([
      {
        id: 1,
        custID: "CUST_001",
        customerName: "John Doe",
        urgencyLevel: "Urgent",
        appointmentDate: "12/02/2025",
        location: "Chennai",
        status: "Accepted"
      },
      {
        id: 2,
        custID: "CUST_002",
        customerName: "John Doe",
        urgencyLevel: "Urgent",
        appointmentDate: "12/02/2025",
        location: "Mumbai",
        status: "Rejected",
        rejectReason: "The requested service is not available in your area at the moment. Please check back later or choose another service.",
      },
      {
        id: 3,
        custID: "CUST_003",
        customerName: "John Doe",
        urgencyLevel: "Urgent",
        appointmentDate: "12/02/2025",
        location: "Mumbai",
        status: "Scheduled"
      }
    ]);
    setTotalAppointment(5);
  }, []);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleView = (appointment) => {
    setIsLoading(false)
    if (appointment.status === "Rejected" && appointment.rejectReason) {
      setRejectReason(appointment.rejectReason);
      setShowRejectModal(true);
    } else {
      navigate("view");
    }
  };

  return (
    <>
      {isLoading ? (<PreLoader />
      ) : (
        <section className="appointment-list">
          <div className="top-alignment">
            <h5 className="appointment-heading">Appointments List</h5>
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
                    onChange={handleStatusChange}
                  >
                    <option value="">Status</option>
                    <option value="accepted">Accepted</option>
                    <option value="scheduled">Scheduled</option>
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
                    <tr className="no-data">
                      <td colSpan={tableHeadings.length}>
                        <Norecords />
                        <h5>No Appointments Found!</h5>
                        <p>Once records are added, they’ll appear on this page.</p>
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appointment, index) => (
                      <tr key={appointment.id} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{appointment.custID}</td>
                        <td>{appointment.customerName}</td>
                        <td>{appointment.urgencyLevel}</td>
                        <td>{appointment.appointmentDate}</td>
                        <td>{appointment.location}</td>
                        <td>
                          <span className={`status ${appointment.status.toLowerCase().replace(" ", "")}`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td>
                          <span className='view-icon' onClick={() => handleView(appointment)}>
                            <OpenInNewOutlinedIcon />
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
                count={Math.ceil(totalAppointment.length / itemsPerPage)}
                page={currentPage}
                onChange={(e, value) => setCurrentPage(value)}
              />
            </Stack>
          </div>
        </section>
      )}

      <RejectModal
        showRejectModal={showRejectModal}
        handleCloseReject={() => setShowRejectModal(false)} reason={rejectReason} />
    </>
  );
};

export default AppointmentsList;
