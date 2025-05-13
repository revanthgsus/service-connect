import React from 'react'
import QuotesList from '../../../../../components/QuotesList/QuotesList'
import { FaRegEye } from "react-icons/fa6";

const CustomerQuotes = () => {
  const userId = sessionStorage.getItem("userId");

  const tableHeadings = [
    { title: "S.No" },
    { title: "Service ID" },
    { title: "Service Type" },
    { title: "Appointment Date" },
    { title: "Priority Level" },
    { title: "Status" },
    { title: "" },
  ]

  const renderRow = (quote, index, currentPage, itemsPerPage, handleView) => (
    <tr key={quote.id} className="list-item">
      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
      <td>{quote.serviceId}</td>
      <td>{quote.serviceType}</td>
      <td>{quote.appointmentDate}</td>
      <td>{quote.priorityLevel}</td>
      <td>
        <span
          className={`status 
            ${quote.quoteStatus.toLowerCase() === "accepted" ? "accepted"
              : quote.quoteStatus.toLowerCase() === "rejected" ? "rejected"
                : quote.quoteStatus.toLowerCase() === "in service" ? "accepted" : "unconfirmed"}`}>

          {quote.quoteStatus.toLowerCase() === "in service" ? "Accepted"
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
        apiUrl="customerMaster/getAppointmentsListPage"
        tableHeadings={tableHeadings}
        filters={{
          searchKey: "serviceId",
          searchPlaceholder: "Search by service ID",
          statusOptions: ["Unconfirmed", "Accepted", "Rejected"]
        }}
        renderRow={renderRow}
      />
    </>
  )
}

export default CustomerQuotes