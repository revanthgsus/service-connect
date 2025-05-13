import React, { useEffect, useState, useCallback } from 'react';
import "./ServiceList.css";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { ReactComponent as Norecords } from "../../../../../assets/images/comman/no-records.svg";
import { ReactComponent as EmptyImage } from "../../../../../assets/images/comman/empty/activity.svg";
import PreLoader from './../../../../../common/PreLoader/PreLoader';
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../../../../contexts/AuthContext';

const ServiceList = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const [services, setServices] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [serviceStatus, setServiceStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalServices, setTotalServices] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const itemsPerPage = 10;

  const companyName = sessionStorage.getItem("companyName");
  const companyLocation = sessionStorage.getItem("companyLocation");

  const tableHeadings = [
    { title: "S.No" },
    { title: "Service ID" },
    { title: "Advisor Name" },
    { title: "Customer Name" },
    { title: "Service Type" },
    { title: "Scheduled Date" },
    { title: "Service Status" },
    { title: "" },
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const fetchServices = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const payload = {
      pageNo: currentPage,
      noOfDatas: itemsPerPage,
      companyName,
      companyLocation,
      ...(serviceStatus && { serviceStatus }),
      ...(debouncedSearch && { serviceId: debouncedSearch }),
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/managerMaster/getServiceListPage`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200) {
        const allService = response?.data?.serviceListPage || [];
        let validService = allService.filter(s => s.serviceStatus !== "-");
        setServices(validService);

        setTotalServices(response?.data?.serviceCount || 0);
      } else {
        toast.error("Failed to fetch services data. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred while fetch the data.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, serviceStatus, debouncedSearch, setShowTokenModal, companyName, companyLocation]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleView = async (appointmentId) => {
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/customerMaster/viewAppointmentById/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.status === 200 && response?.data?.status === "success") {
        navigate("viewservice", { state: { appointmentData: response?.data?.data } });
      } else {
        toast.error("Failed to fetch service data. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred while fetch the data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => setSearchInput(e.target.value);
  const handleStatusChange = (e) => {
    setServiceStatus(e.target.value)
    setCurrentPage(1);
  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Image for empty state & no records
  const noRecords = (debouncedSearch || serviceStatus) && services.length === 0;
  const emptyState = !debouncedSearch && !serviceStatus && services.length === 0;

  return (
    <>
      {isLoading ? (<PreLoader />
      ) : (
        <section className="service-list">
          <div className="top-alignment">
            <h5 className="service-heading">Service List</h5>
          </div>

          <div className="table-list">
            <div className="list-top">
              <div className="search-wrapper">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search by Service ID"
                  value={searchInput}
                  onChange={handleSearchChange} />
                <IoSearch className="search-icon" />
              </div>

              <div className="status-wrapper">
                <div className="select-container">
                  <select
                    name="status"
                    id="status-select"
                    className="status-select"
                    value={serviceStatus}
                    onChange={handleStatusChange}>
                    <option value="">Status</option>
                    <option value="yettostart">Yet to Start</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <IoIosArrowDown className="arrow-icon" />
                </div>
              </div>
            </div>

            <div className="list-alignment">
              <table className="service-table">
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
                        <h5>No Service ID Found!</h5>
                        <p>Once records are added, they’ll appear on this page.</p>
                      </td>
                    </tr>
                  ) : emptyState ? (
                    <tr className="empty-data">
                      <td colSpan={tableHeadings.length}>
                        <EmptyImage />
                        <p className='pt-3'>Start your first service today!</p>
                      </td>
                    </tr>
                  ) : (
                    services.map((service, index) => (
                      <tr key={service.id} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{service.serviceId}</td>
                        <td>{service.advisorName}</td>
                        <td>{service.customerName}</td>
                        <td>{service.serviceType}</td>
                        <td>{service.appointmentDate}</td>
                        <td>
                          <span
                            className={`status ${service.serviceStatus.toLowerCase() === "completed" ? "completed"
                              : service.serviceStatus.toLowerCase() === "in progress" ? "inprogress"
                                : "yettostart"}`}>
                            {service.serviceStatus.charAt(0).toUpperCase() + service.serviceStatus.slice(1)}
                          </span>
                        </td>
                        <td>
                          <span className='view-icon'
                            onClick={() => handleView(service.appointmentId)}>
                            <OpenInNewOutlinedIcon />
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div >

          <div className="pagination-align">
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(totalServices / itemsPerPage)}
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
                }} />
            </Stack>
          </div>
        </section >
      )}

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  );
};

export default ServiceList;
