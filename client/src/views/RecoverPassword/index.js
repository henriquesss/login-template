import React, { useState } from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { Link } from "react-router-dom"

const RecoverPassword = props => {
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState({});

    const pageStyles = {
        display: "flex",
        height: "80%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center"
    }

    const TitleText = {
        fontWeight: "bold",
        fontSize: "27px",
        marginBottom: "1em"
    }

    const errorsDisplay = {
        textAlign: "center",
        margin: "1em",
        color: "#FF4040"
    }

    const onSubmit = () => {
        let isValid = true;
        let error = {}
        if (!email) {
          error.email = "O campo Email é obrigatório"
          isValid = false;
        }
        setErrors(error)
        if (isValid)
          api.post('/users/resetpassword', { email })
            .then(function (res) {
              if (res.success) {
                toast.success("Senha resetada com sucesso, verifique seu email!")
                setTimeout(() => { 
                    window.location.href = '/'
                }, 2000);
              } else {
                toast.error("Ops, algo deu errado!");
                if (Array.isArray(res.error)) {
                  let error = ''
                  res.error.forEach(e => {
                     error += `O campo ${e.path[0]} está com valores inválidos.\n`
                  })
                  setErrors({ serverSide: error })
                } else {
                  setErrors({ serverSide: res.error })
                }
              }
            })
      }
    

    return (
        <div style={pageStyles}>
        {errors.serverSide && (<p style={{ color: "#FF4040" }}>{errors.serverSide}</p>)}
         <h1 style={TitleText}>Recuperar senha</h1>

          <div style={{ width: "300px"}}>

              <div className="row">
                  {errors.email && ( <p style={errorsDisplay}> {errors.email} </p> )}
                  <div className="col-md-12">
                      <input
                          id="emailId"
                          type="email"
                          value={email}
                          onChange={event => setEmail(event.target.value)}
                          className="form-control"
                          aria-describedby="emailHelp"
                          placeholder="Email"
                      />
                  </div>
              </div>

              <div className="row">
                  <div className="col-md-12 mb-2">
                      <button
                          className="large-btn"
                          onClick={(event) => { onSubmit(event) }}
                      >
                      Recuperar senha
                      </button>
                  </div>              
              </div>
              <Link to="/">Voltar</Link>
          </div>
      </div>
    )
};

export default RecoverPassword;
