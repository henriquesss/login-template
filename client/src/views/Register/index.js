import React, { useState } from 'react'
import validator from 'validator'
import { login } from "../../auth"
import api from "../../services/api"
import { toast } from 'react-toastify'
import { Link } from "react-router-dom"
// import styled from 'styled-components'

import '../../index.css'

const Register = (props) => {
    const [errors, setErrors] = useState({})
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmedPassword] = useState("")

    const onSubmit = (e) => {
        let isValid = true;
        let passwordReg = new RegExp("^(?=.*?[A-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
        // let especialCharacters = new RegExp("[^A-Za-z0-9wÀ-ú ]")
        let error = {}

        if (!name) {
            error.name = "O campo nome é obrigatório"
            isValid = false;
        } else if (name.length > 70) {
            error.name = "O campo nome possui mais que 70 caractéres"
            isValid = false;
        }
        // else if (especialCharacters.test(name)) {
        //     error.name = "O campo nome possui caractéres inválidos"
        //     isValid = false;
        // }
        if (!password) {
            error.password = "O campo senha é obrigatório"
            isValid = false;
        } else if (!passwordReg.test(password)) {
            error.password = "A senha não contem 8 caractéres, letra, número ou caractére especial"
            isValid = false;
        } else if (password !== confirmPassword) {
            error.password = "As senhas não são iguais"
            isValid = false
        }
        if (!confirmPassword) {
            error.confirmPassword = "O campo confirmação de senha é obrigatório"
            isValid = false
        } else if (confirmPassword !== password) {
            error.mail = "As senhas não são iguais"
            isValid = false
        }
        if (!email) {
            error.email = "O campo email é obrigatório"
            isValid = false
        } else if (!validator.isEmail(email)) {
            error.mail = "O campo email esta no formato incorreto"
            isValid = false
        }
        setErrors(error)

        if (isValid)
            api.post(`/users/addUser`, { name, email, password, confirmPassword }).then(res => {
                if (res.success) {
                    login(res)
                    toast.success("Usuário registrado com sucesso!");
                    window.location.href = "/"
                } else {
                    if (Array.isArray(res.error)) {
                        let error = ''
                        res.error.forEach(e => {
                            error += `O campo ${e.path[0]} está com valores inválidos.\n`
                        })
                        setErrors({ serverSide: error })
                        toast.error("Ops, algo deu errado!");
                    } else {
                        setErrors({ serverSide: res.error })
                        toast.error("Ops, algo deu errado!");
                    }
                }
            }).catch((err) => {
                toast.error("Ops, algo deu errado!");
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

    const registerTitle = {
        fontWeight: "bold",
        fontSize: "27px",
        marginBottom: "1em"
    }

    const errorsText = {
        textAlign: "center",
        margin: "2em",
        color: "#FF4040"
    }

    const errorsDisplay = {
        textAlign: "center",
        margin: "1em",
        color: "#FF4040"
    }

    return (
        <div style={pageStyles}>
            <h1 style={registerTitle}>Cadastro</h1>
            {errors.serverSide && <div style={errorsText}>{errors.serverSide}</div>}
            <div style={{ width: "300px" }}>
                <div className="row">
                    {errors.name && (<p style={errorsDisplay}> {errors.name} </p>)}
                    {errors.email && (<p style={errorsDisplay}> {errors.email} </p>)}
                    {errors.password && (<p style={errorsDisplay}> {errors.password} </p>)}
                    <div className="col-md-12 mb-3">
                        <input
                            name="name"
                            placeholder="Nome completo"
                            maxLength={70}
                            error={errors ? errors.name : ''}
                            value={name}
                            onChange={event => setName(event.target.value)}
                            className="form-control"
                        />
                    </div>

                    <div className="col-md-12 mb-3">
                        <input
                            name="mail"
                            type="email"
                            error={errors ? errors.email : ''}
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            className="form-control"
                            aria-describedby="emailHelp"
                            placeholder="Email"
                        />
                    </div>

                    <div className="col-md-12 mb-3">
                        <input
                            type="password"
                            value={password}
                            error={errors ? errors.password : ''}
                            onChange={event => setPassword(event.target.value)}
                            className="form-control"
                            placeholder="Senha"
                        />
                    </div>

                    <div className="col-md-12">
                        <input
                            type="password"
                            value={confirmPassword}
                            error={errors ? errors.confirmPassword : ''}
                            onChange={event => setConfirmedPassword(event.target.value)}
                            className="form-control"
                            placeholder="Confirmar senha"
                        />
                    </div>
                </div>

                <div className="row mb-2">
                    <div className="col-md-12">
                        <button
                            className="large-btn"
                            onClick={event => onSubmit(event)}
                        >
                            Cadastrar
                        </button>
                    </div>
                </div>

                <Link to="/">Já possuo uma conta</Link>
            </div>
        </div>
    )


};

export default Register;