import React, { useState } from 'react';
import "../AdvisorList/AdvisorList.css";
import { HiPlus } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";

const AdvisorList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const tableHeadings = [
    { segment: "SNo", title: "S.No" },
    { segment: "AdvisorID", title: "Advisor ID" },
    { segment: "AdvisorName", title: "Advisor Name" },
    { segment: "MailID", title: "Mail ID" },
    { segment: "MobileNumber", title: "Mobile Number" },
    { segment: "Location", title: "Location" },
    { segment: "Status", title: "Status" },
    { segment: "Status", title: "Status" },
  ];

  const Advisors = [
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

  const handleCreate = (e) => {
    e.preventDefault();
    navigate("/admin/service-advisor/createadvisor");
  };

  const filteredAdvisors = Advisors.filter((advisor) => {
    const matchesSearch =
      advisor.advisorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advisor.advisorID.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === '' || advisor.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  }

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  }

  return (
    <>
      <section className="advisor-list">
        <div className="top-alignment">
          <h5 className="advisor-heading">Service Advisor List</h5>
          <button type="button" className="add-button" onClick={handleCreate}>
            <HiPlus />
            Add Service Advisor
          </button>
        </div>

        <div className="list-alignment">
          <div className='list-top'>
            <div className='search-wrapper'>
              <input type="search"
                className="search-input"
                placeholder="Search by Advisor Name or ID"
                name="search"
                value={searchTerm}
                onChange={handleSearchChange} />
              <IoSearch className='search-icon' />
            </div>
            <div className="status-wrapper">
              <select name="status" id="status-select" className="status-select" value={statusFilter}
                onChange={handleStatusChange}>
                <option value="" selected >Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <IoIosArrowDown className="arrow-icon" />
            </div>
          </div>

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
              {filteredAdvisors.length === 0 ? (
                <tr className='no-data'>
                  <td colSpan={7}>
                    No Advisors Found
                  </td>
                </tr>
              ) : (
                filteredAdvisors.map((advisor, index) => (
                  <tr key={advisor.id} className="list-item">
                    <td>{index + 1}</td>
                    <td>{advisor.advisorID}</td>
                    <td>{advisor.advisorName}</td>
                    <td>{advisor.mailID}</td>
                    <td>{advisor.mobileNumber}</td>
                    <td>{advisor.location}</td>
                    <td>{advisor.status}</td>
                  </tr>
                )))
              }
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default AdvisorList;
