import React, { useEffect, useState, useCallback } from 'react';
import './TransactionList.css';
import { IoSearch } from 'react-icons/io5';
import { IoIosArrowDown } from 'react-icons/io';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { ReactComponent as Norecords } from '../../assets/images/comman/no-records.svg';
import { ReactComponent as EmptyImage } from '../../assets/images/comman/empty/transaction.svg';
import PreLoader from '../../common/PreLoader/PreLoader';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../../services/AuthService';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

const TransactionList = ({ userId, apiUrl, tableHeadings, filters, renderRow }) => {
  const { setShowTokenModal } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 10;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchTransactions = useCallback(async () => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const userRole = sessionStorage.getItem('userRole');
    const userIdentifier =
      userRole === 'Customer' ? { customerId: userId } :
        userRole === 'Advisor' ? { advisorId: userId } : {};

    const payload = {
      pageNo: currentPage,
      noOfDatas: itemsPerPage,
      ...userIdentifier,
      ...(statusFilter && { payment: statusFilter }),
      ...(debouncedSearch && filters?.searchKey && { [filters.searchKey]: debouncedSearch }),
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/${apiUrl}`, payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });


      console.log(response);

      if (response.status === 200) {
        setTransactions(response.data?.transactionsListPage || []);
        setTotalTransactions(response.data?.count || 0);
      } else {
        toast.error(response.data?.error || 'Failed to fetch transactions.');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred while fetching data.');
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, currentPage, debouncedSearch, statusFilter, userId, setShowTokenModal, filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSearchChange = (e) => setSearchInput(e.target.value);

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    document.querySelector('.layout-main')?.scrollTo({ top: 0, behavior: 'smooth' });
  };


  // const handleDownload = (transactionData) => {
  //   try {
  //     const doc = new jsPDF();
  //     doc.setFontSize(16);
  //     doc.text('Transaction Receipt', 14, 20);

  //     console.log(transactionData)

  //     const tableData = [
  //       ['Invoice ID', transactionData.invoiceId],
  //       ['Service ID', transactionData.serviceId],
  //       ['Transaction ID', transactionData.transactionId],
  //       ['Customer Name', transactionData.customerName],
  //       ['Sub Total', `₹${transactionData.subTotal}`],
  //       ['Discount', `₹${transactionData.discount}`],
  //       ['CGST', `₹${transactionData.cgst}`],
  //       ['SGST', `₹${transactionData.sgst}`],
  //       ['Advance Amount', `₹${transactionData.advanceAmount}`],
  //       // ['Date', new Date(transactionData.date).toLocaleDateString()],
  //       ['Total Amount', transactionData.totalAmount],
  //     ];

  //     autoTable(doc, {
  //       startY: 30,
  //       head: [['Field', 'Value']],
  //       body: tableData,
  //       theme: 'grid',
  //     });

  //     doc.save(`Transaction-${transactionData.transactionId}.pdf`);
  //   } catch (err) {
  //     toast.error('Failed to generate PDF.');
  //   }
  // };

  const isNoRecords = (debouncedSearch || statusFilter) && transactions.length === 0;
  const isEmptyState = !debouncedSearch && !statusFilter && transactions.length === 0;

  return (
    <>
      {isLoading ? (
        <PreLoader />
      ) : (
        <section className="transaction-list">
          <h5 className="transaction-heading">Transaction History</h5>

          <div className="table-list">
            {/* Top Search & Filter */}
            <div className="list-top">
              <div className="search-wrapper">
                <input
                  type="search"
                  className="search-input"
                  placeholder={filters?.searchPlaceholder || 'Search'}
                  value={searchInput}
                  onChange={handleSearchChange}
                />
                <IoSearch className="search-icon" />
              </div>

              <div className="status-wrapper">
                <div className="select-container">
                  <select
                    className="status-select"
                    value={statusFilter}
                    onChange={handleStatusChange}
                  >
                    <option value="">Status</option>
                    {filters?.statusOptions?.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <IoIosArrowDown className="arrow-icon" />
                </div>
              </div>
            </div>

            {/* Transaction Table */}
            <div className="list-alignment">
              <table className="transaction-table">
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
                  {isNoRecords ? (
                    <tr className="no-data">
                      <td colSpan={tableHeadings.length}>
                        <Norecords />
                        <h5>No Service ID Found!</h5>
                        <p>Once records are added, they’ll appear on this page.</p>
                      </td>
                    </tr>
                  ) : isEmptyState ? (
                    <tr className="empty-data">
                      <td colSpan={tableHeadings.length}>
                        <EmptyImage />
                        <p className="pt-3">Start your first Transaction today!</p>
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction, index) =>
                      renderRow(transaction, index, currentPage, itemsPerPage,
                        //  () => handleDownload(transaction)
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="pagination-align">
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(totalTransactions / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                sx={{
                  '& .MuiPaginationItem-root': { color: 'var(--text-color)' },
                  '& .Mui-selected': {
                    backgroundColor: '#01848D !important',
                    color: '#ffffff',
                  },
                  '& .Mui-selected:hover': {
                    backgroundColor: '#028d96 !important',
                  },
                }}
              />
            </Stack>
          </div>
        </section>
      )}

      <ToastContainer position="top-center" autoClose={1000} hideProgressBar theme="light" />
    </>
  );
};

export default TransactionList;
