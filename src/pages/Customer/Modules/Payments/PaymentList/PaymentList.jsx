import React, { useState } from 'react';
import "./PaymentList.css";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { FaRegEye } from "react-icons/fa6";
import { ReactComponent as Norecords } from "../../../../../assets/images/customer/no-records.svg"
import PreLoader from './../../../../../common/PreLoader/PreLoader';

const PaymentList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isLoading, setIsLoading] = useState(false);

  const tableHeadings = [
    { title: "S.No" },
    { title: "Invoice ID" },
    { title: "Billing Name" },
    { title: "Service Type" },
    { title: "Due Date" },
    { title: "Status" },
    { title: "Total Amount" },
    { title: "Due Amount" },
    { title: "" },
  ];

  const PaymentData = [
    {
      id: 1,
      invoiceID: "INV-00001",
      billingName: "Revanth",
      serviceType: "Car Routine Maintenance",
      dueDate: "12/02/2025",
      status: "Paid",
      totalAmount: "₹5000",
      dueAmount: "₹500",
    },
    {
      id: 2,
      invoiceID: "INV-00002",
      billingName: "Priya",
      serviceType: "Car Routine Maintenance",
      dueDate: "15/02/2025",
      status: "Un Paid",
      totalAmount: "₹50000",
      dueAmount: "₹500",
    },
    {
      id: 3,
      invoiceID: "INV-00003",
      billingName: "Bowyaa",
      serviceType: "Car Routine Maintenance",
      dueDate: "12/02/2025",
      status: "Un Paid",
      totalAmount: "₹7500",
      dueAmount: "₹500",
    },

  ];

  const filteredInvoiceID = PaymentData.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceID.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === '' || invoice.status.toLowerCase() === statusFilter.toLowerCase();
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

  const displayedInvoice = filteredInvoiceID.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleView = (e) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false)
      navigate("viewpayment");
    }, 1000)
  };

  return (
    <>
      {isLoading && <PreLoader />}
      {!isLoading && (
        <section className="payment-list">
          <h5 className="payment-heading">Payment Details</h5>

          <div className="table-list">
            <div className="list-top">
              <div className="search-wrapper">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search by Invoice ID"
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
                    <option value="paid">Paid</option>
                    <option value="unpaid">Un Paid</option>
                  </select>
                  <IoIosArrowDown className="arrow-icon" />
                </div>
              </div>
            </div>

            <div className="list-alignment">
              <table className="payment-table">
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
                  {displayedInvoice.length === 0 ? (
                    <tr className="no-data">
                      <td colSpan={tableHeadings.length}>
                        <Norecords />
                        <h5>No Invoice Found!</h5>
                        <p>Once records are added, they’ll appear on this page.</p>
                      </td>
                    </tr>
                  ) : (
                    displayedInvoice.map((invoice, index) => (
                      <tr key={invoice.id} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{invoice.invoiceID}</td>
                        <td>{invoice.billingName}</td>
                        <td>{invoice.serviceType}</td>
                        <td>{invoice.dueDate}</td>
                        <td>
                          <span className={`status ${invoice.status.toLowerCase().replace(" ", "")}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td>{invoice.totalAmount}</td>
                        <td>{invoice.dueAmount}</td>
                        <td>
                          <span className='view-icon' onClick={handleView}>
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
                count={Math.ceil(filteredInvoiceID.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
              />
            </Stack>
          </div>
        </section>
      )}
    </>
  );
};

export default PaymentList;
