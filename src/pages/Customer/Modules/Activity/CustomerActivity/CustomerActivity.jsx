import React from 'react';
import ActivityList from '../../../../../components/ActivityList/ActivityList';
import { FaRegEye } from "react-icons/fa6";

const CustomerActivity = () => {
  const userId = sessionStorage.getItem("userId");

  const tableHeadings = [
    { title: "S.No" },
    { title: "Service ID" },
    { title: "Service Type" },
    { title: "Priority Level" },
    { title: "Expected Date" },
    { title: "Status" },
    { title: "" },
  ]

  const renderRow = (activity, index, currentPage, itemsPerPage, handleView) => (
    <tr key={activity.appointmentId} className="list-item">
      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
      <td>{activity.serviceId}</td>
      <td>{activity.serviceType}</td>
      <td>{activity.priorityLevel}</td>
      <td>{activity.expectedDeliveryDate}</td>
      <td>
        <span className={`status 
          ${activity.serviceStatus.toLowerCase() === 'completed' ? 'completed' : 'inprogress'}`}>
          {activity.serviceStatus}
        </span>
      </td>
      <td>
        <span className='view-icon' onClick={() => handleView(activity)}>
          <FaRegEye />
        </span>
      </td>
    </tr>
  )

  return (
    <>
      <ActivityList
        userId={userId}
        apiUrl="customerMaster/getAppointmentsListPage"
        tableHeadings={tableHeadings}
        filters={{
          searchKey: "serviceId",
          searchPlaceholder: "Search by service ID",
          statusOptions: ["Completed", "In Progress"]
        }}
        renderRow={renderRow}
      />
    </>
  )
}

export default CustomerActivity