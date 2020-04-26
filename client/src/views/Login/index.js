import React, { useState, useEffect } from 'react';
import validator from 'validator'
import { login } from "../../auth"
import api from "../../services/api"
import { isAuthenticated } from '../../auth'
import { Link } from "react-router-dom"
import { toast } from 'react-toastify'
// import styled from 'styled-components';

import '../../index.css'

const Login = (props) => {
    useEffect(() => {
        if (isAuthenticated()) {
            window.location.href = "/dashboard";
        }
    }, [])

    const [errors, setErrors] = useState({});
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [recoverPassword, setRecoverPassword] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        let isValid = true;
        let error = {}
        if (!email) {
            error.mail = "O campo email é obrigatório"
            isValid = false;
        } else if (!validator.isEmail(email)) {
            error.mail = "O campo email esta no formato incorreto"
            isValid = false;
        }
        if (!password) {
            error.password = "O campo senha é obrigatório"
            isValid = false;
            // setRecoverPassword(true)
        }
        setErrors(error)
        if (isValid)
            api.post(`/users/login`, { email, password }).then(res => {
                if (res.success) {
                    login(res);
                    window.location.href = `/dashboard`
                } else {
                    toast.error('Ops, algo deu errado')
                    setErrors({ ...errors, serverSide: res.error })
                }
            }).catch((err) => {
                console.log(err)
            })
    }

    const pageStyles = {
        display: "flex",
        height: "80%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center"
    }

    const loginTitle = {
        fontWeight: "bold",
        fontSize: "27px",
        marginBottom: "1em"
    }

    const errorsDisplay = {
        textAlign: "center",
        margin: "1em",
        color: "#FF4040"
    }

    const recoverPasswordButton = {
        background: "transparent",
        border: "none",
        marginTop: "0.5em"
    }

    return (
        <div style={pageStyles}>
            {errors.serverSide && (<p style={{ color: "#FF4040" }}>{errors.serverSide}</p>)}
            <h1 style={loginTitle}>Login</h1>
            <form onSubmit={(event) => onSubmit(event)}>
                <div style={{ width: "300px" }}>
                    <div className="row">
                        {errors.mail && (<p style={errorsDisplay}> {errors.mail} </p>)}
                        {errors.password && (<p style={errorsDisplay}> {errors.password} </p>)}
                        <div className="col-md-12 mb-3">
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

                        <div className="col-md-12">
                            <input
                                id="passwordId"
                                type="password"
                                value={password}
                                onChange={event => setPassword(event.target.value)}
                                className="form-control"
                                placeholder="Senha"
                            />
                        </div>
                    </div>

                    <div className="row">                        
                        <div className="col-md-12 pt-2">
                          <Link to="/recover-password" style={recoverPasswordButton}>Recuperar senha</Link>
                        </div>

                        <div className="col-md-6">
                            <button
                                className="ui-button"
                                type="submit"
                            >
                                Entrar
                        </button>
                        </div>

                        <div className="col-md-6">
                            <button
                                className="ui-button"
                                onClick={() => { props.history.push(`/register`) }}
                            >
                                Cadastrar
                            </button>
                        </div>

                    </div>
                </div>
            </form>
        </div>
    )


};

export default Login;