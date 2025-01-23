import React, { useState } from 'react';
import "./AppointmentList.css";
import { HiPlus } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { FaRegEye } from "react-icons/fa6";
import { HiOutlineTrash } from "react-icons/hi";
import { ReactComponent as Norecords } from "../../../../../assets/images/customer/no-records.svg"
import DeleteModal from '../../../Common/DeleteModal/DeleteModal';
import PreLoader from './../../../../../common/PreLoader/PreLoader';

const AppointmentList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setShowModal = () => {
    setShow(true)
  }
  const handleCloseModal = () => {
    setShow(false);
  };

  const tableHeadings = [
    { title: "S.No" },
    { title: "Service Type" },
    { title: "Appointment Date" },
    { title: "Serial Number" },
    { title: "Urgency Level" },
    { title: "Status" },
    { title: "" },
  ];

  const Appointments = [
    {
      id: 1,
      serviceType: "Car Routine Maintenance",
      appointmentDate: "12/02/2025",
      serialNumber: "EX12345BAT2023",
      urgencyLevel: "Urgent",
      status: "Accepted",
    },
    {
      id: 2,
      serviceType: "Battery Testing",
      appointmentDate: "13/02/2025",
      serialNumber: "EX12345BAT2023",
      urgencyLevel: "Standard",
      status: "Accepted",
    },
    {
      id: 3,
      serviceType: "Oil and filter change",
      appointmentDate: "14/02/2025",
      serialNumber: "EX12345BAT2023",
      urgencyLevel: "Urgent",
      status: "Pending",
    },
    {
      id: 4,
      serviceType: "Tire replacement",
      appointmentDate: "14/02/2025",
      serialNumber: "EX12345BAT2023",
      urgencyLevel: "Urgent",
      status: "Rejected",
    },
    {
      id: 5,
      serviceType: "Car Routine Maintenance",
      appointmentDate: "16/02/2025",
      serialNumber: "EX12345BAT2023",
      urgencyLevel: "Urgent",
      status: "Accepted",
    },
  ];

  const handleCreate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false)
      navigate("requestappointment");
    }, 1000)
  };

  const filteredServiceTypes = Appointments.filter((appointment) => {
    const matchesSearch =
      appointment.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === '' || appointment.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const displayedAppointments = filteredServiceTypes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleView = (e) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false)
      navigate("/");
    }, 1000)
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
                  value={searchTerm}
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
                    value={statusFilter}
                    onChange={handleStatusChange}
                  >
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
                  {displayedAppointments.length === 0 ? (
                    <tr className="no-data">
                      <td colSpan={tableHeadings.length}>
                        <Norecords />
                        <h5>No Service Type Found!</h5>
                        <p>Once records are added, they’ll appear on this page.</p>
                      </td>
                    </tr>
                  ) : (
                    displayedAppointments.map((appointment, index) => (
                      <tr key={appointment.id} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{appointment.serviceType}</td>
                        <td>{appointment.appointmentDate}</td>
                        <td>{appointment.serialNumber}</td>
                        <td>{appointment.urgencyLevel}</td>
                        <td>
                          <span className={`status ${appointment.status.toLowerCase().replace(" ", "")}`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td>
                          <span className='view-icon' onClick={() => handleView}>
                            <FaRegEye />
                          </span>

                          <span className='delete-icon' onClick={setShowModal}>
                            <HiOutlineTrash />
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
                count={Math.ceil(filteredServiceTypes.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
              />
            </Stack>
          </div>
        </section>
      )}

      <DeleteModal show={show} handleClose={handleCloseModal} />
    </>
  );
};

export default AppointmentList;
