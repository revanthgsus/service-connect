import React, { useState } from 'react';
import "./InvoiceLists.css";
import { IoSearch } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { ReactComponent as Norecords } from "../../../../../assets/images/customer/no-records.svg"
import PreLoader from './../../../../../common/PreLoader/PreLoader';
import { MdOutlineFileDownload } from "react-icons/md";

const InvoiceLists = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 10;

  const tableHeadings = [
    { title: "S.No" },
    { title: "Service ID" },
    { title: "Invoice ID" },
    { title: "Due Date" },
    { title: "Total Amount" },
    { title: "Paid" },
    { title: "Due  " },
    { title: "Status" },
    { title: "" },
    { title: "" },
  ];

  const InvoiceData = [
    {
      id: 1,
      serviceID: "SR-25686",
      invoiceID: "INV-00001",
      dueDate: "12/02/2025",
      totalAmount: "₹5000",
      paidAmount: "₹500",
      dueAmount: "₹4500",
      status: "Partial Paid",
    },
    {
      id: 2,
      serviceID: "SR-25686",
      invoiceID: "INV-00001",
      dueDate: "12/02/2025",
      totalAmount: "₹5000",
      paidAmount: "₹500",
      dueAmount: "₹4500",
      status: "Paid",
    },
    {
      id: 3,
      serviceID: "SR-25686",
      invoiceID: "INV-00001",
      dueDate: "12/02/2025",
      totalAmount: "₹5000",
      paidAmount: "₹500",
      dueAmount: "₹4500",
      status: "Unpaid",
    },

  ];

  const filteredInvoiceID = InvoiceData.filter((invoice) => {
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


  const handleDownload = (e) => {
    e.preventDefault()
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (<PreLoader />
      ) : (
        <section className="invoice-list">
          <h5 className="invoice-heading">Invoice List</h5>

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
                    onChange={handleStatusChange}>
                    <option value="">Status</option>
                    <option value="partialpaid">Partial Paid</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Un Paid</option>
                  </select>
                  <IoIosArrowDown className="arrow-icon" />
                </div>
              </div>
            </div>

            <div className="list-alignment">
              <table className="invoice-table">
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
                        <td>{invoice.serviceID}</td>
                        <td>{invoice.invoiceID}</td>
                        <td>{invoice.dueDate}</td>
                        <td>{invoice.totalAmount}</td>
                        <td>{invoice.paidAmount}</td>
                        <td>{invoice.dueAmount}</td>
                        <td>
                          <span className={`status ${invoice.status.toLowerCase().replace(" ", "")}`}>
                            {invoice.status}
                          </span>
                        </td>

                        <td>
                          <span className='download-icon' onClick={handleDownload}>
                            <MdOutlineFileDownload />
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

export default InvoiceLists;
