import React, { useState } from "react";

const generalFaqs = [
  {
    q: "What is the purpose and objectives of Rail Madad portal?",
    a: "Rail Madad Portal has been developed to enable Railway pax. to lodge a complaint or give suggestion through on line, app., or SMS and facility to track live status of complaints and provide feedback based on their satisfaction with the resolution. The objective of this portal is to enhance experience of Railways passengers with swift and satisfactory resolution of complaints.",
  },
  {
    q: "What kind of complaints can I submit?",
    a: "Any complaint relating only to 'Train' or 'Station' can be lodged.",
  },
  {
    q: "What kind of suggestions can I submit?",
    a: "Any suggestion relating only to 'Train' or 'Station' can be submitted.",
  },
  {
    q: "What details do I need to login the system?",
    a: "You are required to enter your valid email id or mobile number. A One Time Password (OTP) will be sent to the Mobile Number or Email Id which needs to be entered. (This Procedure is followed to ensure that the complaint / suggestion is being lodged with valid identity.)",
  },
  {
    q: "Are both, mobile number and email id, mandatory to login into the system?",
    a: "No. Any one of them will do.",
  },
  {
    q: "Do I have to provide my PNR details in train complaint?",
    a: "Yes. PNR details help in correct assignment of a complaint for swift resolution",
  },
  {
    q: "Can I attach a supporting document along with the complaint or suggestion?",
    a: "Yes. A facility has been provided to upload only .jpg, .jpeg & .png files as supplementary document you desire along with your complaint / suggestion. Uploading can be done with click on 'Choose File' button.",
  },
  {
    q: "Within what time frame my complaint will be resolved?",
    a: "We will make all sincere efforts to resolve your complaints at the earliest and also inform you the same. However, you can also track online your complaint status.",
  },
  {
    q: "How will I get to know if my complaint has been resolved?",
    a: "A message confirming resolution of your complaint / suggestion will be sent on your registered mobile number or email id.",
  },
  {
    q: "Where can I track the complaint already submitted by me?",
    a: "You can track live status of your complaint by clicking on 'TRACK COMPLAINT' button after login to the portal.",
  },
  {
    q: "Is there any provision for feedback about the quality of resolution of my complaint?",
    a: "Yes. After receiving the message of resolution you can post your feedback through the link provided in resolution SMS you have received from portal.",
  },
  {
    q: "What should I do if the portal stops responding or displays an error?",
    a: "Two immediate action could be= a) Refresh the browser. b) Log out and login again.",
  },
  {
    q: "Can I edit/modify my complaint or suggestion after it has been submitted?",
    a: "No. Once submitted, no modifications/change can be made to the complaint or suggestion. However, a fresh complaint or suggestion can be submitted.",
  },
  {
    q: "Can complaint be submitted via post?",
    a: "Yes. You can send your complaint through post that will be accepted and processed through this portal only.",
  },
  {
    q: "I have a question that was not answered in this FAQ. What should I do?",
    a: "We have taken all care to make it comprehensive. If you require any further assistance you can always send a mail to us on railmadad@gov.in.",
  },
  {
    q: "Is there a provision to lodge train complaints using UTS ticket number?",
    a: "Yes. This can be done by clicking train complaints mentioning train number followed by UTS number as a travel authority.",
  },
  {
    q: "Is there provision to lodge complaints against Railway staff ?",
    a: "Yes. Staff Behavior is one of the heads of the Complaint both 'Train' and 'Station' and complaint can be lodged against any incident of staff misbehavior.",
  },
  {
    q: "Is there provision to lodge complaint through SMS ?",
    a: "Yes. You may write a message 'MADAD space your complaint' and SMS it to 139.",
  },
  {
    q: "Is there provision to lodge complaints over phone ?",
    a: "Yes . Complaint can be lodged over phone on the integrated helpline no. 139.",
  },
  {
    q: "Is there any restriction on length of the Complaint ?",
    a: "Yes. Maximum 1000 characters.",
  },
  {
    q: "Is there provision for tracking same complaints on cross platform ?",
    a: "There are three platform available to lodge complaints in Rail Madad i.e. WEB, APP , SMS and Helpline 139. Complaints lodged on Web or Apps can be tracked on both of them. Complaints lodged through SMS or helpline number 139 can be tracked only on their respective channels.",
  },
  {
    q: "Is there any provision to reopen the complaint if the complainant is not satisfied by the resolution provided by Railways?",
    a: "No. There is no such provision",
  },
  {
    q: "Is there provision to change the password?",
    a: "Yes. Initially Application provide default password and that can be changed later after login.",
  },
  {
    q: "Can I see my history of the lodged complaints",
    a: "No.",
  },
  {
    q: "Is there provision to track complaint with reference no.?",
    a: "Yes.",
  },
  {
    q: "Is there provision to change the contacts details?",
    a: "Yes. You can update your profile on the link given for this purpose.",
  },
  {
    q: "Is there a restriction on entered PNR for Train Complaints?",
    a: "Yes. You can only enter a PNR within 5 days after the boarding time.",
  },
];

