import React from 'react';
import QuoteSummary from '../../../../../components/QuoteSummary/QuoteSummary';
import { Tr, Td } from 'react-super-responsive-table';

const AdvisorQuoteSummary = () => {
  const tableHeadings = [
    { title: "S.No" },
    { title: "Item Code" },
    { title: "Item Name" },
    { title: "Item Fee" },
    { title: "Labour Fee" },
    { title: "Total Amount" },
  ];

  const renderRow = (quote, index, handleView, quoteStatus) => (
    <Tr key={index} className="list-item">
      <Td>{index + 1}</Td>
      <Td>
        <input
          type="text"
          className="form-control item-input"
          value={quote.itemCode}
          readOnly />

        {quoteStatus !== "Rejected" && quote.warrantyStatus !== "-" && (
          <span onClick={() => handleView(quote)}
            className={`warranty-status
             ${quote.warrantyStatus === "Warranty Covered" ? "covered"
                : quote.warrantyStatus === "Expired" ? "expired"
                  : quote.warrantyStatus === "Claimed" ? "claimed"
                    : quote.warrantyStatus === "Declined" ? "declined"
                      : quote.warrantyStatus === "Already Claimed" ? "alreadyclaimed"
                        : quote.warrantyStatus === "View & claim" ? "viewclaim" : ""}`}>

            {/* staus change in UI level */}
            {quote.warrantyStatus === "No" ? ""
              : quote.warrantyStatus}
          </span>
        )}

      </Td>
      <Td>{quote.itemName || ""}</Td>
      <Td>{quote.itemFee ? `₹ ${quote.itemFee}` : "₹ 0"}</Td>
      <Td>{quote.labourFee ? `₹ ${quote.labourFee}` : "0"}</Td>
      <Td>{quote.totalAmount ? `₹ ${quote.totalAmount}` : "0"}</Td>
    </Tr>
  )

  return (
    <QuoteSummary
      tableHeadings={tableHeadings}
      renderRow={renderRow}
    />
  )
}

export default AdvisorQuoteSummary;