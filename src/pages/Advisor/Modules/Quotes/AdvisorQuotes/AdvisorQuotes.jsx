import React from 'react';
import QuotesList from '../../../../../components/QuotesList/QuotesList';
import { FaRegEye } from "react-icons/fa6";

const AdvisorQuotes = () => {
  const userId = sessionStorage.getItem("userId");

  const tableHeadings = [
    { title: "S.No" },
    { title: "Service ID" },
    { title: "Customer Name" },
    { title: "Service Type" },
    { title: "Priority Level" },
    { title: "Scheduled Date" },
    { title: "Status" },
    { title: "" },
  ];

  const renderRow = (quote, index, currentPage, itemsPerPage, handleView) => (
    <tr key={quote.id} className="list-item">
      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
      <td>{quote.serviceId}</td>
      <td>{quote.customerName}</td>
      <td>{quote.serviceType}</td>
      <td>{quote.priorityLevel}</td>
      <td>{quote.appointmentDate}</td>
      <td>
        <span
          className={`status
             ${quote.quoteStatus.toLowerCase() === "accepted" ? "accepted"
              : quote.quoteStatus.toLowerCase() === "rejected" ? "rejected"
                : quote.quoteStatus.toLowerCase() === "in service" ? "inservice" : "unconfirmed"
            }`}>
          {quote.quoteStatus.toLowerCase() === "unconfirmed" ? "Requested"
            : quote.quoteStatus.charAt(0).toUpperCase() + quote.quoteStatus.slice(1)}
        </span>
      </td>
      <td>
        <span className='view-icon' onClick={() => handleView(quote)}>
          <FaRegEye />
        </span>
      </td>
    </tr >
  )

  return (
    <>
      <QuotesList
        userId={userId}
        apiUrl="advisorMaster/getAdvisorAppointmentsListPage"
        tableHeadings={tableHeadings}
        filters={{
          searchKey: "quoteInput",
          searchPlaceholder: "Search by service ID or type",
          statusOptions: [
            { label: "Requested", value: "unconfirmed" },
            { label: "Accepted", value: "accepted" },
            { label: "Rejected", value: "rejected" },
            { label: "In Service", value: "in service" }
          ]
        }}
        renderRow={renderRow}
      />
    </>
  )
}

export default AdvisorQuotes;