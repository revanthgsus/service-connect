import React, { useEffect, useState, useCallback } from 'react';
import "../ManagerList/ManagerList.css";
import { HiPlus } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { MdModeEditOutline } from "react-icons/md";
import { HiOutlineTrash } from "react-icons/hi";
import { ReactComponent as Norecords } from "../../../../../assets/images/admin/manager/no-records.svg";
import DeleteModal from '../../../Common/DeleteModal/DeleteModal';
import PreLoader from './../../../../../common/PreLoader/PreLoader';
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';

const ManagerList = () => {
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const fetchManagers = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
      alert("Auth token is missing");
      setIsLoading(false);
      return;
    }

    const payload = {
      pageNo: currentPage,
      noOfDatas: itemsPerPage,
      ...(status && { status }),
      ...(searchInput && { input: searchInput }),
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/managerMaster/getManagerMasterListPage`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("API response:", response.data);
        setManagers(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching managers:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, status, searchInput]);

  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const setShowModal = () => {
    setShow(true);
  };

  const handleCloseModal = () => {
    setShow(false);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      navigate("createmanager");
    }, 500);
  };

  const handleEdit = (manager) => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("editmanager", { state: { managerData: manager } });
    }, 500);
  };

  return (
    <>
      {isLoading && <PreLoader />}
      {!isLoading && (
        <section className="manager-list">
          <div className="top-alignment">
            <h5 className="manager-heading">Service Manager List</h5>
            <button type="button" className="add-button" onClick={handleCreate}>
              <HiPlus />
              Add Service Manager
            </button>
          </div>

          <div className="table-list">
            <div className="list-top">
              <div className="search-wrapper">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search by Manager Name or ID"
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
                    <option value="inactive">Inactive</option>
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
                  {managers.length > 0 ? (
                    managers.map((manager, index) => (
                      <tr key={manager.managerId} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{manager.managerId}</td>
                        <td>{manager.userName}</td>
                        <td>{manager.emailAddress}</td>
                        <td>{manager.mobileNumber}</td>
                        <td>{manager.joiningDate}</td>
                        <td>
                          <span className="status">{manager.status}</span>
                        </td>
                        <td>
                          <span className="edit-icon" onClick={() => handleEdit(manager)}>
                            <MdModeEditOutline />
                          </span>
                          <span className="delete-icon" onClick={setShowModal}>
                            <HiOutlineTrash />
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="no-data">
                      <td colSpan={tableHeadings.length}>
                        <Norecords />
                        <h5>No Managers Found!</h5>
                        <p>Once records are added, they’ll appear on this page.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pagination-align">
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(managers.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
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

      <DeleteModal show={show} handleClose={handleCloseModal} />
    </>
  );
};

export default ManagerList;
