import React, { useState } from 'react';
import "./ActivityLists.css";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { ReactComponent as Norecords } from "../../../../../assets/images/advisor/no-records.svg"
import PreLoader from './../../../../../common/PreLoader/PreLoader';

const ActivityLists = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isLoading, setIsLoading] = useState(false);

  const tableHeadings = [
    { title: "S.No" },
    { title: "Service ID" },
    { title: "Service Type" },
    { title: "Urgency Level" },
    { title: "Expected Date" },
    { title: "Status" },
    { title: "" },
  ];

  const ActivityData = [
    {
      id: 1,
      serviceID: "SR-12345",
      serviceType: "Car Routine Maintenance",
      urgencyLevel: "Urgent",
      expectedDate: "10/02/2025",
      status: "Completed",
    },
    {
      id: 2,
      serviceID: "SR-12346",
      serviceType: "Battery Testing",
      urgencyLevel: "Standard",
      expectedDate: "10/02/2025",
      status: "In Queue",
    },
    {
      id: 3,
      serviceID: "SR-12347",
      serviceType: "Oil and filter change",
      urgencyLevel: "Urgent",
      expectedDate: "10/02/2025",
      status: "In Progress",
    },

  ];

  const filteredServiceID = ActivityData.filter((activity) => {
    const matchesSearch =
      activity.serviceID.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === '' || activity.status.toLowerCase() === statusFilter.toLowerCase();
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

  const displayedActivity = filteredServiceID.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleView = (e) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false)
      navigate("addactivity");
    }, 500)
  };

  return (
    <>
      {isLoading && <PreLoader />}
      {!isLoading && (
        <section className="activity-list">
          <h5 className="activity-heading">Service Activity</h5>

          <div className="table-list">
            <div className="list-top">
              <div className="search-wrapper">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search by Service ID"
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
                    <option value="inqueue">In Queue</option>
                    <option value="completed">Completed</option>
                    <option value="inprogress">In Progress</option>
                  </select>
                  <IoIosArrowDown className="arrow-icon" />
                </div>
              </div>
            </div>

            <div className="list-alignment">
              <table className="activity-table">
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
                  {displayedActivity.length === 0 ? (
                    <tr className="no-data">
                      <td colSpan={tableHeadings.length}>
                        <Norecords />
                        <h5>No ServiceID Found!</h5>
                        <p>Once records are added, they’ll appear on this page.</p>
                      </td>
                    </tr>
                  ) : (
                    displayedActivity.map((activity, index) => (
                      <tr key={activity.id} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{activity.serviceID}</td>
                        <td>{activity.serviceType}</td>
                        <td>{activity.urgencyLevel}</td>
                        <td>{activity.expectedDate}</td>
                        <td>
                          <span className={`status ${activity.status.toLowerCase().replace(" ", "")}`}>
                            {activity.status}
                          </span>
                        </td>
                        <td>
                          <span className='view-icon' onClick={handleView}>
                            <OpenInNewOutlinedIcon />
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
                count={Math.ceil(filteredServiceID.length / itemsPerPage)}
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

export default ActivityLists;
