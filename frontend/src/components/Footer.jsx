import React from 'react'

const Footer = () => {
  return (
    <>
            <div className="flex w-full h-13 bg-[#75002b] justify-evenly items-center mt-auto">
                <div className="text-white">Copyright ©2019 RAILMADAD. All Rights Reserved.</div>
                <div className="text-white">
                <a href="https://railmadad.indianrailways.gov.in/madad/final/home.jsp" target="_blank" rel="noreferrer" className="hover:underline mr-1">Home</a> | <a href="https://railmadad.indianrailways.gov.in/madad/final/home.jsp" target="_blank" rel="noreferrer" className="hover:underline mr-1">FAQs</a> | <a href="https://www.railmadad.in/railway-admin-login" target="_blank" rel="noreferrer" className="hover:underline">Railway Admin Login</a> | <a href="https://www.railmadad.in/mis-report-login" target="_blank" rel="noreferrer" className="hover:underline">MIS Report Login</a>
        </div>
            </div>
    </>
  )
}

export default Footer