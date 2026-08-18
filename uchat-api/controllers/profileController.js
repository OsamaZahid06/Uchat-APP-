const { sql, connectDB } = require("../config/db");




// Upload Image

exports.uploadImage = async(req,res)=>{


try{


if(!req.file){

return res.status(400).json({

success:false,

message:"No image uploaded"

});

}



const image = req.file.filename;



const pool = await connectDB();



await pool.request()

.input(
"id",
sql.Int,
req.user.id
)

.input(
"image",
sql.NVarChar(500),
image
)

.query(`

UPDATE Profile

SET 

ProfileImage=@image,
UpdatedAt=GETDATE()

WHERE Id=@id

`);




res.json({

success:true,

message:"Image uploaded",

image:image

});



}

catch(error){


console.log(error);


res.status(500).json({

success:false,

message:"Server Error"

});


}


};







// Get My Profile


exports.getProfile = async(req,res)=>{


try{


const pool = await connectDB();



const result = await pool.request()

.input(
"id",
sql.Int,
req.user.id
)


.query(`

SELECT

Id,
FName,
LName,
Email,
Phone,
Address,
City,
Country,
DOB,
Gender,
ProfileImage,
IsOnline,
CreatedAt

FROM Profile

WHERE Id=@id

`);




if(result.recordset.length===0){


return res.status(404).json({

success:false,

message:"User not found"

});


}





res.json({

success:true,

data:result.recordset[0]

});




}

catch(error){


console.log(error);


res.status(500).json({

success:false,

message:"Server Error"

});


}


};









// Get Profile By ID


exports.getProfileById = async(req,res)=>{


try{


const pool = await connectDB();



const result = await pool.request()

.input(

"id",

sql.Int,

req.params.id

)

.query(`


SELECT

Id,
FName,
LName,
Email,
Phone,
Address,
City,
Country,
DOB,
Gender,
ProfileImage,
IsOnline


FROM Profile


WHERE Id=@id


`);





if(result.recordset.length===0){


return res.status(404).json({

success:false,

message:"User not found"

});


}





res.json({

success:true,

data:result.recordset[0]

});





}

catch(error){


console.log(error);



res.status(500).json({

success:false,

message:"Server Error"

});


}


};









// Update Profile


exports.updateProfile = async(req,res)=>{


try{


const {


fname,

lname,

phone,

address,

city,

country,

dob,

gender,

profileImage


}=req.body;





const pool = await connectDB();




await pool.request()


.input(
"id",
sql.Int,
req.user.id
)


.input(
"fname",
sql.NVarChar(100),
fname
)


.input(
"lname",
sql.NVarChar(100),
lname
)


.input(
"phone",
sql.NVarChar(20),
phone
)


.input(
"address",
sql.NVarChar(255),
address
)


.input(
"city",
sql.NVarChar(100),
city
)


.input(
"country",
sql.NVarChar(100),
country
)


.input(
"dob",
sql.Date,
dob
)


.input(
"gender",
sql.NVarChar(20),
gender
)


.input(
"profileImage",
sql.NVarChar(500),
profileImage
)



.query(`


UPDATE Profile

SET


FName=@fname,

LName=@lname,

Phone=@phone,

Address=@address,

City=@city,

Country=@country,

DOB=@dob,

Gender=@gender,

ProfileImage=@profileImage,

UpdatedAt=GETDATE()


WHERE Id=@id


`);





res.json({

success:true,

message:"Profile Updated Successfully"

});




}

catch(error){


console.log(error);



res.status(500).json({

success:false,

message:"Server Error"

});


}


};









// Logout


exports.logout = async(req,res)=>{


try{


const pool = await connectDB();



await pool.request()


.input(

"id",

sql.Int,

req.user.id

)


.query(`


UPDATE Profile

SET IsOnline=0

WHERE Id=@id


`);




res.json({

success:true,

message:"Logout Successfully"

});



}

catch(error){


console.log(error);


res.status(500).json({

success:false,

message:"Server Error"

});


}


};