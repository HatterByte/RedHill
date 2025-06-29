import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux";
import { generateOtp, verifyOtp } from "../../actions/auth.actions";
import { useGlobalAlert } from "../../utils/AlertContext";
import QRCodeModal from "../HomePageForm/QRCodeModal";

const LoginWithOtp = ({ reset, formData, setFormData }) => {
  const [verified, setVerified] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const dispatch = useDispatch();
  const { showAlert } = useGlobalAlert();

  const handleChangeTruncate = (e) => e.target.value.replace(/\D/g, "");

  const handleGenerateOTP = () => {
    if (formData.phone.length !== 10) {
      showAlert("Please enter a valid phone number.", "warning");
      return;
    }
    dispatch(generateOtp(formData.phone));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10)
      return showAlert("Invalid phone number.", "warning");
    if (formData.otp.length !== 6) return showAlert("Invalid OTP.", "warning");
    if (!verified) return showAlert("Please complete reCAPTCHA.", "warning");
    dispatch(verifyOtp(formData.phone, formData.otp));
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col gap-4 mt-6">
      <input
        type="tel"
        inputMode="numeric"
        pattern="\d*"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={(e) =>
          setFormData({ ...formData, phone: handleChangeTruncate(e) })
        }
        className="input"
        required
      />

      <div className="flex w-full gap-2 items-center">
        <button
          type="button"
          onClick={handleGenerateOTP}
          className="btn-primary flex-1"
        >
          Generate OTP
        </button>
        <button
          type="button"
          className="flex-1 h-10 flex items-center justify-center bg-[#e1e1e1] hover:bg-[#f58220] rounded-lg transition-all duration-500 ease-in-out"
          title="Start Telegram Bot"
          onClick={() => setShowQRModal(true)}
          style={{ minWidth: 40 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-[#75002b]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75V19.5A2.25 2.25 0 006.75 21.75h10.5A2.25 2.25 0 0019.5 19.5V9.75"
            />
          </svg>
        </button>
      </div>

      <input
        type="text"
        inputMode="numeric"
        placeholder="OTP"
        value={formData.otp}
        onChange={(e) =>
          setFormData({ ...formData, otp: handleChangeTruncate(e) })
        }
        className="input"
        required
      />

      <ReCAPTCHA
        sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
        onChange={() => setVerified(true)}
      />

      <button type="submit" className="btn-primary mt-4">
        Submit
      </button>

      <QRCodeModal
        show={showQRModal}
        onClose={() => setShowQRModal(false)}
        url={import.meta.env.VITE_OTP_ACTIVATION_URL}
        title="Start Telegram Bot"
      />
    </form>
  );
};

export default LoginWithOtp;
