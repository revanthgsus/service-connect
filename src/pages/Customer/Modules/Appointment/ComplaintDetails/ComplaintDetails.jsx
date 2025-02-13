import React, { useState } from 'react';
import "./ComplaintDetails.css";
import { HiPlus } from "react-icons/hi";
import { IoClose } from "react-icons/io5";


const ComplaintDetails = ({ selectedAdvisor }) => {
  const [complainList, setComplainList] = useState([
    {
      item: "Filter Replacement",
      description: "Changing air and oil filters to ensure clean air and oil flow, "
    },
    {
      item: "Brake Inspection",
      description: "Checking brake pads, rotors, and fluid levels to ensure safety and performance."
    },
  ]);

  const handleChange = (index, field, value) => {
    const updatedComplainList = [...complainList];
    updatedComplainList[index][field] = value;
    setComplainList(updatedComplainList);
  };

  const handleAddRow = () => {
    setComplainList([...complainList, { item: "", description: "" }]);
  };

  const handleRemoveRow = (index) => {
    const updatedComplainList = complainList.filter((_, i) => i !== index);
    setComplainList(updatedComplainList);
  };

  return (
    <>
      {selectedAdvisor && (
        <div className='mt-4 complaint-section'>
          <table className="complaint-table">
            <thead className="table-align">
              <tr>
                <th className="sno">S.No</th>
                <th className="item">Item List</th>
                <th className="description">Complaint Description</th>
                <th className="action"></th>
              </tr>
            </thead>
            <tbody className='table-list'>
              {complainList.map((list, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <textarea
                      type="text"
                      className="form-control"
                      rows={2}
                      value={list.item}
                      onChange={(e) => handleChange(index, 'item', e.target.value)}
                    />
                  </td>
                  <td>
                    <textarea
                      type="text"
                      className="form-control"
                      rows={2}
                      value={list.description}
                      onChange={(e) => handleChange(index, 'description', e.target.value)}
                    />
                  </td>
                  <td className='close-icon'>
                    <span onClick={() => handleRemoveRow(index)}><IoClose /></span>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="12" className="add-btn-cell">
                  <button type="button" className="add-btn" onClick={handleAddRow}>
                    <HiPlus /> Add
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default ComplaintDetails;
