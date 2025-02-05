import React, { useEffect, useState, useCallback } from 'react';
import "./AdminList.css";
import { HiPlus } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { MdModeEditOutline } from "react-icons/md";
import { HiOutlineTrash } from "react-icons/hi";
import { ReactComponent as Norecords } from "../../../../assets/images/admin/no-records.svg";
import { ReactComponent as EmptyImage } from "../../../../assets/images/admin/empty-data.svg"
import DeleteModal from '../../../../common/DeleteModal/DeleteModal';
import PreLoader from '../../../../common/PreLoader/PreLoader';
import axios from 'axios';
import API_BASE_URL from '../../../../services/AuthService';

const AdminList = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminIdToDelete, setAdminIdToDelete] = useState(null);
  const [totalAdmins, setTotalAdmins] = useState(0);

  const itemsPerPage = 10;

  const tableHeadings = [
    { title: "S.No" },
    { title: "Admin ID" },
    { title: "Admin Name" },
    { title: "Mail ID" },
    { title: "Mobile Number" },
    { title: "Joining Date" },
    { title: "Status" },
    { title: "" },
  ];

  const fetchAdmins = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
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
      const response = await axios.post(`${API_BASE_URL}/adminMaster/getAdminMasterListPage`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.data?.success) {
        setAdmins(response.data.adminMasterListPage || []);
        setTotalAdmins(response.data.totalRecords || 0);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, status, searchInput, navigate]);


  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleEdit = async (adminId) => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      alert("Session expired. Please sign in to continue.");
      navigate('/');
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/adminMaster/viewAdminById/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.data?.success) {
        navigate("editadmin", { state: { adminData: response.data } });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        alert("Failed to fetch admin details.");
      }
    } catch (error) {
      alert("An error occurred while fetching admin details.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearchChange = (e) => setSearchInput(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);

  const handleDeleteClick = (adminId) => {
    setShow(true);
    setAdminIdToDelete(adminId);
  };

  const handleCloseModal = () => { setShow(false); };

  const handleCreate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      navigate("createadmin");
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
        <section className="admin-list">
          <div className="top-alignment">
            <h5 className="admin-heading">Admin List</h5>
            <button type="button" className="add-button" onClick={handleCreate}>
              <HiPlus />
              Add Admin
            </button>
          </div>

          <div className="table-list">
            <div className="list-top">
              <div className="search-wrapper">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search by admin name or ID"
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
              <table className="admin-table">
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
                  {admins.length === 0 ? (
                    totalAdmins === 0 ? (
                      <tr className="empty-data">
                        <td colSpan={tableHeadings.length}>
                          <EmptyImage />
                          <p className='pt-3'>Add an admin to manage and oversee operations</p>
                        </td>
                      </tr>
                    ) : (
                      <tr className="no-data">
                        <td colSpan={tableHeadings.length}>
                          <Norecords />
                          <h5>No Admins Found!</h5>
                          <p>Once records are added, they’ll appear on this page.</p>
                        </td>
                      </tr>
                    )
                  ) : (
                    admins.map((admin, index) => (
                      <tr key={admin.adminId} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{admin.adminId}</td>
                        <td>{admin.userName}</td>
                        <td>{admin.emailAddress}</td>
                        <td>{admin.mobileNumber}</td>
                        <td>{formatDate(admin.joiningDate)}</td>
                        <td>
                          <span className={`status ${admin.status ? 'active' : 'inactive'}`}>
                            {admin.status ? "Active" : "In Active"}
                          </span>
                        </td>
                        <td>
                          <span className="edit-icon" onClick={() => handleEdit(admin.adminId)}>
                            <MdModeEditOutline />
                          </span>
                          <span className="delete-icon" onClick={() => handleDeleteClick(admin.adminId)}>
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
                count={Math.ceil(totalAdmins / itemsPerPage)}
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
        entityId={adminIdToDelete}
        entityType="Admin"
        deleteEndpoint="/adminMaster/deleteAdminMasterById"
        onDeleteSuccess={fetchAdmins} />
    </>
  );
};

export default AdminList;
