const User = require("../models/user");
const Joi = require("@hapi/joi");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const util = require('../helpers/utils');

module.exports = {
  async login(req, res) {
    try {
      let { email, password } = req.body;
      const schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        password: Joi.string().required()
      })
      const { error } = schema.validate({ email, password })
      if (error) {
        throw (error.details)
      } else {
        const loggedUser = await loginUser(email, password)
        if (!loggedUser) throw ('Email ou senha inválidos')
        // else if (loggedUser.mailConfirmation === 0) throw ('Você ainda não confirmou seu email, favor verificar novamente')
        else {
          // sendLoginEmail(req) // Email de segurança
          const token = jwt.sign({ email, loggedUser: loggedUser._id }, process.env.AUTH_HASH, {
            expiresIn: '3h'
          });
          loggedUser.password = undefined;
          loggedUser.__v = undefined;
          res.cookie('invite', "login-template", { httpOnly: true }).json({ user: loggedUser, token, success: true })
        }
      }
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        error
      })
    }
  },
  async addUser(req, res) {
    try {
      let { name, email, password, confirmPassword } = req.body;
      const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        password: Joi.string().regex(/^(?=.*?[A-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
        password: Joi.string().required(),
        confirmPassword: Joi.ref('password')
      })
      const { error } = schema.validate({ name, email, password, confirmPassword });
      if (error) throw (error.details)
      else {
        User.create({
          name,
          email,
          password
        }, (err, usr) => {
          try {
            if (err) throw ("Usuário já cadastrado")
            else {
              const { email, _id } = usr
              // const bodyTitle = 'Para confirmar clique neste link.';
              // const bodyText = `<a style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:28px;color:#FFFFFF;" href="${process.env.WEBSITE_URL}/confirm/${usr._id}">${process.env.WEBSITE_URL}/confirm/${usr._id}</a>`
              // module.exports.sendMail({ email, subject: 'TakePro: Confirmação de Registro', bodyTitle, bodyText })
              const token = jwt.sign({ email, loggedUser: _id }, process.env.AUTH_HASH, {
                expiresIn: '3h'
              });
              res.cookie('invite', "login-template", { httpOnly: true }).json({ user: usr, token, success: true })
            }
          } catch (error) {
            console.log(error)
            res.json({
              success: false,
              error
            })
          }
        })
      }
    } catch (error) {
      console.log(error)
      res.json({
        success: false,
        error
      })
    }
  },
  editUser(req, res) {
    try {
      let { id, password, confirmPassword, actualPassword } = req.body;
      const schema = Joi.object({
        password: Joi.string().regex(/^(?=.*?[A-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
        confirmPassword: Joi.ref('password'),
      })
      const { error } = schema.validate({ password, confirmPassword })
      if (error) throw (error.details)
      else {
        User.findById(id, async (err, user) => {
          if (bcrypt.compareSync(actualPassword, user.password)) {
            if (!bcrypt.compareSync(password, user.password)) {
              user.password = password
              // const bodyTitle = 'Você alterou sua senha atual para a seguinte.'
              // const bodyText = `<b>${password}</b>`
              // module.exports.sendMail({ email: user.email, subject: 'TakePro: Alteração de senha', bodyTitle, bodyText })
            }
            user.save();
            res.json({
              success: true,
              user
            })
          } else throw ("Senha Inválida")
        })
      }
    } catch (error) {
      console.log(error)
      res.json({
        success: false,
        error
      })
    }
  },
  resetPassword(req, res) {
    try {
      let { email } = req.body;
      const schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
      })
      const { error } = schema.validate({ email })
      if (error) throw (error.details)
      else {
        User.findOne({ email }, function (err, user) {
          try {
            if (!user) throw ("Email não encontrado")
            else {
              user.password = util.generatePassword()
              user.save();
              const bodyTitle = 'Você solicitou a recuperação de senha, com isso um código para acesso foi gerado automaticamente para você. Acesse seu usuário com a senha abaixo:'
              const bodyText = `<b>${user.password}</b>`
              module.exports.sendMail({ email, subject: 'Login template: Alteração de senha', bodyTitle, bodyText })
              res.json({
                success: true,
                user
              })
            }
          } catch (error) {
            console.log(error)
            res.json({
              success: false,
              error
            })
          }
        });
      }
    } catch (error) {
      console.log(error)
      res.json({
        success: false,
        error
      })
    }
  },

  getUserById(req, res) {
    try {
      const id = req.query.id
      if (!id) throw ("ID precisa ser fornecido")
      else {
        User.findById(id).populate('documents').exec((err, user) => {
          try {
            if (err) throw ("Erro ao consultar os usuários")
            else
              res.json({
                success: true,
                user
              })
          } catch (error) {
            console.log(error)
            res.json({
              success: false,
              error
            })
          }
        })
      }
    } catch (error) {
      console.log(error)
      res.json({
        success: false,
        error
      })
    }
  },
  getUsers(req, res) {
    try {
      User.find({}, (err, usrs) => {
        try {
          if (err) throw ("Erro ao consultar usuários")
          else
            res.json({
              success: true,
              users: usrs
            })
        } catch (error) {
          console.log(error)
          res.json({
            success: false,
            error
          })
        }
      })

    } catch (error) {
      console.log(error)
      res.json({
        success: false,
        error
      })
    }
  },
  getSingleUser(id) {
    return new Promise((resolve, reject) => {
      User.findById(id, (err, user) => {
        if (err) {
          reject(false);
          return;
        }
        resolve(user)
      });
    });
  },
  async sendMail({ email, subject, bodyTitle, bodyText, attachment = null }) {
    const transporter = nodemailer.createTransport({
      host: process.env.TFA_EMAIL_HOST,
      port: process.env.TFA_EMAIL_PORT,
      secure: process.env.TFA_EMAIL_SECURE,
      requireTLS: true,
      auth: {
        user: process.env.TFA_EMAIL_USER,
        pass: process.env.TFA_EMAIL_PASSWORD
      }
    });
    const bodyFormated = `
    
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
 <head> 
  <meta charset="UTF-8"> 
  <meta content="width=device-width, initial-scale=1" name="viewport"> 
  <meta name="x-apple-disable-message-reformatting"> 
  <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
  <meta content="telephone=no" name="format-detection"> 
  <title>TakePro</title> 
  <!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <![endif]--> 
  <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> 
  <style type="text/css">
@media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:30px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:20px!important; display:block!important; border-width:10px 0px 10px 0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }
#outlook a {
	padding:0;
}
.ExternalClass {
	width:100%;
}
.ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
	line-height:100%;
}
.es-button {
	mso-style-priority:100!important;
	text-decoration:none!important;
}
a[x-apple-data-detectors] {
	color:inherit!important;
	text-decoration:none!important;
	font-size:inherit!important;
	font-family:inherit!important;
	font-weight:inherit!important;
	line-height:inherit!important;
}
.es-desk-hidden {
	display:none;
	float:left;
	overflow:hidden;
	width:0;
	max-height:0;
	line-height:0;
	mso-hide:all;
}
</style> 
 </head> 
 <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;"> 
  <div class="es-wrapper-color" style="background-color:#F6F6F6;"> 
   <!--[if gte mso 9]>
			<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
				<v:fill type="tile" color="#f6f6f6"></v:fill>
			</v:background>
		<![endif]--> 
   <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;"> 
     <tr style="border-collapse:collapse;"> 
      <td valign="top" style="padding:0;Margin:0;"> 
       <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> 
         <tr style="border-collapse:collapse;"> 
          <td align="center" style="padding:0;Margin:0;"> 
           <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;"> 
             <tr style="border-collapse:collapse;"> 
              <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
               <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                 <tr style="border-collapse:collapse;"> 
                  <td width="560" align="center" valign="top" style="padding:0;Margin:0;"> 
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                     <tr style="border-collapse:collapse;"> 
                      <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:20px;font-size:0px;"><img class="adapt-img" src="https://www.tapisrouge.com.br/wp-content/uploads/2019/11/Avengers-Logo-PNG-Transparent-Avengers-Logo-715x715.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="150"></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
               </table></td> 
             </tr> 
             <tr style="border-collapse:collapse;"> 
              <td align="left" style="padding:0;Margin:0;padding-top:15px;"> 
               <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                 <tr style="border-collapse:collapse;"> 
                  <td width="600" valign="top" align="center" style="padding:0;Margin:0;"> 
                   <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:center top;" role="presentation"> 
                     <tr style="border-collapse:collapse;"> 
                      <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#666666;">${bodyTitle}</p></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
               </table></td> 
             </tr> 
             <tr style="border-collapse:collapse;"> 
              <td align="left" style="Margin:0;padding-top:10px;padding-bottom:40px;padding-left:40px;padding-right:40px;background-color:transparent;" bgcolor="transparent"> 
               <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                 <tr style="border-collapse:collapse;"> 
                  <td width="520" align="center" valign="top" style="padding:0;Margin:0;"> 
                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#362AD5;" bgcolor="#362AD5" role="presentation"> 
                     <tr style="border-collapse:collapse;"> 
                      <td align="center" class="es-m-txt-c" bgcolor="transparent" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:28px;color:#FFFFFF;">${bodyText}</p></td> 
                     </tr> 
                   </table></td> 
                 </tr> 
               </table></td> 
             </tr> 
           </table></td> 
         </tr> 
       </table></td> 
     </tr> 
   </table> 
  </div>  
 </body>
</html>
    `
    try {
      let mail = {
        from: `Login Template ${process.env.TFA_EMAIL_USER}`,
        to: email,
        subject: subject,
        html: bodyFormated
      };
      if (attachment)
        mail.attachments = [attachment];
      const response = await transporter.sendMail(mail);
      return response;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
},

  loginUser = async (email, password) => {
    try {
      const user = await User.findOne({ email });
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          return user;
        }
      }
      return false
    } catch (error) {
      console.log(error)
    }
  };