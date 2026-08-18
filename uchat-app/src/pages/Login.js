// import React,{useState} from "react";

// import AuthLayout from "../components/AuthLayout";

// import api from "../api/api";

// import {
// useNavigate
// }
// from "react-router-dom";


// function Login(){


// const navigate=useNavigate();



// const [show,setShow]=useState(false);



// const [data,setData]=useState({

// email:"",
// password:""

// });




// const login=async()=>{


// try{


// const response =
// await api.post(
// "/auth/login",
// data
// );



// localStorage.setItem(
// "token",
// response.data.token
// );



// localStorage.setItem(
// "user",
// JSON.stringify(
// response.data.user
// )
// );



// alert(
// "Login Successful"
// );



// navigate("/chat");



// }
// catch(error){


// alert(

// error.response?.data?.message
// ||
// "Login Failed"

// );


// }



// };





// return(

// <AuthLayout>


// <div className="auth-card">


// <div className="text-center mb-4">


// <div className="logo">

// <i className="bi bi-chat-heart-fill"></i>

// </div>


// <h2>
// Welcome Back
// </h2>


// <p>
// Login to UChat
// </p>


// </div>




// <div className="input-group mb-3">


// <span className="input-group-text">

// <i className="bi bi-envelope"></i>

// </span>


// <input

// className="form-control"

// placeholder="Email"

// onChange={
// e=>setData({

// ...data,

// email:e.target.value

// })
// }

// />


// </div>





// <div className="input-group mb-3">


// <span className="input-group-text">

// <i className="bi bi-lock"></i>

// </span>



// <input

// type={
// show?
// "text":
// "password"
// }

// className="form-control"

// placeholder="Password"


// onChange={
// e=>setData({

// ...data,

// password:e.target.value

// })
// }

// />



// <button

// className="btn btn-light"

// onClick={
// ()=>setShow(!show)
// }

// >

// <i className={
// show?
// "bi bi-eye-slash":
// "bi bi-eye"
// }></i>


// </button>



// </div>





// <button

// className="btn btn-success w-100 auth-btn"

// onClick={login}

// >


// Login


// </button>



// <div className="text-center mt-3">


// Don't have account?

// <a href="/signup">

//  Signup

// </a>


// </div>


// </div>


// </AuthLayout>

// )

// }


// export default Login;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import AuthLayout from "../components/AuthLayout";
import api from "../api/api";

function Login() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const login = async () => {
    try {
      const response = await api.post("/auth/login", data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login Successful");
      navigate("/chat");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
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
      maxWidth: "950px",
      display: "flex",
      borderRadius: "22px",
      overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,0.12)"
    },
    sidebar: {
      flex: 1,
      minWidth: "320px",
      background: "linear-gradient(135deg, #075e54 0%, #128c7e 100%)",
      color: "#fff",
      padding: "40px 36px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: "18px"
    },
    brand: {
      fontSize: "18px",
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      opacity: 0.9
    },
    sidebarTitle: {
      fontSize: "30px",
      lineHeight: 1.1,
      margin: 0
    },
    sidebarText: {
      fontSize: "15px",
      lineHeight: 1.7,
      opacity: 0.92,
      maxWidth: "320px"
    },
    infoBox: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginTop: "18px",
      background: "rgba(255,255,255,0.14)",
      padding: "18px 16px",
      borderRadius: "16px"
    },
    infoIcon: {
      fontSize: "20px",
      color: "#25d366"
    },
    formPanel: {
      flex: 1,
      minWidth: "360px",
      background: "#f8f9fa",
      padding: "42px 36px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    },
    logo: {
      width: "74px",
      height: "74px",
      borderRadius: "22px",
      background: "#25d366",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "28px",
      margin: "0 auto 20px"
    },
    title: {
      fontSize: "28px",
      fontWeight: 700,
      margin: "0 0 8px"
    },
    subtitle: {
      margin: 0,
      color: "#6b7280"
    },
    inputGroup: {
      borderRadius: "14px",
      overflow: "hidden",
      boxShadow: "0 6px 14px rgba(0,0,0,0.06)"
    },
    inputAddon: {
      borderColor: "#dde2e6",
      background: "#fff",
      color: "#4b5563"
    },
    input: {
      border: "none",
      outline: "none",
      background: "#fff"
    },
    eyeBtn: {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderLeft: "1px solid #dde2e6",
      background: "#fff",
      minWidth: "56px"
    },
    loginButton: {
      marginTop: "8px",
      borderRadius: "14px",
      height: "50px",
      fontWeight: 700
    },
    footerText: {
      marginTop: "18px",
      color: "#525252",
      fontSize: "14px"
    },
    link: {
      color: "#075e54",
      textDecoration: "none",
      fontWeight: 600
    }
  };

  return (
    // <AuthLayout>
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.sidebar}>
            <div style={styles.brand}>UChat Web</div>
            <h2 style={styles.sidebarTitle}>Connect with your chats on the browser.</h2>
            <p style={styles.sidebarText}>
              Secure messaging from any device, with the look and feel of WhatsApp Web.
            </p>
            <div style={styles.infoBox}>
              <i className="bi bi-check-circle-fill" style={styles.infoIcon}></i>
              <span>Always synced, always private.</span>
            </div>
          </div>

          <div style={styles.formPanel}>
            <div className="text-center mb-4">
              <div style={styles.logo}>
                <i className="bi bi-chat-heart-fill"></i>
              </div>
              <h2 style={styles.title}>Welcome Back</h2>
              <p style={styles.subtitle}>Login to UChat</p>
            </div>

            <div className="input-group mb-3" style={styles.inputGroup}>
              <span className="input-group-text" style={styles.inputAddon}>
                <i className="bi bi-envelope"></i>
              </span>
              <input
                className="form-control"
                style={styles.input}
                placeholder="Email"
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>

            <div className="input-group mb-3" style={styles.inputGroup}>
              <span className="input-group-text" style={styles.inputAddon}>
                <i className="bi bi-lock"></i>
              </span>
              <input
                type={show ? "text" : "password"}
                className="form-control"
                style={styles.input}
                placeholder="Password"
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
              <button
                className="btn btn-light"
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShow(!show)}
              >
                <i className={show ? "bi bi-eye-slash" : "bi bi-eye"}></i>
              </button>
            </div>

            <button
              className="btn btn-success w-100 auth-btn"
              style={styles.loginButton}
              onClick={login}
            >
              Login
            </button>

            <div className="text-center mt-3" style={styles.footerText}>
              Don't have account?{" "}
              <a href="/signup" style={styles.link}>
                Signup
              </a>
            </div>
          </div>
        </div>
      </div>
    // </AuthLayout>
  );
}

export default Login;