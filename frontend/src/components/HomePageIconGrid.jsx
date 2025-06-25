import React from "react";

const homepageIcons = [
  {
    src: "/assets/HomePageImages/booking-icon-1.png",
    label: (
      <>
        Ticket <br /> Booking
      </>
    ),
  },
  {
    src: "/assets/HomePageImages/booking-icon-2.png",
    label: (
      <>
        Train <br /> Enquiry
      </>
    ),
  },
  {
    src: "/assets/HomePageImages/booking-icon-3.png",
    label: (
      <>
        Reservation <br /> Enquiry
      </>
    ),
  },
  {
    src: "/assets/HomePageImages/booking-icon-4.png",
    label: (
      <>
        Retiring <br /> Room Booking
      </>
    ),
  },
  {
    src: "/assets/HomePageImages/booking-icon-5.png",
    label: (
      <>
        Indian <br /> Railways
      </>
    ),
  },
  {
    src: "/assets/HomePageImages/booking-icon-6.png",
    label: (
      <>
        UTS <br /> eTicketing
      </>
    ),
  },
  {
    src: "/assets/HomePageImages/booking-icon-7.png",
    label: (
      <>
        Freight <br /> Business
      </>
    ),
  },
  {
    src: "/assets/HomePageImages/booking-icon-2.png",
    label: (
      <>
        Railway <br /> Parcel Website
      </>
    ),
  },
];

const HomePageIconGrid = ({ responsiveSize }) => {
  // Use smaller icons and tighter grid for sidebar/compact mode
  const iconSize = responsiveSize === "small" ? 40 : 61;
  const colClass =
    responsiveSize === "small" ? "w-1/2 sm:w-1/3" : "w-1/2 sm:w-1/3";
  const gapClass = responsiveSize === "small" ? "gap-y-1" : "gap-y-2";
  const paddingClass = responsiveSize === "small" ? "p-1" : "p-2";

  return (
    <div className={`flex flex-wrap ${gapClass} w-full justify-center`}>
      {homepageIcons.map((icon, idx) => (
        <div
          key={idx}
          className={`${colClass} flex flex-col items-center justify-center ${paddingClass}`}
        >
          <img
            src={icon.src}
            width={iconSize}
            height={iconSize}
            alt=""
            className="object-contain"
          />
          <div className="text-white text-center mt-1 text-xs sm:text-sm">
            {icon.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomePageIconGrid;