const utsFaqs = [
  {
    q: "Who can use the utsonmobile application?",
    a: "The services are not available to persons under the age of 17 or to anyone previously suspended or removed from the services by Indian Railways. By accepting the Terms & Conditions or by otherwise using the Services or the Site, you represent that You are at least 17 years of age and have not been previously suspended or removed from the Services. You represent and warrant that you have the right, authority, and capacity to enter into this Agreement and to abide by all the terms and conditions of this Agreement. You shall not impersonate any person or entity, or falsely state or otherwise misrepresent identity, age or affiliation with any person or entity.",
  },
  {
    q: "How to download the utsonmobile application?",
    a: "The Android version of the application can be downloaded from Google Play Store. The Windows version of the application can be downloaded from the Windows Store and the iOS version can be downloaded from the Apple store.  The application is free to download.",
  },
  {
    q: "What are the pre-requisites to avail the utsonmobile application service?",
    a: "The passenger should have Android/Windows/iPhone smartphone only. The phone should have minimum GPRS connectivity to use the services. The passenger should have money in their Railway Wallet (R-Wallet) or use Net-banking/Debit/Credit card facility. In order to book paperless tickets, the smart phone should be GPS enabled.",
  },
  {
    q: "Is it mandatory to register for using the utsonmobile system?",
    a: "Yes, it is mandatory to register.",
  },
  {
    q: "Where to do registration?",
    a: "Registration can be done through mobile phone application or website (https://www.utsonmobile.indianrail.gov.in). The passenger first will get registered by providing his/her mobile number, name, password, gender and date of birth. After successful registration, an SMS will be sent to the user with login-id and password and zero-balance R-Wallet will be created without any additional cost.",
  },
  {
    q: "Is it necessary to top up the inbuilt R-Wallet?",
    a: "No, it is not mandatory to top-up the R-Wallet. The application is integrated with the other payment options like Net-banking/Debit card/Credit card/UPI/Wallets through Paytm, MobiKwik , FreeCharge payment aggregators.",
  },
  {
    q: "Can a ticket be booked inside the station premises?",
    a: "According to the Railway commercial rule, a passenger should enter the Railway premises after purchasing the ticket. Hence, booking a ticket using utsonmobile application inside the station premises is not permissible.",
  },
  {
    q: "What are the modes of ticketing through utsonmobile application?",
    a: "The passenger can book either Paperless or Paper mode of ticket. Paperless Ticket: While booking the ticket, the passenger current geo location will be checked using phone GPS and the ticket will be booked if the passenger is not inside the Railway fencing area like station premises and inside the train. The passenger can travel without taking hardcopy of the ticket. The smartphone should be GPS enabled. However, the GPS is not required to book/renew season tickets. Paper Ticket: The passenger can book ticket from anywhere. On successful booking of ticket, the passenger will get Booking ID along with other ticket details as SMS/Notification. The passenger should go to the source station and take print out from the ATVM, CoTVM, OCR machines using the booking ID. The passenger can also approach UTS booking counter to take ticket printout.",
  },
  {
    q: "Is GPS necessary while booking a ticket through utsonmobile application?",
    a: "GPS is necessary to book the ticket in Paperless mode. For Paper based ticket, the usage of GPS is not mandatory.",
  },
  {
    q: "What are the types of ticket that can be bought from the utsonmobile application?",
    a: "Three types of ticket can be bought such as Journey ticket, Season ticket and Platform ticket (both Paperless and Paper based).",
  },
  {
    q: "Is it necessary to take the print out of the ticket?",
    a: "• For Paperless mode, the print of the ticket is not required and not allowed. • For Paper based ticket, the print of the ticket is mandatory and travel without printed ticket will enforce penalty.",
  },
  {
    q: "How to take the print out of the paper based ticket?",
    a: "The passenger should go to the source station and take print out from the ATVM, CoTVM, OCR machines using the booking ID. The passenger can also approach UTS booking counter to take ticket printout. Travel without printed ticket will enforce penalty.",
  },
  {
    q: "What to do if my paper ticket is not printed at the ATVM/CoTVM/OCR machines?",
    a: "Immediately contact the booking office supervisor or call Railway customer care.",
  },
  {
    q: "Is paperless Season ticket is valid from the same day of booking?",
    a: "No. It is valid only from the next day of booking.",
  },
  {
    q: "How to book paperless ticket without any hassle?",
    a: "a. Check your phone GPS is enabled. b. Check your R-wallet balance for sufficient money or use other payment options. c. Book your ticket before entering the station premises.",
  },
  {
    q: "What to do if my paperless ticket is not booked, but money got deducted?",
    a: "a. Click the 'Show Booked Ticket' button available in the Main screen. b. If the ticket is not visible, then call customer care. In case money is deducted and ticket not booked, then the money will be refund automatically to your account after 7 days.",
  },
  {
    q: "How to cancel a mobile ticket?",
    a: "• Paperless ticket is not allowed for cancellation. • Paper ticket may be cancelled in the following method 1. The cancellation of ticket through mobile application is allowed only if the ticket is not printed at the kiosk. 2. Once, the ticket is printed at the kiosk, and then cancellation is allowed only at the UTS counter within one hour after printout. In both cancellation method, there will not be any cash refund at the time of cancellation. The refund amount after deduction of clerkage charge, if any, will be automatically topped up in the user R-Wallet or will be refunded to customers account.",
  },
  {
    q: "How to show the paperless ticket to the TTE?",
    a: "• Without login, use 'SHOW BOOKED TICKET' option available in the login screen or • After login, use SHOW BOOKED TICKET option available in the main menu.",
  },
  {
    q: "Whether 'SHOW BOOKED TICKET' option works in offline mode?",
    a: "Yes, 'SHOW BOOKED TICKET' option work in the offline mode (i.e without internet)",
  },
  {
    q: "How long will my paperless platform ticket be valid?",
    a: "According to Railway rules platform ticket is valid for two hours from the time of booking.",
  },
  {
    q: "What is the validity of paperless Season Ticket?",
    a: "1. The fresh paperless season ticket will be Valid from the next day. 2. In case of advance renewal of season ticket, the new validity period logic is as follow i. In case the season ticket validity period is active, then the new validity period will be effective from existing validity period plus one day. ii. In case the season ticket validity period is expired, then the new validity period will be from next day (i.e. current date plus one).",
  },
  {
    q: "What if the mobile handset battery is down during the journey?",
    a: "If the passenger is unable to show a paperless ticket to (Train Ticket Examiner) TTE due to the mobile battery drained out, then the travel of the passenger would be treated as a ticketless travel and penalty will be imposed.",
  },
  {
    q: "What if the mobile handset is lost during the journey?",
    a: "The travel of the passenger would be treated as a ticketless travel and penalty will be imposed.",
  },
  {
    q: "What is the procedure to change the mobile handset?",
    a: "To restrict the duplication of UTS ticket, Application was designed in a way to show active ticket(s) on one mobile device a time by binding ticket with device IMEI number. Process to change mobile handset 1) If user is not having active ticket(s) User can change handset using CHANGE HANDSET option available in UTS application or from https://www.utsonmobile.indianrail.gov.in website. 2) If user is having active tickets(s) a) If user wants to change handset= One can change the handset only once in a month (i.e. after 30/31 days) in case of having active ticket. The steps to change the mobile handset is as follows= 1. User has to initiate the change handset (IMEI) request from the existing mobile device. 2. User can download the application in the new mobile device. 3. User login to the application using their credential. 4. User will use the sync ticket option to re-sync the ticket to the new mobile. 5. All the ticket will be bound to the new mobile handset. b) Mobile Handset is lost= User should give request to CCM/PM office of the concern Railway along with following documents= 1. Copy of the FIR/CSR 2. Copy of the Duplicate SIM CARD request letter given to Mobile Network Operator c) Mobile Handset is non-repairable= User should give request to CCM/PM office of the concern Railway along with following documents= 1. Copy of the letter from the dealer or service center saying that the mobile is non repairable. 2. Copy of the Duplicate SIM CARD request letter given to Mobile Network Operator",
  },
  {
    q: "Can a R-Wallet account be reactivated once surrendered?",
    a: "Yes, the surrendered R-Wallet can be reactivated having zero balance within 3 months from the date of surrender. Beyond three months, the passenger has to take specific permission of the Railway for reactivation.",
  },
  {
    q: "Can an active ticket be recovered once a passenger changes the handset?",
    a: "Yes, ticket can be recovered by using change handset option. One can change the handset only once in a month (i.e. after 30/31 days) in case of having active ticket. The steps to change the mobile handset is as follows= •  User has to initiate the change handset (IMEI) request from the existing mobile device. •  User can download the application in the new mobile device. •  User login to the application using their credential. •  User will use the sync ticket option to re-sync the ticket to the new mobile. •  All the ticket will be bound to the new mobile handset.",
  },
  {
    q: "How to change password?",
    a: "The password can be changed by using the Change password option available in the mobile application or website.",
  },
  {
    q: "How to reset the password?",
    a: "The user can reset his/her password in case it is forgotten by using 'Forgot Password' option available on the mobile application as well as website",
  },
  {
    q: "What is a R-Wallet?",
    a: "R-Wallet is closed wallet of Indian Railways. Being a closed wallet, all the rules of RBI for Closed Wallet will apply to this wallet also. The R-Wallet with zero-balance will be created without any additional cost upon successful registration by the passenger. The minimum recharge value is Rs.100 and multiples of Rs.100 which can grow up to Rs. 10000/-.The maximum stored-value amount in this R-Wallet is Rs.10000. Currently, there is 5% bonus on every R-Wallet recharge (for limited period only).",
  },
  {
    q: "How to Recharge R-Wallet?",
    a: "R-Wallet will be issued with zero balance to all the users upon successful registration in the system either through utsonmobile mobile applications or website (https://www.utsonmobile.indianrail.gov.in). The user can recharge their R-Wallet at the UTS counters available in the Suburban Railway Stations or through the website (https://www.utsonmobile.indianrail.gov.in). Currently, there is 5% bonus on every R-Wallet recharge (for limited period only).",
  },
  {
    q: "How to check the R-Wallet balance?",
    a: "The user can check the balance of R-Wallet either in the UTS mobile applications or in the website (https://www.utsonmobile.indianrail.gov.in).",
  },
  {
    q: "How to surrender my R-Wallet?",
    a: "The passenger has to initiate the surrender R-Wallet request from the mobile application and he/she will get a secret code as SMS. The passenger has to go to the Railway Station and show the secret code to the booking operator and get the cash refund after deducting the clerkage amount. However, the surrender policy will change time to time.",
  },
  {
    q: "How to Block my R-Wallet?",
    a: "The user is allowed to block the usage of R-Wallet through Helpline number (listed below) by giving user credentials. Once, it is blocked, then they cannot reuse it and no cash refund will be given for the left out money available in their R-Wallet.",
  },
  {
    q: "Why can't I get GPS signal?",
    a: "The GPS signals may be very poor in the place from where you are booking (closed area/inside building) or your phone accuracy may not be good enough to meet the app requirement. We may also check the Location Settings in your phone for High Accuracy mode.",
  },
  {
    q: "How to revert a Wallet Surrender request?",
    a: "If you have mistakenly surrendered your wallet and again want to use it, then you can call the customer care number for your city and request for the same. However once refund has been collected from the railway counter no further reversion will be possible.",
  },
  {
    q: "Why syncing process taking more time?",
    a: "1. UTS application is designed in such a way that user's internet usage can be minimized during ticket booking by bundling list of all released stations within application. 2. Application will only sync stations in case of addition of new stations when ticketing in new zones are enabled or if there is any modification/correction in station names. ",
  },
  {
    q: "What are the payment options for ticket booking/R-Wallet recharge? Are we paying any extra charges to aggregators (PayTm, MobiKwik, FreeCharge)?",
    a: "User can do payment to book ticket using two payment options i.e. R-WALLET and OTHERS. There are no transaction charges if user pays using R-WALLET. To promote digital transactions, Indian Railway is giving 5% bonus on recharging R-WALLET online.For OTHERS payment mode, UTS application is integrated with three payment aggregators i.e Paytm, Mobikwik and Freecharge through which application user can pay by using different debit cards, credit cards, internet-banking, UPI and different wallets. However, no extra charges are paid to payment aggregators i.e. Paytm, Mobikwik and Freecharge. Current charges applicable=- • Debit card - No charges (below 2000) & 0.9% + G.S.T(above 2000). • UPI - No charges (below 2000) & 0.65% + G.S.T(above 2000). • Netbanking - 1.8% + GST • Credit Card - 1.8% + GST • Credit Card - 1.8% + GST",
  },
  {
    q: "Why I am not able to save paperless ticket in my phone? Can ticket be shown without mobile network?",
    a: "• Unlike IRCTC ticket, UTS ticket is not linked with any berth and can be duplicated easily. Permission to save the ticket is restricted to avoid duplication of ticket. • UTS application is having SHOW TICKET option in Login screen to show active ticket(s) without depending on network connectivity.",
  },
  {
    q: "Can I allowed to book inter-zonal ticketing?",
    a: "Yes, you can book ticket for inter-zonal railway stations. It has been enabled from 1st November 2018.",
  },
  {
    q: "Why transactions are failed and delay in refund of money?",
    a: "Money got deducted, ticket not booked Case= It depends on various points like user mobile device connectivity, server issues, multiple hops, link down etc. Delayed Refund Case= Refund process is an elaborate and well-defined mechanism to ensure correct amount is refunded to right account. This involves authentication and verification at each stage i.e. Payment gateway, aggregators, card companies, acquiring bank, issuing bank and customer account etc. It takes 7-12 working days and in cases of transaction failures, money is refunded. Multiple payment handlers involves in the payment/refund process.",
  },
  {
    q: "What are the helpline numbers and mail ids?",
    a: "List of helpline numbers and mail ids are available in helpline option available in login screen of UTS application and 'Contact Us' option available in utsonmobile website=https://www.utsonmobile.indianrail.gov.in/RDS/policy/contactUs.",
  },
  {
    q: "Can I check my Ticket Booking History in application?",
    a: "User can check booked ticket history using BOOKING HISTORY option available in UTS application. Snapshot of the same is given below:",
  },
];

