const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {

        user: "usamazahidkayani006@gmail.com",

        pass: "xwds cuky stlj onbi"

    }

});


transporter.verify((error, success) => {

    if (error) {

        console.log("Email Error:", error);

    } else {

        console.log("Email Server Ready");

    }

});


module.exports = transporter;