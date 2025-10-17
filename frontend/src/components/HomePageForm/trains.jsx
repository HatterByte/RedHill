import React, { useState, useEffect } from "react";
import data from "../../assets/categoryData.json";
import RecaptchaButton from "../../utils/Recaptcha.jsx";
import { connect, useDispatch } from "react-redux";
import { generateOtp, verifyOtp } from "../../actions/auth.actions";
import { getUser } from "../../actions/auth.actions";
import ReCAPTCHA from "react-google-recaptcha";
import { axiosInstance } from "../../utils/axios";
import { useGlobalAlert } from "../../utils/AlertContext";
import QRCodeModal from "./QRCodeModal";

const Trains = (props) => {
  const dispatch = useDispatch();
  const { showAlert } = useGlobalAlert();
  const [disabled, setDisabled] = useState(true);
  const [toggle, setToggle] = useState(false);
  const [otp, setOtp] = useState("");
  const [masterOtp, setMasterOtp] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [registeredComplaint, setRegisteredComplaint] = useState(null);
  const [formData, setFormData] = useState({
    phone: "",
    pnr: "",
    type: "",
    subtype: "",
    media: [],
    description: "",
  });
  const [showQRModal, setShowQRModal] = useState(false);
  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    return value;
  };
  function handleGenerateOTP() {
    if (formData.phone.length !== 10) {
      showAlert("Enter a valid Phone", "warning");
      return;
    }
    dispatch(generateOtp(formData.phone));
  }
  const check = async () => {
    if (otp.length !== 6) {
      showAlert("Enter a valid OTP", "warning");
      return;
    }
    await dispatch(verifyOtp(formData.phone, otp));
    // Fetch user info after OTP login
    dispatch(getUser());
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    const updatedFiles = [...formData.media, ...newFiles].slice(0, 5);
    console.log(updatedFiles);
    setFormData({ ...formData, media: updatedFiles });
  };

  const removeFile = (indexToRemove, e) => {
    e.preventDefault();
    console.log(indexToRemove);
    // const arr=(files.filter((_, index) => index !== indexToRemove))
    setFormData({
      ...formData,
      media: formData.media.filter((_, index) => index !== indexToRemove),
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let phoneToSend = formData.phone;
    if (
      props.auth.isAuthenticated &&
      props.auth.user &&
      props.auth.user.phone
    ) {
      phoneToSend = props.auth.user.phone;
    }

    // Validate required fields
    if (!formData.pnr) {
      showAlert("PNR is required", "warning");
      return;
    }
    if (formData.pnr.length !== 10) {
      showAlert("PNR must be exactly 10 digits", "warning");
      return;
    }
    if (!phoneToSend) {
      showAlert("Phone number is required", "warning");
      return;
    }
    if (
      !formData.description &&
      formData.media.length === 0 &&
      (!formData.type || !formData.subtype)
    ) {
      showAlert(
        "Please provide either description, media, or type and subtype",
        "warning"
      );
      return;
    }

    try {
      // Upload media files and get URLs
      let mediaLinks = [];
      if (formData.media.length > 0) {
        const uploadUrl = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
        for (const file of formData.media) {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", uploadPreset);
          let resourceType = "auto";
          if (file.type.startsWith("video/")) resourceType = "video";
          if (file.type.startsWith("audio/")) resourceType = "video";
          const uploadEndpoint =
            resourceType === "auto"
              ? uploadUrl
              : uploadUrl.replace("/image/upload", `/${resourceType}/upload`);
          const res = await fetch(uploadEndpoint, {
            method: "POST",
            body: data,
          });
          const fileRes = await res.json();
          if (fileRes.secure_url) {
            mediaLinks.push(fileRes.secure_url);
          }
        }
      }

      // Send complaint registration request
      const response = await axiosInstance.post("/complaints/register", {
        pnr: formData.pnr,
        phone: phoneToSend,
        type: formData.type,
        subtype: formData.subtype,
        description: formData.description,
        media: mediaLinks,
      });

      const result = response.data;
      if (result.success) {
        // If no type/subtype was provided but AI predicted them, show update modal
        if (
          (!formData.type || !formData.subtype) &&
          result.type &&
          result.subtype
        ) {
          console.log("Backend returned type/subtype:", { type: result.type, subtype: result.subtype });
          console.log("Available types in categoryData:", Object.keys(data));
          setRegisteredComplaint({
            id: result.id,
            type: result.type,
            subtype: result.subtype,
          });
          setShowUpdateModal(true);
        }

        showAlert(
          "Complaint registered successfully! Your Complaint ID: " + result.id,
          "success"
        );
        setFormData({
          phone: "",
          pnr: "",
          type: "",
          subtype: "",
          media: [],
          description: "",
        });
      } else {
        showAlert(result.message || "Failed to register complaint.", "error");
      }
    } catch (error) {
      showAlert("Error submitting complaint: " + error.message, "error");
    }
  };

  const handleUpdateComplaint = async (newType, newSubtype) => {
    if (!registeredComplaint) return;

    try {
      const response = await axiosInstance.put(
        `/complaints/${registeredComplaint.id}`,
        {
          type: newType,
          subtype: newSubtype,
        }
      );

      if (response.data.success) {
        showAlert("Complaint type updated successfully!", "success");
      } else {
        showAlert(
          response.data.message || "Failed to update complaint type.",
          "error"
        );
      }
    } catch (error) {
      showAlert("Error updating complaint: " + error.message, "error");
    } finally {
      setShowUpdateModal(false);
      setRegisteredComplaint(null);
    }
  };

  // if (props.auth.loading) {
  //     return (
  //         <>Loading...</>
  //     )
  // }
  useEffect(() => {
    if (props.auth.isAuthenticated) {
      setDisabled(false);
    } else {
      if (disabled === false) {
        setFormData({
          phone: "",
          pnr: "",
          type: "",
          subtype: "",
          media: [],
          description: "",
        });
        setOtp("");
      }
      setDisabled(true);
    }
  }, [props.auth]);
  useEffect(() => {
    if (props.otp.otpGenerated) {
      setToggle(true);
    }
  }, [props.otp]);

  return (
    <>
      {/* Show user name after login */}
      {props.auth.isAuthenticated && props.auth.user && (
        <div className="mb-4 text-lg font-semibold text-[#75002b]">
          Welcome, {props.auth.user.name || props.auth.user.phone}!
        </div>
      )}
      <div className="topBar flex flex-row w-full justify-between border-b-[1px] border-[#d9d9d9] pb-2 h-12">
        <h2 className="text-[#930b3e] text-2xl font-bold">Grievance Detail</h2>
        <div className="flex gap-0.5">
          <span className="text-[#f05f40]">*</span>
          <span className="text-xl">Mandatory Fields</span>
        </div>
      </div>
      {disabled && (
        <form
          className="PhoneNumber mt-5"
          onSubmit={(e) => {
            e.preventDefault();
            check();
          }}
        >
          <div className="flex gap-0.5">
            <div className="text-[#7c7c7c] text-lg font-medium">Mobile No.</div>
            <span className="text-[#f05f40]">*</span>
          </div>
          <div className="flex gap-4 mt-1 flex-wrap">
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: handleChange(e) });
              }}
              className="w-full sm:w-4/9 border-[1px] h-13 border-[#d9d9d9] p-2 text-xl sm:text-2xl flex items-center bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb]"
            />
            {!toggle && (
              <>
                <button
                  type="button"
                  className="w-full sm:w-28 h-13 text-white p-2 rounded-lg cursor-pointer bg-[#75002b] hover:bg-[#f58220] transition-all duration-500 ease-in-out"
                  onClick={(e) => {
                    e.preventDefault();
                    handleGenerateOTP();
                  }}
                >
                  Send OTP
                </button>
                <button
                  type="button"
                  className="w-full sm:w-12 h-13 ml-2 flex items-center justify-center bg-[#e1e1e1] hover:bg-[#f58220] rounded-lg transition-all duration-500 ease-in-out"
                  title="Start Telegram Bot"
                  onClick={() => setShowQRModal(true)}
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
              </>
            )}
          </div>
          {toggle && (
            <>
              <div className="flex gap-0.5">
                <div className="text-[#7c7c7c] text-lg font-medium">OTP</div>
                <span className="text-[#f05f40]">*</span>
              </div>
              <div className="flex gap-2 sm:gap-15 mt-1 flex-wrap">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={otp}
                  onChange={(e) => {
                    setOtp(handleChange(e));
                  }}
                  className="w-full sm:w-2/9 border-[1px] h-13 border-[#d9d9d9] p-2 text-xl sm:text-2xl flex items-center bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb]"
                />

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="submit"
                    className={`flex-1 sm:flex-none sm:w-28 h-13 text-white p-2 rounded-lg cursor-pointer bg-[#75002b] hover:bg-[#f58220] transition-all duration-500 ease-in-out ${
                      otp.length != 6 ? "opacity-[0.6]" : ""
                    }`}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className={`flex-1 sm:flex-none sm:w-40 h-13 text-white p-2 rounded-lg cursor-pointer bg-[#75002b] hover:bg-[#f58220] transition-all duration-500 ease-in-out`}
                    onClick={(e) => {
                      e.preventDefault();
                      generateOTP();
                    }}
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      )}

      <form
        className={`mt-6 relative ${disabled ? "opacity-[0.6]" : ""}`}
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        {disabled && (
          <>
            <div className="h-full w-full z-2 bg-black opacity-0 absolute"></div>
          </>
        )}
        <div className="w-full">
          <div className="flex gap-0.5">
            <div className="text-[#7c7c7c] text-lg font-medium">PNR No.</div>
            <span className="text-[#f05f40]">*</span>
          </div>
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            value={formData.pnr}
            onChange={(e) => {
              setFormData({ ...formData, pnr: handleChange(e) });
            }}
            className="w-full sm:w-4/9 border-[1px] h-13 border-[#d9d9d9] p-2 text-xl sm:text-2xl flex items-center bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb]"
          />
        </div>
        <div className="w-full flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
          <div className="w-full sm:w-[48%] mt-3">
            <div className="flex gap-0.5">
              <div className="text-[#7c7c7c] text-lg font-medium">Type</div>
            </div>

            <select
              className={`w-full border-[1px] h-13 border-[#d9d9d9] p-2 text-xl  bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb] mt-1`}
              value={formData.type}
              onChange={(e) => {
                setFormData({ ...formData, type: e.target.value, subtype: "" });
              }}
            >
              <option value="" disabled className="text-[#7c7c7c]">
                --select--
              </option>
              {Object.keys(data).map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div
            className={`w-full sm:w-[48%] mt-3 relative ${
              !disabled && !formData.type ? "opacity-[0.6]" : ""
            }`}
          >
            {!disabled && !formData.type && (
              <div className="h-full w-full z-2 bg-black opacity-0 absolute"></div>
            )}
            <div className="flex gap-0.5">
              <div className="text-[#7c7c7c] text-lg font-medium">Sub-Type</div>
            </div>

            <select
              className="w-full border-[1px] h-13 border-[#d9d9d9] p-2 text-xl  bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb] mt-1"
              value={formData.subtype}
              onChange={(e) => {
                setFormData({ ...formData, subtype: e.target.value });
              }}
            >
              <option value="" disabled>
                --select--
              </option>
              {formData.type &&
                data[formData.type].map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="border-[1px] min-h-13 border-[#d9d9d9] text-xl bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb] p-2 w-full sm:w-5/9 mt-6">
          {formData.media.length === 0 ? (
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-gray-500">Select files</span>
              <button
                type="button"
                className="w-full sm:w-25 h-13 cursor-pointer relative rounded-md transition-colors bg-[#b4b4b4] text-[#fff] hover:bg-[#75002b]"
              >
                Browse
                <input
                  type="file"
                  className="absolute w-full h-full z-1 left-0 top-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.mp4,.mp3,.wav,.aac,.ogg,.m4a,.wma,.flac"
                  multiple
                />
              </button>
            </div>
          ) : (
            <div>
              <div className="space-y-2">
                {formData.media.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
                  >
                    <span className="truncate max-w-[70%]">{file.name}</span>
                    <button
                      onClick={(e) => removeFile(index, e)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              {formData.media.length < 5 && (
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-gray-500">Add more</span>
                  <button
                    type="button"
                    className="bg-[#b4b4b4] text-[#fff]  hover:bg-[#75002b] text-center w-25 h-13 cursor-pointer relative rounded-md  transition-colors"
                  >
                    Browse
                    <input
                      type="file"
                      className="absolute  w-25 h-13 z-1 opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png,.mp4,.mp3,.wav,.aac,.ogg,.m4a,.wma,.flac"
                      multiple
                    />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-full mt-4">
          <div className="flex gap-0.5">
            <div className="text-[#7c7c7c] text-lg font-medium">
              Grievance Description
            </div>
          </div>
          <textarea
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
            }}
            className="w-full border-[1px] h-40 border-[#d9d9d9] p-2 flex items-center  bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb] mt-1"
            placeholder="Describe your issue.."
          />
        </div>

        <div className="text-[#7c7c7c] text-sm mt-4">
          {`Note: special characters {! @ # $ ^ : ; & + = ₹ ÷ , * % "} are not permitted`}
          <br />
          {`To submit the grievance, please enter one of the following : (a) type and subtype (b) Media (c) Description`}
        </div>

        <div className="flex w-full flex-col sm:flex-row justify-end items-center gap-4 mt-10">
          <ReCAPTCHA
            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            onChange={(e) => {
              console.log(e);
            }}
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="submit"
              className="flex-1 sm:flex-none sm:w-28 h-13 text-white p-2 rounded-lg cursor-pointer bg-[#75002b] hover:bg-[#f58220] transition-all duration-500 ease-in-out"
            >
              Submit
            </button>
            <button
              type="button"
              className="flex-1 sm:flex-none sm:w-28 h-13 text-white p-2 rounded-lg cursor-pointer bg-[#75002b] hover:bg-[#f58220] transition-all duration-500 ease-in-out"
              onClick={(e) => {
                e.preventDefault();
                setFormData({
                  phone: "",
                  pnr: "",
                  type: "",
                  subtype: "",
                  media: [],
                  description: "",
                });
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      {/* Update type modal component */}
      <UpdateTypeModal
        show={showUpdateModal}
        initialType={registeredComplaint?.type}
        initialSubtype={registeredComplaint?.subtype}
        allTypes={data}
        onConfirm={handleUpdateComplaint}
        onCancel={() => {
          setShowUpdateModal(false);
          setRegisteredComplaint(null);
        }}
      />

      {/* QR Code Modal */}
      {showQRModal && (
        <QRCodeModal
          show={showQRModal}
          onClose={() => setShowQRModal(false)}
          url={import.meta.env.VITE_OTP_ACTIVATION_URL}
          title="Start Telegram Bot"
        />
      )}
    </>
  );
};

const UpdateTypeModal = ({
  show,
  initialType,
  initialSubtype,
  allTypes,
  onConfirm,
  onCancel,
}) => {
  const [selectedType, setSelectedType] = useState(initialType || "");
  const [selectedSubtype, setSelectedSubtype] = useState(initialSubtype || "");

  // Update state when initial values change
  useEffect(() => {
    console.log("UpdateTypeModal received:", { initialType, initialSubtype, allTypes: Object.keys(allTypes || {}) });
    if (initialType) {
      setSelectedType(initialType);
    }
    if (initialSubtype) {
      setSelectedSubtype(initialSubtype);
    }
  }, [initialType, initialSubtype]);

  if (!show) return null;

  console.log("Modal rendering with:", { selectedType, selectedSubtype, allTypesKeys: Object.keys(allTypes || {}) });

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center">
      <div className="bg-white/95 p-6 rounded-lg shadow-xl max-w-md w-full border border-gray-200">
        <h3 className="text-xl font-semibold text-[#75002b] mb-4">
          Review Complaint Type
        </h3>
        <div className="mb-4">
          <p className="text-gray-700 mb-4">
            Based on your description/media, we've categorized your complaint.
            You can review and adjust if needed:
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-[#7c7c7c] text-lg font-medium block mb-2">
                Type
              </label>
              <select
                className="w-full border-[1px] h-13 border-[#d9d9d9] p-2 text-xl bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb]"
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setSelectedSubtype("");
                }}
              >
                <option value="" disabled>
                  --select--
                </option>
                {Object.keys(allTypes).map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[#7c7c7c] text-lg font-medium block mb-2">
                Sub-Type
              </label>
              <select
                className="w-full border-[1px] h-13 border-[#d9d9d9] p-2 text-xl bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb]"
                value={selectedSubtype}
                onChange={(e) => setSelectedSubtype(e.target.value)}
              >
                <option value="" disabled>
                  --select--
                </option>
                {selectedType &&
                  allTypes[selectedType]?.map((subtype, index) => (
                    <option key={index} value={subtype}>
                      {subtype}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={() => onConfirm(selectedType, selectedSubtype)}
            className="px-4 py-2 bg-[#75002b] text-white rounded hover:bg-[#f58220] transition-all duration-500 ease-in-out"
            disabled={!selectedType || !selectedSubtype}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    otp: state.otp,
  };
};

export default connect(mapStateToProps)(Trains);
