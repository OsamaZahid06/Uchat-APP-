
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    dob: "",
    gender: "",
    password: ""
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const verifyEmail = async () => {
    try {
      setOtpLoading(true);

      const res = await api.post("/auth/send-otp", {
        email: form.email
      });

      alert(res.data.message);
      setShowOtpModal(true);
    } catch (error) {
      alert(error.response?.data?.message || "OTP send failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const submitOTP = async () => {
    try {
      const res = await api.post("/auth/verify-otp", {
        email: form.email,
        otp: otp
      });

      alert(res.data.message);
      setEmailVerified(true);
      setShowOtpModal(false);
      setOtp("");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (image) {
        formData.append("profileImage", image);
      }

      const response = await api.post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert(response.data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Signup Failed");
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#ece5dd",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px"
    },
    card: {
      width: "100%",
      maxWidth: "1024px",
      borderRadius: "22px",
      overflow: "hidden",
      boxShadow: "0 22px 60px rgba(0,0,0,0.14)"
    },
    leftPane: {
      background: "linear-gradient(135deg, #075e54 0%, #128c7e 100%)",
      color: "#fff",
      padding: "42px 36px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    },
    leftBadge: {
      width: "60px",
      height: "60px",
      borderRadius: "18px",
      background: "#fff",
      color: "#075e54",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "28px",
      marginBottom: "24px"
    },
    leftTitle: {
      fontSize: "30px",
      lineHeight: 1.1,
      marginBottom: "18px"
    },
    leftText: {
      marginBottom: "28px",
      lineHeight: 1.7,
      opacity: 0.95
    },
    featureRow: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
      marginBottom: "16px"
    },
    featureText: {
      fontSize: "15px",
      lineHeight: 1.6,
      opacity: 0.95
    },
    formPane: {
      background: "#f5f6f7",
      padding: "42px 36px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    },
    avatar: {
      width: "78px",
      height: "78px",
      borderRadius: "22px",
      background: "#25d366",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: "32px",
      margin: "0 auto 18px"
    },
    sectionTitle: {
      fontSize: "28px",
      fontWeight: 700,
      margin: "0 0 8px",
      textAlign: "center"
    },
    sectionSubtitle: {
      color: "#6c757d",
      textAlign: "center",
      marginBottom: "28px"
    },
    inputGroup: {
      borderRadius: "16px",
      overflow: "hidden",
      border: "1px solid #dee2e6",
      background: "#fff",
      boxShadow: "0 6px 16px rgba(0,0,0,0.05)"
    },
    inputAddon: {
      borderColor: "#dde2e6",
      background: "#fff",
      color: "#495057"
    },
    inputControl: {
      border: "none",
      outline: "none",
      background: "transparent"
    },
    otpButton: {
      minWidth: "120px"
    },
    submitButton: {
      borderRadius: "999px",
      padding: "0.95rem 1.15rem"
    },
    footerText: {
      color: "#60656f",
      fontSize: "14px"
    },
    modalBackground: {
      background: "rgba(0,0,0,0.56)"
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="row g-0">
        <div className="col-lg-5" style={styles.leftPane}>
          <div>
            <div style={styles.leftBadge}>
              <i className="bi bi-chat-left-text-fill"></i>
            </div>
            <h2 style={styles.leftTitle}>UChat Web for your browser</h2>
            <p style={styles.leftText}>
              A professional, secure signup experience with a polished interface inspired by WhatsApp Web.
            </p>
            <div style={styles.featureRow}>
              <i className="bi bi-check-circle-fill fs-4"></i>
              <span style={styles.featureText}>Instant account setup</span>
            </div>
            <div style={styles.featureRow}>
              <i className="bi bi-check-circle-fill fs-4"></i>
              <span style={styles.featureText}>Email verification and secure OTP flow</span>
            </div>
            <div style={styles.featureRow}>
              <i className="bi bi-check-circle-fill fs-4"></i>
              <span style={styles.featureText}>Upload a profile photo for your account</span>
            </div>
          </div>
          <div>
            <p style={{ opacity: 0.9, lineHeight: 1.7, marginBottom: 0 }}>
              Build your UChat profile and begin messaging with friends and colleagues faster than ever.
            </p>
          </div>
        </div>

        <div className="col-lg-7" style={styles.formPane}>
          <div>
            <div style={styles.avatar}>
              <i className="bi bi-chat-heart-fill"></i>
            </div>
            <h3 style={styles.sectionTitle}>Create Account</h3>
            <p style={styles.sectionSubtitle}>Sign up for UChat and start connecting with your community.</p>

            <form onSubmit={submitForm}>
              <div className="text-center mb-4">
                <label style={{ cursor: "pointer" }}>
                  {preview ? (
                    <img
                      src={preview}
                      alt="profile"
                      className="rounded-circle"
                      style={{ width: "110px", height: "110px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-white d-flex justify-content-center align-items-center"
                      style={{ width: "110px", height: "110px", boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}
                    >
                      <i className="bi bi-camera fs-1 text-success"></i>
                    </div>
                  )}
                  <input type="file" hidden accept="image/*" onChange={handleImage} />
                </label>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="fname"
                    placeholder="First Name"
                    value={form.fname}
                    onChange={handleChange}
                    required
                    style={styles.inputControl}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lname"
                    placeholder="Last Name"
                    value={form.lname}
                    onChange={handleChange}
                    required
                    style={styles.inputControl}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <div className="input-group" style={styles.inputGroup}>
                    <span className="input-group-text" style={styles.inputAddon}>
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                      disabled={emailVerified}
                      required
                      style={styles.inputControl}
                    />
                    <button
                      type="button"
                      className={emailVerified ? "btn btn-success" : "btn btn-outline-success"}
                      onClick={verifyEmail}
                      disabled={emailVerified || !form.email}
                      style={styles.otpButton}
                    >
                      {emailVerified ? "Verified ✓" : otpLoading ? "Sending..." : "Verify"}
                    </button>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <div className="input-group" style={styles.inputGroup}>
                    <span className="input-group-text" style={styles.inputAddon}>
                      <i className="bi bi-phone"></i>
                    </span>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      placeholder="Phone"
                      value={form.phone}
                      onChange={handleChange}
                      style={styles.inputControl}
                    />
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label">Address</label>
                  <input
                    className="form-control"
                    name="address"
                    placeholder="Address"
                    value={form.address}
                    onChange={handleChange}
                    style={styles.inputControl}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">City</label>
                  <input
                    className="form-control"
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    style={styles.inputControl}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Country</label>
                  <input
                    className="form-control"
                    name="country"
                    placeholder="Country"
                    value={form.country}
                    onChange={handleChange}
                    style={styles.inputControl}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Date Of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    style={styles.inputControl}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    style={styles.inputControl}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">Password</label>
                  <div className="input-group" style={styles.inputGroup}>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      name="password"
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      style={styles.inputControl}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                    </button>
                  </div>
                </div>
              </div>

              {emailVerified && (
                <button className="btn btn-success w-100 mt-4 fw-bold" style={styles.submitButton}>
                  Create Account
                </button>
              )}

              <div className="text-center mt-3" style={styles.footerText}>
                Already have an account?
                <Link to="/" className="text-success fw-bold ms-1">
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showOtpModal && (
        <div className="modal fade show d-block" style={styles.modalBackground}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title">Verify Email OTP</h5>
                <button className="btn-close" onClick={() => setShowOtpModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <p className="text-muted">
                  Enter the code sent to <br />
                  <strong>{form.email}</strong>
                </p>
                <input
                  type="text"
                  maxLength="6"
                  className="form-control text-center fs-3"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button className="btn btn-success w-100 mt-4 rounded-pill" onClick={submitOTP}>
                  Verify OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
