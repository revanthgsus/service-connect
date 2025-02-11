import React, { useEffect, useState, useCallback } from 'react';
import "./CustomerList.css";
import { HiPlus } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { MdModeEditOutline } from "react-icons/md";
import { HiOutlineTrash } from "react-icons/hi";
import { ReactComponent as Norecords } from "../../../../../assets/images/admin/customer/no-records.svg";
import { ReactComponent as EmptyImage } from "../../../../../assets/images/admin/customer/empty-data.svg"
import DeleteModal from '../../../../../common/DeleteModal/DeleteModal';
import PreLoader from './../../../../../common/PreLoader/PreLoader';
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const itemsPerPage = 10;

  const tableHeadings = [
    { title: "S.No" },
    { title: "Customer ID" },
    { title: "Customer Name" },
    { title: "Mail ID" },
    { title: "Mobile Number" },
    { title: "Joining Date" },
    { title: "Status" },
    { title: "" },
  ];

  const fetchCustomers = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Session expired. Please sign in to continue.");
      navigate('/')
      return;
    }

    const payload = {
      pageNo: currentPage,
      noOfDatas: itemsPerPage,
      ...(status && { status }),
      ...(searchInput && { input: searchInput }),
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/customerMaster/getCustomerMasterListPage`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.data?.success) {
        setCustomers(response.data.customerMasterListPage || []);
        setTotalCustomers(response.data.totalRecords || 0);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, status, searchInput, navigate]);


  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleEdit = async (customerId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Session expired. Please sign in to continue.");
      navigate('/');
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/customerMaster/viewCustomerById/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.data?.success) {
        navigate("editcustomer", { state: { customerData: response.data } });
      } else {
        alert("Failed to fetch customer details.");
      }
    } catch (error) {
      alert("An error occurred while fetching customer details.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearchChange = (e) => setSearchInput(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);

  const handleDeleteClick = (customerId) => {
    setShow(true);
    setCustomerIdToDelete(customerId);
  };

  const handleCloseModal = () => { setShow(false); };

  const handleCreate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      navigate("createcustomer");
    }, 300);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <>
      {isLoading && <PreLoader />}
      {!isLoading && (
        <section className="customer-list">
          <div className="top-alignment">
            <h5 className="customer-heading">Customer List</h5>
            <button type="button" className="add-button" onClick={handleCreate}>
              <HiPlus />
              Add Customer
            </button>
          </div>

          <div className="table-list">
            <div className="list-top">
              <div className="search-wrapper">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search by customer name or ID"
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
                    <option value="active">Active</option>
                    <option value="inactive">In Active</option>
                  </select>
                  <IoIosArrowDown className="arrow-icon" />
                </div>
              </div>
            </div>

            <div className="list-alignment">
              <table className="customer-table">
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
                  {customers.length === 0 ? (
                    totalCustomers === 0 ? (
                      <tr className="empty-data">
                        <td colSpan={tableHeadings.length}>
                          <EmptyImage />
                          <p className='pt-3'>Add your first customer to begin</p>
                        </td>
                      </tr>
                    ) : (
                      <tr className="no-data">
                        <td colSpan={tableHeadings.length}>
                          <Norecords />
                          <h5>No Customers Found!</h5>
                          <p>Once records are added, they’ll appear on this page.</p>
                        </td>
                      </tr>
                    )
                  ) : (
                    customers.map((customer, index) => (
                      <tr key={customer.customerId} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{customer.customerId}</td>
                        <td>{customer.userName}</td>
                        <td>{customer.emailAddress}</td>
                        <td>{customer.mobileNumber}</td>
                        <td>{formatDate(customer.joiningDate)}</td>
                        <td>
                          <span className={`status ${customer.status ? 'active' : 'inactive'}`}>
                            {customer.status ? "Active" : "In Active"}
                          </span>
                        </td>
                        <td>
                          <span className="edit-icon" onClick={() => handleEdit(customer.customerId)}>
                            <MdModeEditOutline />
                          </span>
                          <span className="delete-icon" onClick={() => handleDeleteClick(customer.customerId)}>
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
                count={Math.ceil(totalCustomers / itemsPerPage)}
                page={currentPage}
                onChange={(e, value) => setCurrentPage(value)}
                sx={{
                  "& .Mui-selected": {
                    backgroundColor: "#01848D !important",
                    color: "#ffffff",
                  },
                  "& .Mui-selected:hover": {
                    backgroundColor: "#028d96",
                  },
                  "& .Mui-disabled": {
                    color: "var(--text-color)",
                  },
                }}
              />
            </Stack>
          </div>
        </section>
      )}

      <DeleteModal
        show={show}
        handleClose={handleCloseModal}
        entityId={customerIdToDelete}
        entityType="Customer"
        deleteEndpoint="/customerMaster/deleteCustomerMasterById"
        onDeleteSuccess={fetchCustomers} />
    </>
  );
};

export default CustomerList;
