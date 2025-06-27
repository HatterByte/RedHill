import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux";
import { loginWithPassword } from "../../actions/auth.actions";
import { useGlobalAlert } from "../../utils/AlertContext";

const LoginWithPassword = ({ formData, setFormData, setPage, reset }) => {
  const dispatch = useDispatch();
  const [verified, setVerified] = useState(false);
  const { showAlert } = useGlobalAlert();

  const handleChangeTruncate = (e) => e.target.value.replace(/\D/g, "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10)
      return showAlert("Invalid phone number.", "warning");
    if (formData.password.length < 6)
      return showAlert("Invalid password.", "warning");
    if (!verified) return showAlert("Please complete reCAPTCHA.", "warning");
    dispatch(loginWithPassword(formData.phone, formData.password));
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

      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className="input"
        required
      />

      <div
        className="text-[#75002b] text-sm text-end cursor-pointer"
        onClick={() => setPage("forgotPassword")}
      >
        Forget Password?
      </div>

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

export default LoginWithPassword;
