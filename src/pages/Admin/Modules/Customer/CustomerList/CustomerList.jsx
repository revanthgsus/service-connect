import React, { useState } from 'react';
import "../CustomerList/CustomerList.css";
import { HiPlus } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";

const CustomerList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const tableHeadings = [
    { segment: "SNo", title: "S.No" },
    { segment: "CustomerID", title: "Customer ID" },
    { segment: "CustomerName", title: "Customer Name" },
    { segment: "MailID", title: "Mail ID" },
    { segment: "MobileNumber", title: "Mobile Number" },
    { segment: "Location", title: "Location" },
    { segment: "Status", title: "Status" },
    { segment: "Status", title: "Status" },
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
    navigate("/admin/customer/createcustomer");
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
  return (
    <section className="customer-list">
      <div className='top-alignment'>
        <h5 className="customer-heading">Customer List</h5>
        <button type='submit' className='add-button' onClick={handleCreate}><HiPlus />
          Add Customer</button>
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

        <table className="customer-table">
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
            {filteredCustomers.length === 0 ? (
              <tr className='no-data'>
                <td colSpan={7}>
                  No Managers Found
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer, index) => (
                <tr key={customer.id} className="list-item">
                  <td>{index + 1}</td>
                  <td>{customer.customerID}</td>
                  <td>{customer.customerName}</td>
                  <td>{customer.mailID}</td>
                  <td>{customer.mobileNumber}</td>
                  <td>{customer.location}</td>
                  <td>{customer.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default CustomerList