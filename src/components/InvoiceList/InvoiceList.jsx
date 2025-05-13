import React, { useEffect, useState, useCallback } from 'react';
import "./InvoiceList.css";
import { IoSearch } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { ReactComponent as Norecords } from "../../assets/images/comman/no-records.svg";
import { ReactComponent as EmptyImage } from "../../assets/images/comman/empty/invoice.svg";
import axios from 'axios';
import API_BASE_URL from '../../services/AuthService';
import PreLoader from '../../common/PreLoader/PreLoader';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import InvoiceModal from '../../pages/Customer/Modules/Invoice/InvoiceModal/InvoiceModal';
import { HiPlus } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const InvoiceList = ({ userId, apiUrl, tableHeadings, filters, showCreateButton, renderRow }) => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const [invoice, setInvoice] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalInvoice, setTotalInvoice] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [invoiceShow, setInvoiceShow] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);


  const fetchInvoice = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const userRole = sessionStorage.getItem("userRole");
    let userIdentifier = {};
    if (userRole === "Customer") {
      userIdentifier = { customerId: userId };
    } else if (userRole === "Advisor") {
      userIdentifier = { advisorId: userId };
    }

    const payload = {
      pageNo: currentPage,
      noOfDatas: itemsPerPage,
      ...userIdentifier,
      ...(paymentStatus && { paymentStatus }),
      ...(debouncedSearch && filters?.searchKey && { [filters.searchKey]: debouncedSearch }),
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/${apiUrl}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200) {
        setInvoice((response?.data?.invoicesListPage || []).reverse());
        setTotalInvoice(response?.data?.count || 0);
      } else {
        toast.error(response?.data?.error || "Failed to fetch invoice data. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred while fetch the data.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, paymentStatus, debouncedSearch, userId, apiUrl, setShowTokenModal, filters]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);


  const handlePay = async (invoice) => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/paymentMaster/getInvoiceMasterByInvoiceId/${invoice.invoiceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (response?.data?.status === "success") {
        setSelectedInvoice(response.data.data);
        setInvoiceShow(true);
      } else {
        toast.error(response?.data?.message || "Failed to fetch invoice datails.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred while fetch the data.");
    }
  };

  const handleSearchChange = (e) => setSearchInput(e.target.value);
  const handleStatusChange = (e) => {
    setPaymentStatus(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleView = (e) => {
    e.preventDefault();
    navigate('/advisor/invoice/viewinvoice');
  }

  const handleCloseModal = () => setInvoiceShow(false);

  const handleCreate = (e) => {
    e.preventDefault();
    navigate('generate');
  }

  // Image for empty state & no records
  const noRecords = (debouncedSearch || paymentStatus) && invoice.length === 0;
  const emptyState = !debouncedSearch && !paymentStatus && invoice.length === 0;

  return (
    <>
      {isLoading ? (<PreLoader />
      ) : (
        <section className="invoice-list">
          <div className="top-alignment">
            <h5 className="invoice-heading">Invoice List</h5>

            {showCreateButton && (
              <button type="button" className="add-button" onClick={handleCreate}>
                <HiPlus />New Invoice
              </button>
            )}
          </div>

          <div className="table-list">
            <div className="list-top">
              <div className="search-wrapper">
                <input
                  type="search"
                  className="search-input"
                  placeholder={filters?.searchPlaceholder || "Search"}
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
                    value={paymentStatus}
                    onChange={handleStatusChange}>
                    <option value="">Status</option>
                    {filters?.statusOptions?.map((options, index) => (
                      <option key={index} value={options}>{options}</option>
                    ))}
                  </select>
                  <IoIosArrowDown className="arrow-icon" />
                </div>
              </div>
            </div>

            <div className="list-alignment">
              <table className="invoice-table">
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
                  ) : emptyState ? (
                    <tr className="empty-data">
                      <td colSpan={tableHeadings.length}>
                        <EmptyImage />
                        <p className='pt-3'>Start your first Invoice today!</p>
                      </td>
                    </tr>
                  ) : (
                    invoice.map((invoice, index) =>
                      renderRow(invoice, index, currentPage, itemsPerPage, handlePay, handleView)
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>

          <div className="pagination-align">
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(totalInvoice / itemsPerPage)}
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

      <InvoiceModal show={invoiceShow} onHide={handleCloseModal} invoice={selectedInvoice} />
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  );
};

export default InvoiceList;
