import React, { useState } from 'react';
import "../ManagerList/ManagerList.css";
import { HiPlus } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { MdModeEditOutline } from "react-icons/md";
import { HiOutlineTrash } from "react-icons/hi";
import { ReactComponent as Norecords } from "../../../../../assets/images/admin/manager/no-records.svg"
import DeleteModal from '../../../Common/DeleteModal/DeleteModal';
import PreLoader from './../../../../../common/PreLoader/PreLoader';

const ManagerList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setShowModal = () => {
    setShow(true)
  }
  const handleCloseModal = () => {
    setShow(false);
  };

  const tableHeadings = [
    { title: "S.No" },
    { title: "Manager ID" },
    { title: "Manager Name" },
    { title: "Mail ID" },
    { title: "Mobile Number" },
    { title: "JoiningDate" },
    { title: "Status" },
    { title: "" },
  ];

  const managers = [
    {
      id: 1,
      managerID: "SM_00001",
      managerName: "Surya",
      mailID: "Surya@gmail.com",
      mobileNumber: "9876543210",
      JoiningDate: "01/12/2025",
      status: "Active",
    },
    {
      id: 2,
      managerID: "SM_00002",
      managerName: "Mari vignesh Rao",
      mailID: "mari@gmail.com",
      mobileNumber: "9876543210",
      JoiningDate: "01/12/2025",
      status: "In Active",
    },
    {
      id: 3,
      managerID: "SM_00003",
      managerName: "Vignesh",
      mailID: "vignesh@gmail.com",
      mobileNumber: "9876543211",
      JoiningDate: "01/12/2025",
      status: "Active",
    },
    {
      id: 4,
      managerID: "SM_00004",
      managerName: "Kumar",
      mailID: "kumar@gmail.com",
      mobileNumber: "9876543212",
      JoiningDate: "01/12/2025",
      status: "In Active",
    },
    {
      id: 5,
      managerID: "SM_00005",
      managerName: "Arun",
      mailID: "arun@gmail.com",
      mobileNumber: "9876543213",
      JoiningDate: "01/12/2025",
      status: "Active",
    },
    {
      id: 6,
      managerID: "SM_00006",
      managerName: "Balaji",
      mailID: "balaji@gmail.com",
      mobileNumber: "9876543214",
      JoiningDate: "01/12/2025",
      status: "In Active",
    },
    {
      id: 7,
      managerID: "SM_00006",
      managerName: "Balaji",
      mailID: "balaji@gmail.com",
      mobileNumber: "9876543214",
      JoiningDate: "01/12/2025",
      status: "In Active",
    },
    {
      id: 8,
      managerID: "SM_00006",
      managerName: "Balaji",
      mailID: "balaji@gmail.com",
      mobileNumber: "9876543214",
      JoiningDate: "01/12/2025",
      status: "In Active",
    },

  ];

  const handleCreate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false)
      navigate("createmanager");
    }, 1000)
  };

  const filteredManagers = managers.filter((manager) => {
    const matchesSearch =
      manager.managerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.managerID.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === '' || manager.status.toLowerCase() === statusFilter.toLowerCase();
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

  const displayedManagers = filteredManagers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (manager) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false)
      navigate("editmanager", { state: { managerData: manager } });
    }, 1000)
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
                  {displayedManagers.length === 0 ? (
                    <tr className="no-data">
                      <td colSpan={tableHeadings.length}>
                        <Norecords />
                        <h5>No Managers Found!</h5>
                        <p>Once records are added, they’ll appear on this page.</p>
                      </td>
                    </tr>
                  ) : (
                    displayedManagers.map((manager, index) => (
                      <tr key={manager.id} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{manager.managerID}</td>
                        <td>{manager.managerName}</td>
                        <td>{manager.mailID}</td>
                        <td>{manager.mobileNumber}</td>
                        <td>{manager.JoiningDate}</td>
                        <td>
                          <span className={`status ${manager.status.toLowerCase().replace(" ", "")}`}>
                            {manager.status}
                          </span>
                        </td>
                        <td>
                          <span className='edit-icon' onClick={() => handleEdit(manager)}>
                            <MdModeEditOutline />
                          </span>

                          <span className='delete-icon' onClick={setShowModal}>
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
                count={Math.ceil(filteredManagers.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
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
