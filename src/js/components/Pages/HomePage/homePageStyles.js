import styled, { keyframes } from 'styled-components';

const rotate360 = keyframes`
    from {
        -webkit-transform: rotate(0);
        transform: rotate(0);
    }
    
    to {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
`;

export const MainTitleWrapper = styled.h2`
    margin: 30px 0;
    font-size: 40px;
    text-align: center;
`;

export const MainTitle = styled.span`
    display: inline-block;
    -webkit-animation: ${rotate360} 4000ms infinite linear;
    animation: ${rotate360} 4000ms infinite linear;
`;

export const PostSection = styled.div`
    width: 40%;
    margin: auto;

    @media (max-width: 786px) {
        width: 85%;
    }
`;