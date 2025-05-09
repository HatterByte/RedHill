import React from 'react'

const ComplaintTable = () => {
    const complaints = [
        {
            complaintId: "C001",
            category: "Plumbing",
            severity: "High",
            resolved: 0,
            createdAt: "2025-05-01",
        },
        {
            complaintId: "C002",
            category: "Electrical",
            severity: "Medium",
            resolved: 1,
            createdAt: "2025-05-02",
        },
        {
            complaintId: "C003",
            category: "WiFi",
            severity: "Low",
            resolved: 0,
            createdAt: "2025-05-03",
        },
        {
            complaintId: "C004",
            category: "Cleanliness",
            severity: "High",
            resolved: 1,
            createdAt: "2025-05-04",
        },
        {
            complaintId: "C005",
            category: "Food Quality",
            severity: "Medium",
            resolved: 0,
            createdAt: "2025-05-05",
        },
        {
            complaintId: "C006",
            category: "Security",
            severity: "High",
            resolved: 0,
            createdAt: "2025-05-06",
        },
        {
            complaintId: "C007",
            category: "Laundry",
            severity: "Low",
            resolved: 1,
            createdAt: "2025-05-07",
        },
        {
            complaintId: "C008",
            category: "Furniture",
            severity: "Medium",
            resolved: 0,
            createdAt: "2025-05-08",
        },
        {
            complaintId: "C009",
            category: "Pest Control",
            severity: "High",
            resolved: 1,
            createdAt: "2025-05-09",
        },
        {
            complaintId: "C010",
            category: "Water Supply",
            severity: "Low",
            resolved: 0,
            createdAt: "2025-05-10",
        },
    ];
    return (
        <div className="m-10 bg-[rgba(255,255,255,0.9)] min-h-screen">
            <div className="overflow-x-auto min-h-screen rounded-xl">
                {/* {console.log(complaints)} */}
                <table className="min-w-full text-sm">
                    <thead className="table-header-group bg-[rgba(255,255,255,0.91)]  rounded">
                        <tr className='h-16'>
                            <th className=" px-4 py-2 text-left">Ref No.</th>
                            {/* <th className=" px-4 py-2 text-left">Seat</th> */}
                            <th className=" px-4 py-2 text-left">Issue Type</th>
                            <th className=" px-4 py-2 text-left">Severity</th>
                            <th className=" px-4 py-2 text-left">Status</th>
                            <th className=" px-4 py-2 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody className=" ">
                        {complaints.map((complaint) => (
                            <tr
                                key={complaint.complaintId}
                                className="hover:bg-gray-50 cursor-pointer h-16 rounded "
                            //   onClick={() => onComplaintClick(complaint)}
                            >
                                <td className=" px-4 py-2 text-blue-600 font-semibold ">{complaint.complaintId}</td>
                                {/* <td className=" px-4 py-2">{complaint.seat}</td> */}
                                <td className=" px-4 py-2">{complaint.category}</td>
                                <td
                                    className={` px-4 py-2 ${complaint.severity === "High"
                                            ? "text-red-600 font-semibold"
                                            : complaint.severity === "Medium"
                                                ? "text-yellow-500"
                                                : "text-green-600"
                                        }`}
                                >
                                    {complaint.severity}
                                </td>
                                {(complaint.resolved === 0) ? (<td className="text-yellow-500">Pending</td>) : (<td className="text-green-600">Completed</td>)}
                                <td className=" px-4 py-2">{complaint.createdAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ComplaintTable