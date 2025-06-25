import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux";
import { generateOtp, signUp } from "../../actions/auth.actions";

const CreateAccount = ({ reset }) => {
  const dispatch = useDispatch();

  const [verified, setVerified] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    phone: "",
    otp: "",
  });

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
    if (formData.phone.length !== 10) {
      alert("Please enter a valid phone number.");
      return;
    }
    if (formData.password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (formData.otp.length !== 6) {
      alert("Please enter a valid OTP.");
      return;
    }
    if (!verified) {
      alert("Please verify the reCAPTCHA.");
      return;
    }
    dispatch(signUp(formData.name, formData.phone, formData.password, formData.otp));
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
        onChange={(e) => setFormData({ ...formData, phone: handleChangeTruncate(e) })}
        placeholder="Phone Number"
        className="input"
      />

      <button
        type="button"
        onClick={handleGenerateOTP}
        className="btn-primary"
      >
        Generate OTP
      </button>

      <input
        type="text"
        inputMode="numeric"
        required
        value={formData.otp}
        onChange={(e) => setFormData({ ...formData, otp: handleChangeTruncate(e) })}
        placeholder="OTP"
        className="input"
      />

      <div>
        <ReCAPTCHA
          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
          onChange={() => setVerified(true)}
        />
      </div>

      <button
        type="submit"
        className="btn-primary mt-6"
      >
        Submit
      </button>
    </form>
  );
};

export default CreateAccount;
