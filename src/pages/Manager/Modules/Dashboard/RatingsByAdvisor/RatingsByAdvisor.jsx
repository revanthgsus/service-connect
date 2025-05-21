import React, { useEffect, useState, useCallback } from 'react';
import "./RatingsByAdvisor.css";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { ReactComponent as Norecords } from "../../../../../assets/images/comman/no-records.svg";
import PreLoader from '../../../../../common/PreLoader/PreLoader';
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService.js';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../../../../contexts/AuthContext';
import { IoMdArrowRoundBack } from 'react-icons/io';

const RatingsByAdvisor = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const [ratings, setRatings] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRatings, setTotalRatings] = useState(0);
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
    { title: "Customer Ratings" },
    { title: "" },
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const fetchRatings = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const payload = {
      pageNo: currentPage,
      noOfDatas: itemsPerPage,
      companyName,
      companyAddress,
      ...(debouncedSearch && { input: debouncedSearch }),
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/managerMaster/getAdvisorRatingsListPage`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200) {
        setRatings(response?.data?.advisorRatingsListPage || []);
        setTotalRatings(response?.data?.count || 0);
      } else {
        toast.error("Failed to fetch Ratings data. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred while fetch the data.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch, setShowTokenModal, companyName, companyAddress]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const handleView = (advisorId) => {
    navigate('/manager/dashboard/viewratings',
      { state: { advisorId: advisorId } });
  };

  const handleSearchChange = (e) => setSearchInput(e.target.value);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = (e) => {
    e.preventDefault()
    navigate(-1);
  };

  // Image for no records
  const noRecords = debouncedSearch && ratings.length === 0;

  return (
    <>
      {isLoading ? (<PreLoader />
      ) : (
        <section className="ratings-list">
          <div className="header">
            <IoMdArrowRoundBack onClick={handleBack} />
            <h5>Advisor Ratings</h5>
          </div>

          <div className="table-list">
            <div className="search-wrapper">
              <input
                type="search"
                className="search-input"
                placeholder="Search by advisor name or ID"
                value={searchInput}
                onChange={handleSearchChange} />
              <IoSearch className="search-icon" />
            </div>

            <div className="list-alignment">
              <table className="ratings-table">
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
                        <h5>No Records Found!</h5>
                        <p>Once records are added, they’ll appear on this page.</p>
                      </td>
                    </tr>
                  ) : (
                    ratings.map((rating, index) => (
                      <tr key={rating.id || index} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{rating.advisor.advisorId}</td>
                        <td>{rating.advisor.userName}</td>
                        <td>{rating.advisor.emailAddress}</td>
                        <td>{rating.advisor.mobileNumber}</td>
                        <td>{rating.averageRating}</td>
                        <td>
                          <span className='details-icon'
                            onClick={() => handleView(rating.advisor.advisorId)}>
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
                count={Math.ceil(totalRatings / itemsPerPage)}
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

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  );
};

export default RatingsByAdvisor;
