import React, { useState } from 'react';
import "../CustomerList/CustomerList.css";
import { HiPlus } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { MdModeEditOutline } from "react-icons/md";
import { HiOutlineTrash } from "react-icons/hi";

const CustomerList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const tableHeadings = [
    { title: "S.No" },
    { title: "Customer ID" },
    { title: "Customer Name" },
    { title: "Mail ID" },
    { title: "Mobile Number" },
    { title: "Location" },
    { title: "Status" },
    { title: "Status" },
  ];

  const customers = [
    {
      id: 1,
      customerID: "CUST_00001",
      customerName: "Revanth",
      mailID: "revanth@gmail.com",
      mobileNumber: "9876543210",
      location: "Tenkasi",
      status: "Active",
    },
    {
      id: 2,
      customerID: "CUST_00002",
      customerName: "Mahadevan",
      mailID: "maha@gmail.com",
      mobileNumber: "9876543210",
      location: "Rajapalayam",
      status: "Inactive",
    },
  ];


  const handleCreate = (e) => {
    e.preventDefault();
    navigate("createcustomer");
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerID.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === '' || customer.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  }

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  }

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const displayedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (customer) => {
    navigate("editcustomer", { state: { managerData: customer } });
  };

  return (
    <section className="customer-list">
      <div className='top-alignment'>
        <h5 className="customer-heading">Customer List</h5>
        <button type='submit' className='add-button' onClick={handleCreate}><HiPlus />
          Add Customer</button>
      </div>

      <div className="table-list">
        <div className="list-top">
          <div className="search-wrapper">
            <input
              type="search"
              className="search-input"
              placeholder="Search by Manager Name or ID"
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
          <table className="manager-table">
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
              {displayedCustomers.length === 0 ? (
                <tr className="no-data">
                  <td colSpan={tableHeadings.length}>No Managers Found</td>
                </tr>
              ) : (
                displayedCustomers.map((manager, index) => (
                  <tr key={manager.id} className="list-item">
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{manager.customerID}</td>
                    <td>{manager.customerName}</td>
                    <td>{manager.mailID}</td>
                    <td>{manager.mobileNumber}</td>
                    <td>{manager.location}</td>
                    <td>{manager.status}</td>
                    <td>
                      <span className='edit-icon' onClick={() => handleEdit(manager)}>
                        <MdModeEditOutline />
                      </span>

                      <span className='delete-icon'>
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
            count={Math.ceil(filteredCustomers.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      </div>
    </section>
  )
}

export default CustomerList