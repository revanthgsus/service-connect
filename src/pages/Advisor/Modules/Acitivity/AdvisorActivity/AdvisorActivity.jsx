import React from 'react';
import ActivityList from '../../../../../components/ActivityList/ActivityList';
import { FaRegEye } from "react-icons/fa6";

const AdvisorActivity = () => {
  const userId = sessionStorage.getItem("userId");

  const tableHeadings = [
    { title: "S.No" },
    { title: "Service ID" },
    { title: "Customer Name" },
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
      <td>{activity.customerName}</td>
      <td>{activity.serviceType}</td>
      <td>{activity.priorityLevel}</td>
      <td>{activity.expectedDeliveryDate}</td>
      <td>
        <span
          className={`status 
            ${activity.serviceStatus.toLowerCase() === "completed" ? "completed"
              : activity.serviceStatus.toLowerCase() === "in progress" ? "inprogress"
                : "yettostart"}`}>
          {activity.serviceStatus.charAt(0).toUpperCase() + activity.serviceStatus.slice(1)}
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
        apiUrl="advisorMaster/getAdvisorAppointmentsListPage"
        tableHeadings={tableHeadings}
        filters={{
          searchKey: "serviceId",
          searchPlaceholder: "Search by service ID",
          statusOptions: ["Completed", "In Progress", "Yet to Start"]
        }}
        renderRow={renderRow}
      />
    </>
  )
}

export default AdvisorActivity