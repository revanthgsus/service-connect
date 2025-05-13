import React, { useState } from 'react';
import './ServiceRecords.css';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import EmptyImage from '../../../../../assets/images/comman/no-records.svg';

const ServiceRecords = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalRecords = 30;
  const records = [
    {
      id: 1,
      serviceId: "SR-12345",
      serviceType: "Car Routine Maintenance",
      appointmentDate: "02/10/2025",
      status: "Active",
      paymentStatus: "Paid",
      dueAmount: "Nill"
    },
    {
      id: 2,
      serviceId: "SR-12875",
      serviceType: "Oil Change",
      appointmentDate: "02/10/2025",
      status: "In Active",
      paymentStatus: "Partial Payment",
      dueAmount: "₹1500"
    },
    {
      id: 3,
      serviceId: "SR-12875",
      serviceType: "Oil Change",
      appointmentDate: "02/10/2025",
      status: "In Active",
      paymentStatus: "Partial Payment",
      dueAmount: "₹1500"
    },
    {
      id: 4,
      serviceId: "SR-12875",
      serviceType: "Oil Change",
      appointmentDate: "02/10/2025",
      status: "In Active",
      paymentStatus: "Partial Payment",
      dueAmount: "₹1500"
    },
    {
      id: 5,
      serviceId: "SR-12875",
      serviceType: "Oil Change",
      appointmentDate: "02/10/2025",
      status: "In Active",
      paymentStatus: "Partial Payment",
      dueAmount: "₹1500"
    }
  ];

  const tableHeadings = [
    { title: "S.No" },
    { title: "Service ID" },
    { title: "Service Type" },
    { title: "Appointment Date" },
    { title: "Service Status" },
    { title: "Payment Status" },
    { title: "Due Amount" },
  ];

  return (
    <>
      <section className="service-records mt-4">
        <div className="table-list">
          <div className="list-top">
            <h6 className='mb-0'>Service Records</h6>
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
                  <tr className="empty-data">
                    <td colSpan={tableHeadings.length}>
                      <img src={EmptyImage} alt="Empty Data" />
                      <p className="pt-3">Start your team—add your first Service today!</p>
                    </td>
                  </tr>
                ) : (
                  records.map((record, index) => (
                    <tr key={record.serviceId} className="list-item">
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{record.serviceId}</td>
                      <td>{record.serviceType}</td>
                      <td>{record.appointmentDate}</td>
                      <td>
                        <span className={`status ${record.status === "Active" ? "active" : "inactive"}`}>
                          {record.status}
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
              count={Math.ceil(totalRecords / itemsPerPage)}
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