const FAQModal = ({ open, onClose }) => {
  const [tab, setTab] = useState(0); // 0 = General, 1 = UTS
  const [openIndexes, setOpenIndexes] = useState({ general: null, uts: null });

  if (!open) return null;

  // Toggle answer visibility
  const handleToggle = (type, idx) => {
    setOpenIndexes((prev) => ({
      ...prev,
      [type]: prev[type] === idx ? null : idx,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm ">
      <div className="bg-white rounded-2xl shadow-2xl w-[95vw] max-w-2xl relative">
        <button
          type="button"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/80 hover:bg-gray-200/50 text-gray-600 hover:text-gray-800 transition-colors"
          onClick={onClose}
        >
          ×
        </button>
        <div className="modalHeader px-6 pt-6 pb-1 mb-2 bg-gray-300 rounded-t-2xl">
          <h2 className="faqL text-2xl font-bold text-black mb-2">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="modal-body px-6 pb-6 max-h-[80vh] rounded-b-2xl">
          <div className="flex gap-2 mb-4 ">
            <button
              className={`px-4 py-2 font-semibold rounded ${
                tab === 0
                  ? "bg-[#930b3e] text-white"
                  : "bg-gray-100 text-[#930b3e]"
              }`}
              onClick={() => setTab(0)}
            >
              General FAQs
            </button>
            <button
              className={`px-4 py-2 font-semibold rounded-t-lg ${
                tab === 1
                  ? "bg-[#930b3e] text-white"
                  : "bg-gray-100 text-[#930b3e]"
              }`}
              onClick={() => setTab(1)}
            >
              UTS FAQs
            </button>
          </div>
          <div className="tab-content max-h-[60vh] overflow-y-auto">
            {tab === 0 && (
              <div id="generalFAQs" className="faqs">
                <div id="faqlist">
                  {generalFaqs.map((faq, idx) => {
                    const isOpen = openIndexes.general === idx;
                    return (
                      <div key={idx} className="mb-2">
                        <div
                          className={`rounded-lg transition-colors duration-200 ${
                            isOpen ? "bg-gray-100" : "bg-transparent"
                          } px-4 py-3`}
                        >
                          <div
                            className="flex items-center justify-between text-black cursor-pointer select-none"
                            onClick={() => handleToggle("general", idx)}
                          >
                            <span className="">
                              <span className="font-bold">Que{idx + 1}: </span>
                              <span className="">{faq.q}</span>
                            </span>
                            <span
                              className={`ml-2 transition-transform text-black ${
                                isOpen ? "-rotate-90" : ""
                              }`}
                              style={{ fontSize: 15 }}
                              aria-hidden="true"
                            >
                              ▼
                            </span>
                          </div>
                          {isOpen && (
                            <div className="mt-2 text-sm">
                              <span className="font-bold ">Ans:</span>{" "}
                              <span className="">{faq.a}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {tab === 1 && (
              <div id="UTSFAQs" className="faqs">
                <div id="faqutslist">
                  {utsFaqs.map((faq, idx) => {
                    const isOpen = openIndexes.uts === idx;
                    return (
                      <div key={idx} className="mb-2">
                        <div
                          className={`rounded-lg transition-colors duration-200 ${
                            isOpen ? "bg-gray-100" : "bg-transparent"
                          } px-4 py-3`}
                        >
                          <div
                            className="flex items-center justify-between text-black cursor-pointer select-none"
                            onClick={() => handleToggle("uts", idx)}
                          >
                            <span>
                              <span className="font-bold">Que{idx + 1}: </span>
                              <span className="">{faq.q}</span>
                            </span>
                            <span
                              className={`ml-2 transition-transform text-black ${
                                isOpen ? "-rotate-90" : ""
                              }`}
                              style={{ fontSize: 15 }}
                              aria-hidden="true"
                            >
                              ▼
                            </span>
                          </div>
                          {isOpen && (
                            <div className="mt-2 text-sm">
                              <span className="font-bold">Ans:</span>{" "}
                              <span className="">{faq.a}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQModal;
