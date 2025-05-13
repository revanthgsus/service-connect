import React, { useEffect, useState, useCallback } from 'react';
import "./ManagerList.css";
import { HiPlus } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { MdModeEditOutline } from "react-icons/md";
import { HiOutlineTrash } from "react-icons/hi";
import { ReactComponent as Norecords } from "../../../../../assets/images/comman/no-records.svg";
import { ReactComponent as EmptyImage } from "../../../../../assets/images/admin/empty/manager.svg";
import DeleteModal from '../../../../../common/DeleteModal/DeleteModal';
import PreLoader from './../../../../../common/PreLoader/PreLoader';
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../../../../contexts/AuthContext';

const ManagerList = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const [managers, setManagers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [managerIdToDelete, setManagerIdToDelete] = useState(null);
  const [totalManagers, setTotalManagers] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const itemsPerPage = 10;

  const companyName = sessionStorage.getItem("companyName");
  const companyLocation = sessionStorage.getItem("companyLocation");

  const tableHeadings = [
    { title: "S.No" },
    { title: "Manager ID" },
    { title: "Manager Name" },
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

  const fetchManagers = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    const userRole = sessionStorage.getItem("userRole");
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
      const response = await axios.post(`${API_BASE_URL}/managerMaster/getManagerMasterListPage`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200) {
        setManagers(response?.data?.managerMasterListPage || []);
        setTotalManagers(response?.data?.count || 0);
      } else {
        toast.error("Failed to fetch manager data. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred while fetch the data.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, status, debouncedSearch, setShowTokenModal, companyName, companyLocation]);

  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  const handleEdit = async (managerId) => {
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/userMaster/viewUserById/${managerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.status === 200) {
        navigate("editmanager", { state: { managerData: response?.data?.data } });
      } else {
        toast.error("Failed to fetch manager data. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred while fetch the data.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearchChange = (e) => setSearchInput(e.target.value);

  const handleStatusChange = (e) => {
    setStatus(e.target.value)
    setCurrentPage(1);
  }

  const handleDeleteClick = (managerId) => {
    setShow(true);
    setManagerIdToDelete(managerId);
  };

  const handleCloseModal = () => { setShow(false) };

  const handleCreate = (e) => {
    e.preventDefault()
    navigate("createmanager");
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Image for empty state & no records
  const noRecords = (debouncedSearch || status) && managers.length === 0;
  const emptyState = !debouncedSearch && !status && managers.length === 0;

  return (
    <>
      {isLoading && <PreLoader />}
      {!isLoading && (
        <section className="manager-list">
          <div className="top-alignment">
            <h5 className="manager-heading">Manager List</h5>
            <button type="button" className="add-button" onClick={handleCreate}>
              <HiPlus />Add Manager
            </button>
          </div>

          <div className="table-list">
            <div className="list-top">
              <div className="search-wrapper">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search by manager name or ID"
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
                  {noRecords ? (
                    <tr className="no-data">
                      <td colSpan={tableHeadings.length}>
                        <Norecords />
                        <h5>No Managers Found!</h5>
                        <p>Once records are added, they’ll appear on this page.</p>
                      </td>
                    </tr>
                  ) : emptyState ? (
                    <tr className="empty-data">
                      <td colSpan={tableHeadings.length}>
                        <EmptyImage />
                        <p className='pt-3'>Start your team—add your first Service Manager today!</p>
                      </td>
                    </tr>
                  ) : (
                    managers.map((manager, index) => (
                      <tr key={manager.managerId} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{manager.managerId}</td>
                        <td>{manager.userName}</td>
                        <td>{manager.emailAddress}</td>
                        <td>{manager.mobileNumber}</td>
                        <td>{manager.joiningDate}</td>
                        <td>
                          <span className={`status ${manager.status ? 'active' : 'inactive'}`}>
                            {manager.status ? "Active" : "In Active"}
                          </span>
                        </td>
                        <td>
                          <span className="edit-icon" onClick={() => handleEdit(manager.managerId)}>
                            <MdModeEditOutline />
                          </span>
                          <span className="delete-icon" onClick={() => handleDeleteClick(manager.managerId)}>
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
                count={Math.ceil(totalManagers / itemsPerPage)}
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
        entityId={managerIdToDelete}
        entityType="Manager"
        deleteEndpoint="/managerMaster/deleteManagerMasterById"
        onDeleteSuccess={fetchManagers} />
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  );
};

export default ManagerList;
