import React, { useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const RecaptchaButton = () => {
  return (
    <ReCAPTCHA
    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
    onChange={(e)=>{console.log(e)}}
  />
  );
};

export default RecaptchaButton;
