import React, { useState } from 'react';
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
import DeleteModal from '../DeleteModal/DeleteModal';
import PreLoader from '../../../../common/PreLoader/PreLoader';

const AdminList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  // const [managers, setManagers] = useState([]);
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
    { title: "Admin ID" },
    { title: "Admin Name" },
    { title: "Mail ID" },
    { title: "Mobile Number" },
    { title: "JoiningDate" },
    { title: "Status" },
    { title: "" },
  ];

  const Admins = [
    {
      id: 1,
      managerID: "ADM_001",
      managerName: "Priya",
      mailID: "priya@gmail.com",
      mobileNumber: "9876543210",
      JoiningDate: "01/12/2025",
      status: "Active",
    },
    {
      id: 2,
      managerID: "ADM_002",
      managerName: "Mari vignesh",
      mailID: "mari@gmail.com",
      mobileNumber: "9876543210",
      JoiningDate: "01/12/2025",
      status: "In Active",
    },

    {
      id: 3,
      adminID: "SM_00003",
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

  ];

  const handleCreate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false)
      navigate("createadmin");
    }, 1000)
  };

  const filteredAdmins = Admins.filter((admin) => {
    const matchesSearch =
      admin.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.adminID.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === '' || admin.status.toLowerCase() === statusFilter.toLowerCase();
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

  const displayedAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (admin) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false)
      navigate("editadmin", { state: { adminData: admin } });
    }, 1000)
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
                  {displayedAdmins.length === 0 ? (
                    <tr className="no-data">
                      <td colSpan={tableHeadings.length}>
                        <Norecords />
                        <h5>No Admins Found!</h5>
                        <p>Once records are added, they’ll appear on this page.</p>
                      </td>
                    </tr>
                  ) : (
                    displayedAdmins.map((admin, index) => (
                      <tr key={admin.id} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{admin.adminID}</td>
                        <td>{admin.adminName}</td>
                        <td>{admin.mailID}</td>
                        <td>{admin.mobileNumber}</td>
                        <td>{admin.JoiningDate}</td>
                        <td>
                          <span className={`status ${admin.status.toLowerCase().replace(" ", "")}`}>
                            {admin.status}
                          </span>
                        </td>
                        <td>
                          <span className='edit-icon' onClick={() => handleEdit(admin)}>
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
                count={Math.ceil(filteredAdmins.length / itemsPerPage)}
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

export default AdminList;
