const nodemailer = require("nodemailer");
const util = require("util");

let transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'notedo9897@gmail.com',
    pass: 'c498f25dd71be513bda906cf0aa78e59'
  }
});



exports.enviar = async opciones => {
  const opcionesEmail = {
    from: "Note-do <noreply@note-do.com>",
    to: opciones.user.email,
    subject: opciones.subject,
    html: opciones.resetUrl,
    
  };

  const sendMail = util.promisify(transport.sendMail, transport);
  return sendMail.call(transport, opcionesEmail);
};
