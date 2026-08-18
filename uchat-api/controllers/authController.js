const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
sql,
connectDB
}=require("../config/db");

const otpStore = {};
const transporter =
require("../config/email");


require("dotenv").config();





// Generate OTP

const generateOTP=()=>{


return Math.floor(
100000 +
Math.random()*900000
)
.toString();


};







// REGISTER

exports.register = async (req, res) => {

    try {

        const {

            fname,
            lname,
            email,
            phone,
            address,
            city,
            country,
            dob,
            gender,
            password

        } = req.body || {};


        if (
            !fname ||
            !lname ||
            !email ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message: "Required fields missing"
            });

        }


        // Check Email Verification
        if (
            !otpStore[email] ||
            otpStore[email].verified !== true
        ) {

            return res.status(400).json({
                success: false,
                message: "Please verify your email first."
            });

        }


        const pool = await connectDB();


        // Check existing email

        const check = await pool.request()

            .input(
                "email",
                sql.VarChar(255),
                email
            )

            .query(`
                SELECT Id
                FROM Profile
                WHERE Email=@email
            `);


        if (check.recordset.length > 0) {

            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });

        }


        const passwordHash = await bcrypt.hash(password, 10);


        let image = null;

        if (req.file) {
            image = req.file.filename;
        }


        await pool.request()

            .input("fname", sql.NVarChar(100), fname)
            .input("lname", sql.NVarChar(100), lname)
            .input("email", sql.VarChar(255), email)
            .input("phone", sql.NVarChar(20), phone || null)
            .input("address", sql.NVarChar(255), address || null)
            .input("city", sql.NVarChar(100), city || null)
            .input("country", sql.NVarChar(100), country || null)
            .input("dob", sql.Date, dob || null)
            .input("gender", sql.NVarChar(20), gender || null)
            .input("passwordHash", sql.NVarChar(255), passwordHash)
            .input("profileImage", sql.NVarChar(500), image)

            .query(`

                INSERT INTO Profile
                (

                    FName,
                    LName,
                    Email,
                    Phone,
                    Address,
                    City,
                    Country,
                    DOB,
                    Gender,
                    PasswordHash,
                    ProfileImage,
                    EmailVerified,
                    IsOnline

                )

                VALUES
                (

                    @fname,
                    @lname,
                    @email,
                    @phone,
                    @address,
                    @city,
                    @country,
                    @dob,
                    @gender,
                    @passwordHash,
                    @profileImage,
                    1,
                    0

                )

            `);


        // Remove verified OTP from memory
        delete otpStore[email];


        res.status(201).json({

            success: true,

            message: "Account created successfully."

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// RESEND OTP


exports.resendOTP = async(req,res)=>{


try{


const {email}=req.body;



const otp =
generateOTP();



const expiry =
new Date(
Date.now()+10*60*1000
);



const pool =
await connectDB();




await pool.request()

.input(
"email",
sql.VarChar(255),
email
)

.input(
"otp",
sql.VarChar(6),
otp
)

.input(
"expiry",
sql.DateTime,
expiry
)


.query(`


UPDATE Profile

SET

EmailOTP=@otp,

OTPExpiry=@expiry


WHERE Email=@email



`);






await transporter.sendMail({

from:process.env.EMAIL_USER,

to:email,

subject:"New UChat OTP",

html:`

<h1>${otp}</h1>

`

});





res.json({

success:true,

message:"OTP sent again"

});


}

catch(error){


console.log(error);


res.status(500).json({

success:false,

message:error.message

});


}


};


// Send OTP
exports.sendOTP = async (req, res) => {
    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        otpStore[email] = {
            otp,
            expiry: Date.now() + 10 * 60 * 1000
        };

        await transporter.sendMail({
            from: '"UChat" <usamazahidkayani006@gmail.com>',
            to: email,
            subject: "Email Verification",
            html: `
                <h2>UChat Verification</h2>

                <h1>${otp}</h1>

                <p>This OTP expires in 10 minutes.</p>
            `
        });

        console.log("OTP:", otp);

        res.json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

exports.verifyOTP = async (req, res) => {

    try {

        const { email, otp } = req.body;

        if (!otpStore[email]) {

            return res.status(400).json({
                success: false,
                message: "Please send OTP first."
            });

        }

        if (Date.now() > otpStore[email].expiry) {

            delete otpStore[email];

            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });

        }

        if (otpStore[email].otp !== otp) {

            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });

        }

        otpStore[email].verified = true;

        res.json({
            success: true,
            message: "OTP Verified"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// LOGIN


exports.login = async(req,res)=>{


try{


const {

email,
password

}=req.body;



const pool =
await connectDB();




const result =
await pool.request()

.input(
"email",
sql.VarChar(255),
email
)

.query(`

SELECT *

FROM Profile

WHERE Email=@email

`);




if(!result.recordset.length){


return res.status(400).json({

success:false,

message:"Invalid email or password"

});


}



const user =
result.recordset[0];





if(!user.EmailVerified){


return res.status(403).json({

success:false,

message:"Verify your email first"

});


}





const match =
await bcrypt.compare(

password,

user.PasswordHash

);




if(!match){


return res.status(400).json({

success:false,

message:"Invalid email or password"

});


}





await pool.request()

.input(
"id",
sql.Int,
user.Id
)

.query(`

UPDATE Profile

SET IsOnline=1

WHERE Id=@id

`);







const token =
jwt.sign(

{

id:user.Id,

email:user.Email

},

process.env.JWT_SECRET,

{
expiresIn:"7d"
}

);






res.json({

success:true,

token,

user

});



}

catch(error){


console.log(error);


res.status(500).json({

success:false,

message:error.message

});


}


};