import React, { useEffect, useState, useCallback } from 'react';
import "./AdvisorList.css";
import { HiPlus } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { MdModeEditOutline } from "react-icons/md";
import { HiOutlineTrash } from "react-icons/hi";
import { ReactComponent as Norecords } from "../../../../../assets/images/comman/no-records.svg";
import { ReactComponent as EmptyImage } from "../../../../../assets/images/admin/empty/advisor.svg"
import DeleteModal from '../../../../../common/DeleteModal/DeleteModal';
import PreLoader from './../../../../../common/PreLoader/PreLoader';
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../../../../contexts/AuthContext';

const AdvisorList = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const [advisors, setAdvisors] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [advisorIdToDelete, setAdvisorIdToDelete] = useState(null);
  const [totalAdvisors, setTotalAdvisors] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const itemsPerPage = 10;

  const companyName = sessionStorage.getItem("companyName");
  const companyAddress = sessionStorage.getItem("companyLocation");

  const tableHeadings = [
    { title: "S.No" },
    { title: "Advisor ID" },
    { title: "Advisor Name" },
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

  const fetchAdvisors = useCallback(async () => {
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
      ...(userRole !== "Chief Admin" && { companyAddress }),
      ...(status && { status }),
      ...(debouncedSearch && { input: debouncedSearch }),
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/advisorMaster/getAdvisorMasterListPage`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200) {
        setAdvisors(response?.data?.advisorMasterListPage || []);
        setTotalAdvisors(response?.data?.count || 0);
      } else {
        toast.error("Failed to fetch advisor data. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred while saving the data.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, status, debouncedSearch, setShowTokenModal, companyName, companyAddress]);

  useEffect(() => {
    fetchAdvisors();
  }, [fetchAdvisors]);

  const handleEdit = async (advisorId) => {
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/userMaster/viewUserById/${advisorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.status === 200) {
        navigate("editadvisor", { state: { advisorData: response?.data?.data } });
      } else {
        toast.error("Failed to fetch advisor data. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred while saving the data.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearchChange = (e) => setSearchInput(e.target.value);
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPage(1);
  }

  const handleDeleteClick = (advisorId) => {
    setShow(true);
    setAdvisorIdToDelete(advisorId);
  };

  const handleCloseModal = () => { setShow(false); };

  const handleCreate = (e) => {
    e.preventDefault();
    navigate("createadvisor");
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Image for empty state & no records
  const noRecords = (debouncedSearch || status) && advisors.length === 0;
  const emptyState = !debouncedSearch && !status && advisors.length === 0;

  return (
    <>
      {isLoading && <PreLoader />}
      {!isLoading && (
        <section className="advisor-list">
          <div className="top-alignment">
            <h5 className="advisor-heading">Advisor List</h5>
            <button type="button" className="add-button" onClick={handleCreate}>
              <HiPlus />
              Add Advisor
            </button>
          </div>

          <div className="table-list">
            <div className="list-top">
              <div className="search-wrapper">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search by advisor name or ID"
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
                  {noRecords ? (
                    <tr className="no-data">
                      <td colSpan={tableHeadings.length}>
                        <Norecords />
                        <h5>No Advisors Found!</h5>
                        <p>Once records are added, they’ll appear on this page.</p>
                      </td>
                    </tr>
                  ) : emptyState ? (
                    <tr className="empty-data">
                      <td colSpan={tableHeadings.length}>
                        <EmptyImage />
                        <p className='pt-3'>Add your first advisor to guide and support your customers</p>
                      </td>
                    </tr>
                  ) : (
                    advisors.map((advisor, index) => (
                      <tr key={advisor.advisorId} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{advisor.advisorId}</td>
                        <td>{advisor.userName}</td>
                        <td>{advisor.emailAddress}</td>
                        <td>{advisor.mobileNumber}</td>
                        <td>{advisor.joiningDate}</td>
                        <td>
                          <span className={`status ${advisor.status ? 'active' : 'inactive'}`}>
                            {advisor.status ? "Active" : "In Active"}
                          </span>
                        </td>
                        <td>
                          <span className="edit-icon" onClick={() => handleEdit(advisor.advisorId)}>
                            <MdModeEditOutline />
                          </span>
                          <span className="delete-icon" onClick={() => handleDeleteClick(advisor.advisorId)}>
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
                count={Math.ceil(totalAdvisors / itemsPerPage)}
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
        entityId={advisorIdToDelete}
        entityType="Advisor"
        deleteEndpoint="/advisorMaster/deleteAdvisorMasterById"
        onDeleteSuccess={fetchAdvisors} />
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  );
};

export default AdvisorList;
