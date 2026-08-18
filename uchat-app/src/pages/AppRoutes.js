import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";


import Login from "./Login";
import Signup from "./Signup";
import ChatPage from './ChatPage';



function ProtectedRoute({children}) {


    const token =
    localStorage.getItem("token");


    return token
    ?
    children
    :
    <Navigate to="/login" />;

}




export default function AppRoutes(){


return (

<BrowserRouter>

<Routes>


<Route
path="/login"
element={<Login/>}
/>


<Route
path="/Signup"
element={<Signup/>}
/>



<Route
path="/chat"
element={

<ProtectedRoute>

<ChatPage/>

</ProtectedRoute>

}
/>



<Route
path="*"
element={
<Navigate to="/chat"/>
}
/>



</Routes>


</BrowserRouter>


);


}