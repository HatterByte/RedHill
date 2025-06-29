import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux";
import { generateOtp, signUp } from "../../actions/auth.actions";
import { useGlobalAlert } from "../../utils/AlertContext";
import QRCodeModal from "../HomePageForm/QRCodeModal";

const CreateAccount = ({ reset }) => {
  const dispatch = useDispatch();
  const { showAlert } = useGlobalAlert();

  const [verified, setVerified] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    phone: "",
    otp: "",
  });
  const [showQRModal, setShowQRModal] = useState(false);

  const handleChangeTruncate = (e) => e.target.value.replace(/\D/g, "");

  const handleGenerateOTP = () => {
    if (!formData.phone || formData.phone.length !== 10) {
      showAlert("Please enter a valid phone number.", "warning");
      return;
    }
    dispatch(generateOtp(formData.phone));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      showAlert("Please enter a valid phone number.", "warning");
      return;
    }
    if (formData.password !== confirmPassword) {
      showAlert("Passwords do not match.", "warning");
      return;
    }
    if (formData.otp.length !== 6) {
      showAlert("Please enter a valid OTP.", "warning");
      return;
    }
    if (!verified) {
      showAlert("Please verify the reCAPTCHA.", "warning");
      return;
    }
    dispatch(
      signUp(formData.name, formData.phone, formData.password, formData.otp)
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 mt-6">
      <input
        type="text"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
        className="input"
      />

      <input
        type="password"
        required
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
        className="input"
      />

      <input
        type="password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
        className="input"
      />

      <input
        type="tel"
        inputMode="numeric"
        pattern="\d*"
        required
        value={formData.phone}
        onChange={(e) =>
          setFormData({ ...formData, phone: handleChangeTruncate(e) })
        }
        placeholder="Phone Number"
        className="input"
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
      <QRCodeModal
        show={showQRModal}
        onClose={() => setShowQRModal(false)}
        url={import.meta.env.VITE_OTP_ACTIVATION_URL}
        title="Start Telegram Bot"
      />

      <input
        type="text"
        inputMode="numeric"
        required
        value={formData.otp}
        onChange={(e) =>
          setFormData({ ...formData, otp: handleChangeTruncate(e) })
        }
        placeholder="OTP"
        className="input"
      />

      <div>
        <ReCAPTCHA
          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
          onChange={() => setVerified(true)}
        />
      </div>

      <button type="submit" className="btn-primary mt-6">
        Submit
      </button>
    </form>
  );
};

export default CreateAccount;
