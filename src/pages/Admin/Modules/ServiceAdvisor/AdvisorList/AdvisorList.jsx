import React, { useState } from 'react';
import "../AdvisorList/AdvisorList.css";
import { HiPlus } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { MdModeEditOutline } from "react-icons/md";
import { HiOutlineTrash } from "react-icons/hi";

const AdvisorList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const tableHeadings = [
    "S.No",
    "Advisor ID",
    "Advisor Name",
    "Mail ID",
    "Mobile Number",
    "Location",
    "Status",
    "Actions",
  ];

  const advisors = [
    {
      id: 1,
      advisorID: "SA_00001",
      advisorName: "Ganeshram",
      mailID: "ganeshram@gmail.com",
      mobileNumber: "9876543210",
      location: "Rajapalayam",
      status: "Active",
    },
    {
      id: 2,
      advisorID: "SA_00002",
      advisorName: "Dhanasekar",
      mailID: "dhanasekar@gmail.com",
      mobileNumber: "9876543210",
      location: "Rajapalayam",
      status: "Inactive",
    },
  ];

  const handleCreate = () => {
    navigate("createadvisor");
  };

  const filteredAdvisors = advisors.filter((advisor) => {
    const matchesSearch =
      advisor.advisorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advisor.advisorID.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === '' || advisor.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value.toLowerCase());
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const displayedAdvisors = filteredAdvisors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (advisor) => {
    navigate("editmanager", { state: { managerData: advisor } });
  };

  return (
    <section className="advisor-list">
      <div className="top-alignment">
        <h5 className="advisor-heading">Service Advisor List</h5>
        <button type="button" className="add-button" onClick={handleCreate}>
          <HiPlus />
          Add Service Advisor
        </button>
      </div>

      <div className="table-list">
        <div className="list-top">
          <div className="search-wrapper">
            <input
              type="search"
              className="search-input"
              placeholder="Search by Advisor Name or ID"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <IoSearch className="search-icon" />
          </div>
          <div className="status-wrapper">
            <select
              name="status"
              id="status-select"
              className="status-select"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="">Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <IoIosArrowDown className="arrow-icon" />
          </div>
        </div>

        <div className="list-alignment">
          <table className="advisor-table">
            <thead className="table-align">
              <tr>
                {tableHeadings.map((heading, index) => (
                  <th key={index} className="table-heading">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayedAdvisors.length === 0 ? (
                <tr className="no-data">
                  <td colSpan={tableHeadings.length}>No Advisors Found</td>
                </tr>
              ) : (
                displayedAdvisors.map((advisor, index) => (
                  <tr key={advisor.id} className="list-item">
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{advisor.advisorID}</td>
                    <td>{advisor.advisorName}</td>
                    <td>{advisor.mailID}</td>
                    <td>{advisor.mobileNumber}</td>
                    <td>{advisor.location}</td>
                    <td>{advisor.status}</td>
                    <td>
                      <span
                        className="edit-icon"
                        onClick={() => handleEdit(advisor)}
                      >
                        <MdModeEditOutline />
                      </span>
                      <span className="delete-icon">
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
            count={Math.ceil(filteredAdvisors.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      </div>
    </section>
  );
};

export default AdvisorList;
