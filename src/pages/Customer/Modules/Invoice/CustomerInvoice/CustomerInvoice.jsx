import React from 'react'
import { FaRegEye } from "react-icons/fa6";
import InvoiceList from '../../../../../components/InvoiceList/InvoiceList';

const CustomerInvoice = () => {
  const userId = sessionStorage.getItem("userId");

  const tableHeadings = [
    { title: "S.No" },
    { title: "Service ID" },
    { title: "Invoice ID" },
    { title: "Due Date" },
    { title: "Total Amount" },
    { title: "Paid " },
    { title: "Due " },
    { title: "Status" },
    { title: "" },
    { title: "" },
  ]

  const renderRow = (invoice, index, currentPage, itemsPerPage, handleView, handlePay) => (
    <tr key={invoice.id} className="list-item">
      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
      <td>{invoice.serviceId}</td>
      <td>{invoice.invoiceId}</td>
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
        {invoice.paymentStatus.toLowerCase() === "paid" ? (
          <span className='paynow-btn disabled'>Pay Now</span>
        ) : (
          <span className='paynow-btn' onClick={() => handlePay(invoice)}>
            Pay Now
          </span>
        )}
      </td>
      <td>
        <span className='download-icon' onClick={() => handleView(invoice)}>
          <FaRegEye />
        </span>
      </td>
    </tr>
  )

  return (
    <>
      <InvoiceList
        userId={userId}
        apiUrl="customerMaster/getCustomerInvoicesListPage"
        tableHeadings={tableHeadings}
        filters={{
          searchKey: "invoiceId",
          searchPlaceholder: "Search by Invoice ID or Service ID",
          statusOptions: ["Paid", "Unpaid", "Partial Paid"]
        }}
        renderRow={renderRow}
      />
    </>
  )
}

export default CustomerInvoice;