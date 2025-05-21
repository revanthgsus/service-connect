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
import { ReactComponent as Norecords } from "../../../../../assets/images/comman/no-records.svg";
import { ReactComponent as EmptyImage } from "../../../../../assets/images/admin/empty/customer.svg";
import DeleteModal from '../../../../../common/DeleteModal/DeleteModal';
import PreLoader from './../../../../../common/PreLoader/PreLoader';
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../../../../contexts/AuthContext';

const CustomerList = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const itemsPerPage = 10;

  const companyName = sessionStorage.getItem("companyName");
  const companyLocation = sessionStorage.getItem("companyLocation");

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

  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // fetch customer data from get all api
  const fetchCustomers = useCallback(async () => {
    const userRole = sessionStorage.getItem("userRole");
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const payload = {
      pageNo: currentPage,
      noOfDatas: itemsPerPage,
      companyName,
      ...(userRole !== "Chief Admin" && { companyLocation }),
      ...(status && { status }),
      ...(debouncedSearch && { input: debouncedSearch }),
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/customerMaster/getCustomerMasterListPage`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200) {
        setCustomers(response?.data?.customerMasterListPage || []);
        setTotalCustomers(response?.data?.count || 0);
      } else {
        toast.error("Failed to fetch customer data. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, status, debouncedSearch, setShowTokenModal, companyName, companyLocation]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // when click edit icon call this api
  const handleEdit = async (customerId) => {
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/userMaster/viewUserById/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.status === 200) {
        navigate("editcustomer", { state: { customerData: response?.data?.data } });
      } else {
        toast.error("Failed to fetch customer data. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again later.");
    }
  };

  const handleSearchChange = (e) => setSearchInput(e.target.value);
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPage(1);
  }

  const handleDeleteClick = (customerId) => {
    setShow(true);
    setCustomerIdToDelete(customerId);
  };

  const handleCloseModal = () => { setShow(false); };

  const handleCreate = (e) => {
    e.preventDefault()
    navigate("createcustomer");
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Image for empty state & no records
  const noRecords = (debouncedSearch || status) && customers.length === 0;
  const emptyState = !debouncedSearch && !status && customers.length === 0;

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
                  {noRecords ? (
                    <tr className="no-data">
                      <td colSpan={tableHeadings.length}>
                        <Norecords />
                        <h5>No Customers Found!</h5>
                        <p>Once records are added, they’ll appear on this page.</p>
                      </td>
                    </tr>
                  ) : emptyState ? (
                    <tr className="empty-data">
                      <td colSpan={tableHeadings.length}>
                        <EmptyImage />
                        <p className='pt-3'>Add your first customer to begin</p>
                      </td>
                    </tr>
                  ) : (
                    customers.map((customer, index) => (
                      <tr key={customer.customerId} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{customer.customerId}</td>
                        <td>{customer.userName}</td>
                        <td>{customer.emailAddress}</td>
                        <td>{customer.mobileNumber}</td>
                        <td>{customer.joiningDate}</td>
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
                onChange={handlePageChange}
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "var(--text-color)",
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#01848D !important",
                    color: "#ffffff",
                  },
                  "& .Mui-selected:hover": {
                    backgroundColor: "#028d96 !important",
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
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  );
};

export default CustomerList;
