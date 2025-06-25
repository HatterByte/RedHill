import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux";
import { generateOtp, verifyOtp } from "../../actions/auth.actions";

const LoginWithOtp = ({ reset, formData, setFormData }) => {
  const [verified, setVerified] = useState(false);
  const dispatch = useDispatch();

  const handleChangeTruncate = (e) => e.target.value.replace(/\D/g, "");

  const handleGenerateOTP = () => {
    if (formData.phone.length !== 10) {
      alert("Please enter a valid phone number.");
      return;
    }
    dispatch(generateOtp(formData.phone));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) return alert("Invalid phone number.");
    if (formData.otp.length !== 6) return alert("Invalid OTP.");
    if (!verified) return alert("Please complete reCAPTCHA.");
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

      <button type="button" onClick={handleGenerateOTP} className="btn-primary">
        Generate OTP
      </button>

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
    </form>
  );
};

export default LoginWithOtp;
