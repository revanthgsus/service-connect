import React, { useState } from 'react';
import "../ManagerList/ManagerList.css";
import { HiPlus } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";

const ManagerList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const tableHeadings = [
    { segment: "SNo", title: "S.No" },
    { segment: "ManagerID", title: "Manager ID" },
    { segment: "ManagerName", title: "Manager Name" },
    { segment: "MailID", title: "Mail ID" },
    { segment: "MobileNumber", title: "Mobile Number" },
    { segment: "Location", title: "Location" },
    { segment: "Status", title: "Status" },
    { segment: "Status", title: "Status" },
  ];

  const managers = [
    {
      id: 1,
      managerID: "SM_00001",
      managerName: "Surya",
      mailID: "Surya@gmail.com",
      mobileNumber: "9876543210",
      location: "Rajapalayam",
      status: "Active",
    },
    {
      id: 2,
      managerID: "SM_00002",
      managerName: "Mari",
      mailID: "mari@gmail.com",
      mobileNumber: "9876543210",
      location: "Rajapalayam",
      status: "Inactive",
    },
  ];

  const handleCreate = (e) => {
    e.preventDefault();
    navigate("/admin/service-manager/createmanager");
  };

  const filteredManagers = managers.filter((manager) => {
    const matchesSearch =
      manager.managerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.managerID.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === '' || manager.status.toLowerCase() === statusFilter;
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
      <section className="manager-list">
        <div className='top-alignment'>
          <h5 className="manager-heading">Service Manager List</h5>
          <button type='submit' className='add-button' onClick={handleCreate}>
            <HiPlus />
            Add Service Manager</button>
        </div>

        <div className="list-alignment">
          <div className='list-top'>
            <div className='search-wrapper'>
              <input type="search"
                className='search-input'
                placeholder='Search by Manager Name or ID'
                name='search'
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

          <table className="manager-table">
            <thead className='table-align'>
              <tr>
                {tableHeadings.map((heading, index) => (
                  <th key={index} className="table-heading">
                    {heading.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredManagers.length === 0 ? (
                <tr className='no-data'>
                  <td colSpan={7}>
                    No Managers Found
                  </td>
                </tr>
              ) : (
                filteredManagers.map((manager, index) => (
                  <tr key={manager.id} className="list-item">
                    <td>{index + 1}</td>
                    <td>{manager.managerID}</td>
                    <td>{manager.managerName}</td>
                    <td>{manager.mailID}</td>
                    <td>{manager.mobileNumber}</td>
                    <td>{manager.location}</td>
                    <td>{manager.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default ManagerList;
