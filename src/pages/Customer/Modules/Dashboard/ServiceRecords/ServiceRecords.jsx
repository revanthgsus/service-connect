import React, { useState } from 'react';
import './ServiceRecords.css';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import EmptyImage from '../../../../../assets/images/customer/empty-data.svg'; // Import image paths
import Norecords from '../../../../../assets/images/customer/no-records.svg';

const ServiceRecords = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalManagers = 50;
  const records = [];

  const tableHeadings = [
    { title: "S.No" },
    { title: "Service ID" },
    { title: "Service Type" },
    { title: "Appointment Date" },
    { title: "Location" },
    { title: "Status" },
    { title: "Payment Status" },
    { title: "Due Amount" },
  ];

  return (
    <>
      <section className="service-records">
        <div className="table-list">
          <div className="list-top">
            <h5>Service Records</h5>
          </div>

          <div className="list-alignment">
            <table className="records-table">
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
                {records.length === 0 ? (
                  totalManagers === 0 ? (
                    <tr className="empty-data">
                      <td colSpan={tableHeadings.length}>
                        <img src={EmptyImage} alt="Empty Data" /> {/* Use img tag for images */}
                        <p className='pt-3'>Start your team—add your first Service today!</p>
                      </td>
                    </tr>
                  ) : (
                    <tr className="no-data">
                      <td colSpan={tableHeadings.length}>
                        <img src={Norecords} alt="No Records Found" />
                        <h5>No records Found!</h5>
                        <p>Once records are added, they’ll appear on this page.</p>
                      </td>
                    </tr>
                  )
                ) : (
                  records.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((record, index) => (
                    <tr key={record.serviceId} className="list-item">
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{record.serviceId}</td>
                      <td>{record.serviceType}</td>
                      <td>{record.appointmentDate}</td>
                      <td>{record.location}</td>
                      <td>
                        <span className={`status ${record.status ? 'active' : 'inactive'}`}>
                          {record.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>{record.paymentStatus}</td>
                      <td>{record.dueAmount}</td>
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
              count={Math.ceil(totalManagers / itemsPerPage)}
              page={currentPage}
              onChange={(e, value) => setCurrentPage(value)}
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
    </>
  );
};

export default ServiceRecords;
