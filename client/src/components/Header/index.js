import React, { useState } from 'react';
import styled from 'styled-components'
import { Link } from "react-router-dom"
import { Container, Col, Row } from 'reactstrap'
import Logo from '../../assets/logo.png'

import { isAuthenticated, logout, getUser } from '../../auth'

const StyledHeader = styled.div`
box-shadow: 0px 0px 8px 0px;
padding:1em;`

const LogoutButton = styled.div`
background: none;
border: none;
font-weight: bold;
cursor: pointer;
`

const Header = (props) => {
    const [user] = useState(getUser())
    function logoutFunction() {
        logout();
        window.location.href = '/'
    }

    return (
        <>
            {isAuthenticated() ?
                <StyledHeader>
                    <Container>
                        <Row>
                            <Col xs={9} md={4}>
                                <Link to={"/"}>
                                    <img className="img-fluid" width="50px" height="auto" src={Logo} alt="Logo default" />
                                </Link>
                            </Col>

                            <Col xs={3} md={8}>
                                <div className="float-right">
                                    <span>{user.name}</span>
                                    <LogoutButton onClick={() => { logoutFunction() }}> Logout </LogoutButton>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </StyledHeader>
            :
                <></>
            }
        </>
    )
};

export default Header;
