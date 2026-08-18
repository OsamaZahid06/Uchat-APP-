const multer = require("multer");
const path = require("path");
const fs = require("fs");


// Upload folder path
const uploadPath = path.join(__dirname, "../uploads");


// Create uploads folder automatically
if (!fs.existsSync(uploadPath)) {

    fs.mkdirSync(uploadPath, {
        recursive: true
    });

}




const storage = multer.diskStorage({


    destination:(req,file,cb)=>{


        cb(
            null,
            uploadPath
        );


    },



    filename:(req,file,cb)=>{


        cb(
            null,
            Date.now()
            +
            "-"
            +
            file.originalname
        );


    }


});





const fileFilter=(req,file,cb)=>{


const ext =
path.extname(file.originalname)
.toLowerCase();



if(

ext === ".jpg" ||

ext === ".jpeg" ||

ext === ".png"

){


    cb(null,true);


}

else{


    cb(
        new Error(
            "Only jpg jpeg png allowed"
        ),
        false
    );


}


};







module.exports =
multer({

    storage:storage,

    fileFilter:fileFilter,

    limits:{

        fileSize:5*1024*1024

    }


});