import React from 'react'
import AppointmentList from '../../../../../components/Appointment/AppointmentList';
import { FaRegEye } from "react-icons/fa6";

const AdvisorAppointment = () => {
  const userId = sessionStorage.getItem("userId");

  const tableHeadings = [
    { title: "S.No" },
    { title: "Cust ID" },
    { title: "Customer Name" },
    { title: "Service Type" },
    { title: "Appointment Date" },
    { title: "Priority Level" },
    { title: "Status" },
    { title: "" },
  ]

  const renderRow = (appointment, index, currentPage, itemsPerPage, handleView) => (
    <tr key={appointment.appointmentId} className="list-item">
      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
      <td>{appointment.customerId}</td>
      <td>{appointment.customerName}</td>
      <td>{appointment.serviceType}</td>
      <td>{appointment.appointmentDate}</td>
      <td>{appointment.priorityLevel}</td>
      <td>
        <span
          className={`status ${appointment.status.toLowerCase() === "accepted"
            ? "accepted"
            : appointment.status.toLowerCase() === "rejected"
              ? "rejected" : "scheduled"}`}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
      </td>
      <td>
        <span className='view-icon' onClick={() => handleView(appointment)}>
          <FaRegEye />
        </span>
      </td>
    </tr>
  )

  return (
    <>
      <AppointmentList
        userId={userId}
        apiUrl="advisorMaster/getAdvisorAppointmentsListPage"
        tableHeadings={tableHeadings}
        filters={{
          searchKey: "input",
          searchPlaceholder: "Search by customer ID or name",
          statusOptions: ["Accepted", "Scheduled", "Rejected"]
        }}
        showCreateButton={false}
        renderRow={renderRow}
      />
    </>
  )
}

export default AdvisorAppointment