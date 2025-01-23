import React, { useState } from 'react';
import "./AdvisorList.css";
import { HiPlus } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { MdModeEditOutline } from "react-icons/md";
import { HiOutlineTrash } from "react-icons/hi";
import { ReactComponent as Norecords } from "../../../../../assets/images/admin/advisor/no-records.svg";
import DeleteModal from '../../../Common/DeleteModal/DeleteModal';
import PreLoader from './../../../../../common/PreLoader/PreLoader';

const AdvisorList = () => {
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
    { title: "Advisor ID" },
    { title: "Advisor Name" },
    { title: "Mail ID" },
    { title: "Mobile Number" },
    { title: "Joining Date" },
    { title: "Status" },
    { title: "" },
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
      status: "In Active",
    },
  ];

  const handleCreate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false)
      navigate("createadvisor");
    }, 1000)
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
    setStatusFilter(e.target.value);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const displayedAdvisors = filteredAdvisors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (advisor) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false)
      navigate("editadvisor", { state: { advisorData: advisor } });
    }, 1000)
  };

  return (
    <>
      {isLoading && <PreLoader />}
      {!isLoading && (
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
                <div className="select-container">
                  <select
                    name="status"
                    id="status-select"
                    className="status-select"
                    value={statusFilter}
                    onChange={handleStatusChange}
                  >
                    <option value="">Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">In Active</option>
                  </select>
                  <IoIosArrowDown className="arrow-icon" />
                </div>
              </div>
            </div>

            <div className="list-alignment">
              <table className="advisor-table">
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
                  {displayedAdvisors.length === 0 ? (
                    <tr className="no-data">
                      <td colSpan={tableHeadings.length}>
                        <Norecords />
                        <h5>No Advisors Found!</h5>
                        <p>Once records are added, they’ll appear on this page.</p>
                      </td>
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
                        <td>
                          <span className={`status ${advisor.status.toLowerCase().replace(" ", "")}`}>
                            {advisor.status}
                          </span>
                        </td>
                        <td>
                          <span className='edit-icon' onClick={() => handleEdit(advisor)}>
                            <MdModeEditOutline />
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
                count={Math.ceil(filteredAdvisors.length / itemsPerPage)}
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

export default AdvisorList;
