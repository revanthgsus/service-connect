import React from 'react'
import AppointmentList from '../../../../../components/Appointment/AppointmentList';
import { FaRegEye } from "react-icons/fa6";

const CustomerAppointment = () => {
  const userId = sessionStorage.getItem("userId");

  const tableHeadings = [
    { title: "S.No" },
    { title: "Service Type" },
    { title: "Appointment Date" },
    { title: "Serial Number" },
    { title: "Priority Level" },
    { title: "Status" },
    { title: "" },
  ]

  const renderRow = (appointment, index, currentPage, itemsPerPage, handleView) => (
    <tr key={appointment.appointmentId} className="list-item">
      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
      <td>{appointment.serviceType}</td>
      <td>{appointment.appointmentDate}</td>
      <td>{appointment.productSerialNo}</td>
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
        apiUrl="customerMaster/getAppointmentsListPage"
        tableHeadings={tableHeadings}
        filters={{
          searchKey: "serviceType",
          searchPlaceholder: "Search by service type",
          statusOptions: ["Accepted", "Scheduled", "Rejected"]
        }}
        showCreateButton={true}
        renderRow={renderRow}
      />
    </>
  )
}

export default CustomerAppointment