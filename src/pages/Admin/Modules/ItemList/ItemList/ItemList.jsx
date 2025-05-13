import React, { useEffect, useState, useCallback } from 'react';
import "./ItemList.css";
import { HiPlus } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { MdModeEditOutline } from "react-icons/md";
import { ReactComponent as Norecords } from "../../../../../assets/images/comman/no-records.svg";
import { ReactComponent as EmptyImage } from "../../../../../assets/images/admin/empty/item.svg";
import PreLoader from './../../../../../common/PreLoader/PreLoader';
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../../../../contexts/AuthContext';

const ItemList = () => {
  const navigate = useNavigate();
  const { setShowTokenModal } = useAuth();
  const [items, setItems] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const itemsPerPage = 10;

  const companyName = sessionStorage.getItem("companyName")

  const tableHeadings = [
    { title: "S.No" },
    { title: "Item ID" },
    { title: "Item Name" },
    { title: "Item Fee" },
    { title: "Labour Fee" },
    { title: "Quantity" },
    { title: "Item Type" },
    { title: "Warranty" },
    { title: "" },
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const fetchItems = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    const payload = {
      pageNo: currentPage,
      noOfDatas: itemsPerPage,
      ...(debouncedSearch && { input: debouncedSearch }),
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/itemsList/getItemsListPage/${companyName}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200) {
        setItems(response?.data?.itemsListPage || []);
        setTotalItems(response?.data?.count || 0);
      } else {
        toast.error("Failed to fetch Items. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred while saving the data.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch, setShowTokenModal, companyName]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleEdit = async (itemId) => {
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/itemsList/getItemByItemId/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.status === 200 && response?.data?.status === "success") {
        navigate("edititem", { state: { itemData: response?.data?.item } });
      } else {
        toast.error("Failed to fetch items. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred while saving the data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => setSearchInput(e.target.value);

  const handleCreate = (e) => {
    e.preventDefault();
    navigate("createitem");
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    document.querySelector(".layout-main")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Image for empty state & no records
  const noRecords = (debouncedSearch) && items.length === 0;
  const emptyState = !debouncedSearch && items.length === 0;

  return (
    <>
      {isLoading && <PreLoader />}
      {!isLoading && (
        <section className="item-list">
          <div className="top-alignment">
            <h5 className="item-heading">Items List</h5>
            <button type="button" className="add-button" onClick={handleCreate}>
              <HiPlus />Add Items
            </button>
          </div>

          <div className="table-list">
            <div className="list-top">
              <div className="search-wrapper">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search by Item ID or Item Name"
                  value={searchInput}
                  onChange={handleSearchChange} />
                <IoSearch className="search-icon" />
              </div>
            </div>

            <div className="list-alignment">
              <table className="item-table">
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
                        <h5>No Items Found!</h5>
                        <p>Once records are added, they’ll appear on this page.</p>
                      </td>
                    </tr>
                  ) : emptyState ? (
                    <tr className="empty-data">
                      <td colSpan={tableHeadings.length}>
                        <EmptyImage />
                        <p className='pt-3'>Add your first Items to begin</p>
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <tr key={index} className="list-item">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{item.itemCode}</td>
                        <td>{item.itemName}</td>
                        <td>{item.itemFee ? `₹${item.itemFee}` : "N/A"}</td>
                        <td>{item.labourFee ? `₹${item.labourFee}` : "N/A"}</td>
                        <td>{item.quantity}</td>
                        <td>{item.itemType}</td>
                        <td>{item.warrantyPeriod}</td>
                        <td>
                          <span className="edit-icon" onClick={() => handleEdit(item.itemId)}>
                            <MdModeEditOutline />
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
                count={Math.ceil(totalItems / itemsPerPage)}
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

export default ItemList;
