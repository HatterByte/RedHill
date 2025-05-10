import React,{useState} from 'react'
import ComplaintModal from './ComplaintModal'

const ComplaintTable = () => {
    const complaints = [
    {
        complaintId: "C001",
        name: "Rahul Sharma",
        phone: "9876543210",
        trainCode: "12345",
        trainName: "Rajdhani Express",
        category: "Plumbing",
        subCategory: "Leaky Tap",
        severity: "High",
        description: "Water is leaking continuously from the tap in coach B1.",
        media: "https://via.placeholder.com/150",
        pnr: "8923456721",
        otp: "4792",
        resolved: 0,
        createdAt: "2025-05-01",
    },
    {
        complaintId: "C002",
        name: "Neha Verma",
        phone: "9812345678",
        trainCode: "22334",
        trainName: "Shatabdi Express",
        category: "Electrical",
        subCategory: "Faulty Light",
        severity: "Medium",
        description: "The light in my berth is flickering frequently.",
        media: "https://via.placeholder.com/150",
        pnr: "7051236890",
        otp: "5821",
        resolved: 1,
        createdAt: "2025-05-02",
    },
    {
        complaintId: "C003",
        name: "Amit Singh",
        phone: "9123456780",
        trainCode: "11011",
        trainName: "Lokmanya Tilak Express",
        category: "WiFi",
        subCategory: "No Signal",
        severity: "Low",
        description: "WiFi is not working since the train started.",
        media: "https://via.placeholder.com/150",
        pnr: "6132458970",
        otp: "1398",
        resolved: 0,
        createdAt: "2025-05-03",
    },
    {
        complaintId: "C004",
        name: "Priya Desai",
        phone: "9988776655",
        trainCode: "12860",
        trainName: "Howrah Express",
        category: "Cleanliness",
        subCategory: "Dirty Washroom",
        severity: "High",
        description: "The washroom in coach A3 is extremely dirty and unusable.",
        media: "https://via.placeholder.com/150",
        pnr: "7098345621",
        otp: "9041",
        resolved: 1,
        createdAt: "2025-05-04",
    },
    {
        complaintId: "C005",
        name: "Vikram Joshi",
        phone: "9765432109",
        trainCode: "12952",
        trainName: "Mumbai Rajdhani",
        category: "Food Quality",
        subCategory: "Stale Food",
        severity: "Medium",
        description: "Food served was stale and cold.",
        media: "https://via.placeholder.com/150",
        pnr: "8903456217",
        otp: "7264",
        resolved: 0,
        createdAt: "2025-05-05",
    },
    {
        complaintId: "C006",
        name: "Sonal Mehta",
        phone: "9345678921",
        trainCode: "22691",
        trainName: "KSR Bengaluru Express",
        category: "Security",
        subCategory: "Unauthorized Passenger",
        severity: "High",
        description: "Unauthorized passengers are loitering in the reserved coach.",
        media: "https://via.placeholder.com/150",
        pnr: "9018273456",
        otp: "1153",
        resolved: 0,
        createdAt: "2025-05-06",
    },
    {
        complaintId: "C007",
        name: "Rohan Patel",
        phone: "9001234567",
        trainCode: "12472",
        trainName: "Swaraj Express",
        category: "Laundry",
        subCategory: "Dirty Bedsheets",
        severity: "Low",
        description: "The bedsheets provided were dirty and smelled bad.",
        media: "https://via.placeholder.com/150",
        pnr: "7412365980",
        otp: "6042",
        resolved: 1,
        createdAt: "2025-05-07",
    },
    {
        complaintId: "C008",
        name: "Anita Rao",
        phone: "9234567810",
        trainCode: "12626",
        trainName: "Kerala Express",
        category: "Furniture",
        subCategory: "Broken Seat",
        severity: "Medium",
        description: "The seat backrest in coach C2 is broken.",
        media: "https://via.placeholder.com/150",
        pnr: "6589031274",
        otp: "3720",
        resolved: 0,
        createdAt: "2025-05-08",
    },
    {
        complaintId: "C009",
        name: "Karan Gupta",
        phone: "9112233445",
        trainCode: "12424",
        trainName: "DBRT Rajdhani",
        category: "Pest Control",
        subCategory: "Cockroach",
        severity: "High",
        description: "Cockroaches were seen in the food compartment.",
        media: "https://via.placeholder.com/150",
        pnr: "8804562390",
        otp: "8137",
        resolved: 1,
        createdAt: "2025-05-09",
    },
    {
        complaintId: "C010",
        name: "Meera Iyer",
        phone: "9887766554",
        trainCode: "12163",
        trainName: "Chennai Express",
        category: "Water Supply",
        subCategory: "No Water",
        severity: "Low",
        description: "No water in washroom taps.",
        media: "https://via.placeholder.com/150",
        pnr: "7788123456",
        otp: "2560",
        resolved: 0,
        createdAt: "2025-05-10",
    },
];

    const [selectedComplaint, setSelectedComplaint] = useState(null);

    return (
        <div className="m-10 bg-[rgba(255,255,255,0.9)] min-h-screen">
            {selectedComplaint && (
                <ComplaintModal
                    complaint={selectedComplaint}
                    setSelectedComplaint={setSelectedComplaint}
                />
            )}
            <div className="overflow-x-auto min-h-screen rounded-xl">
                {/* {console.log(complaints)} */}
                <table className="min-w-full text-sm">
                    <thead className="table-header-group bg-[rgba(255,255,255,0.91)]  rounded">
                        <tr className='h-16'>
                            <th className=" px-4 py-2 text-left">Ref No.</th>
                            {/* <th className=" px-4 py-2 text-left">Seat</th> */}
                            <th className=" px-4 py-2 text-left">Issue Type</th>
                            <th className=" px-4 py-2 text-left">PNR No.</th>
                            <th className=" px-4 py-2 text-left">Status</th>
                            <th className=" px-4 py-2 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody className=" ">
                        {complaints.map((complaint) => (
                            <tr
                                key={complaint.complaintId}
                                className="hover:bg-gray-50 cursor-pointer h-16 rounded "
                              onClick={() => setSelectedComplaint(complaint)}
                            >
                                <td className=" px-4 py-2 text-blue-600 font-semibold ">{complaint.complaintId}</td>
                                <td className=" px-4 py-2">{complaint.category}</td>
                                <td
                                    className={` px-4 py-2 $`}
                                >
                                    {complaint.pnr}
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