//Handles Global Application Styles
//eg: body styles & fonts etc.
import { injectGlobal } from 'styled-components';

injectGlobal`
    body {
      font-family: sans-serif;
      color: white;
      background-color: black;
      margin: auto;
      text-align: center;
    }
`;