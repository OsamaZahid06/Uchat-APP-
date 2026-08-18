import React from "react";


function AuthLayout({children}){


return (

<div className="auth-page">


<div className="container">


<div className="row min-vh-100 align-items-center">


{/* Left Brand Section */}

<div className="col-lg-6 d-none d-lg-block">


<div className="brand-section">


<h1>

<i className="bi bi-chat-heart-fill"></i>

 UChat

</h1>


<p>

Connect with friends,
family and teams instantly.

</p>



<div className="features">


<div>

<i className="bi bi-chat-dots"></i>

 Real Time Messaging

</div>



<div>

<i className="bi bi-telephone"></i>

 Voice & Video Calls

</div>



<div>

<i className="bi bi-shield-check"></i>

 Secure Communication

</div>


</div>


</div>


</div>




{/* Form Section */}

<div className="col-lg-6 col-md-8 mx-auto">


{children}


</div>



</div>


</div>


</div>


);


}


export default AuthLayout;