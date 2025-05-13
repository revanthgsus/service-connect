import React from 'react'
import { FaRegEye } from "react-icons/fa6";
import InvoiceList from '../../../../../components/InvoiceList/InvoiceList';

const AdvisorInvoice = () => {
  const userId = sessionStorage.getItem("userId");

  const tableHeadings = [
    { title: "S.No" },
    { title: "Service ID" },
    { title: "Invoice ID" },
    { title: "Billing Name" },
    { title: "Due Date" },
    { title: "Total Amount" },
    { title: "Paid " },
    { title: "Due " },
    { title: "Status" },
    { title: "" },
    { title: "" },
  ]

  const renderRow = (invoice, index, currentPage, itemsPerPage, handleView) => (
    <tr key={invoice.id} className="list-item">
      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
      <td>{invoice.serviceId}</td>
      <td>{invoice.invoiceId}</td>
      <td>{invoice.customerName}</td>
      <td>{invoice.dueDate || '-'}</td>
      <td>{`₹ ${invoice.totalAmount}`}</td>
      <td>{`₹ ${invoice.paidAmount}`}</td>
      <td>{`₹ ${invoice.dueAmount}`}</td>
      <td>
        <span
          className={`status
            ${invoice.paymentStatus.toLowerCase() === "paid" ? "paid"
              : invoice.paymentStatus.toLowerCase() === "partial paid" ? "partialpaid" : "unpaid"}`}>
          {invoice.paymentStatus.charAt(0).toUpperCase() + invoice.paymentStatus.slice(1)}
        </span>
      </td>
      <td>
        <span className='download-icon' onClick={handleView}>
          <FaRegEye />
        </span>
      </td>
    </tr>
  )

  return (
    <>
      <InvoiceList
        userId={userId}
        apiUrl="advisorMaster/getAdvisorInvoicesListPage"
        tableHeadings={tableHeadings}
        filters={{
          searchKey: "invoiceId",
          searchPlaceholder: "Search by Invoice ID or Service ID",
          statusOptions: ["Paid", "Unpaid", "Partial Paid"]
        }}
        showCreateButton={true}
        renderRow={renderRow}
      />
    </>
  )
}

export default AdvisorInvoice;