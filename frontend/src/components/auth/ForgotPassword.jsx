import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { generateOtp } from "../../actions/auth.actions";
import { useDispatch } from "react-redux";

const ForgotPassword = ({ formData, setFormData, setPage, reset }) => {
  const dispatch = useDispatch();
  const [verified, setVerified] = useState(false);

  const handleChangeTruncate = (e) => e.target.value.replace(/\D/g, "");

  const handleGenerateOTP = () => {
    if (!formData.phone || formData.phone.length !== 10) {
      alert("Please enter a valid phone number.");
      return;
    }
    dispatch(generateOtp(formData.phone));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.phone || formData.phone.length !== 10) {
      alert("Please enter a valid phone number.");
      return;
    }
    if (!formData.otp || formData.otp.length !== 6) {
      alert("Please enter a valid OTP.");
      return;
    }
    if (!verified) {
      alert("Please verify the reCAPTCHA.");
      return;
    }
    // Dispatch your password reset logic here
    console.log("Reset password for:", formData.phone);
  };

  return (
    <form className="h-full" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-y-4 mt-6">
        <input
          type="tel"
          inputMode="numeric"
          pattern="\d*"
          value={formData.phone}
          required
          onChange={(e) => {
            const phone = handleChangeTruncate(e);
            setFormData((prev) => ({ ...prev, phone }));
          }}
          placeholder="Phone Number"
          className="input"
        />

        <button
          type="button"
          className="btn-primary"
          onClick={handleGenerateOTP}
        >
          Generate OTP
        </button>

        <input
          type="text"
          inputMode="numeric"
          value={formData.otp}
          required
          onChange={(e) =>
            setFormData({ ...formData, otp: handleChangeTruncate(e) })
          }
          placeholder="OTP"
          className="input"
        />

        <ReCAPTCHA
          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
          onChange={() => setVerified(true)}
        />

        <button type="submit" className="btn-primary mt-4">
          Submit
        </button>

        <span
          className="text-[11px] font-medium cursor-pointer hover:underline text-[#444] text-end"
          onClick={reset}
        >
          Go Back
        </span>
      </div>
    </form>
  );
};

export default ForgotPassword;
