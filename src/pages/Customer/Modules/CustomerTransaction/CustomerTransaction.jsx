import React from 'react'
import { MdOutlineFileDownload } from "react-icons/md";
import TransactionList from '../../../../components/TransactionList/TransactionList';

const CustomerTransaction = () => {
  const userId = sessionStorage.getItem("userId");

  const tableHeadings = [
    { title: "S.No" },
    { title: "Service ID" },
    { title: "Invoice ID" },
    { title: "Transaction ID" },
    { title: "Payment Mode" },
    { title: "Date of Payment" },
    { title: "Paid Amount " },
    { title: "" },
  ]

  const renderRow = (transaction, index, currentPage, itemsPerPage, handleDownload) => (
    <tr key={transaction.id} className="list-item">
      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
      <td>{transaction.serviceId}</td>
      <td>{transaction.invoiceId}</td>
      <td>{transaction.transactionId}</td>
      <td>{transaction.paymentMode}</td>
      <td>{transaction.dateOfPayment}</td>
      <td>{`₹ ${transaction.amount}`}</td>
      <td>
        <span className='download-icon' onClick={() => handleDownload(transaction)}>
          <MdOutlineFileDownload />
        </span>
      </td>
    </tr>
  )

  return (
    <>
      <TransactionList
        userId={userId}
        apiUrl="paymentMaster/getCustomerTransactionsListPage"
        tableHeadings={tableHeadings}
        filters={{
          searchKey: "serviceId",
          searchPlaceholder: "Search by Service ID",
          statusOptions: ["Receipt", "Advance"]
        }}
        renderRow={renderRow}
      />
    </>
  )
}

export default CustomerTransaction;