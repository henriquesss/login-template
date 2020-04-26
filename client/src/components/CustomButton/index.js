import styled from 'styled-components';
import { Button } from 'reactstrap';

export const CustomButton = styled(Button)`
    border-radius: 50px;
    font-weight: bold;
    width: 80px;
    font-size: 10px;
`;

export const CustomLargeButton = styled(Button)`
    border-radius: 50px;
    font-weight: bold;
    width: 120px;
    font-size: 15px;
`

export const CustomUploadButton = styled(Button)`
    border-radius: 50px;
    font-weight: bold;
    color: #362AD5;
    background-color: #fff;
    border-color: #362AD5;
    &:hover {
        color: #362AD5;
        background-color: #fff;
        border-color: #362AD5;
    }
`;

export const CustomButtonLink = styled.a`
    border-radius: 50px;
    color: #fff !important;
    font-weight: bold;
    width: 80px;
    font-size: 10px;
`;

export const ButtonUI = styled(Button)`
    background-color: #004C70;
    border-radius: 15px;
    color: #fff;
    font-weight: bold;
    border: none;
    padding: 0.5em;
    min-width: 80px;
    font-size: 13px;
    transition: ease-in-out 0.4s;
    &:hover {
        background-color: rgb(1, 41, 59);
        transition: ease-in-out 0.4s;
    }
`

export const ButtonLinkUI = styled.a`
    background-color: #004C70;
    border-radius: 15px;
    color: #fff;
    font-weight: bold;
    border: none;
    padding: 0.5em;
    min-width: 80px;
    font-size: 13px;
    transition: ease-in-out 0.4s;
    &:hover {
        background-color: rgb(1, 41, 59);
        transition: ease-in-out 0.4s;
    }
`

