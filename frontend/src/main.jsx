
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

import App from "./App";
import "./index.css";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#246B45"
    },
    secondary: {
      main: "#8BAF72"
    },
    background: {
      default: "#F5F7F3",
      paper: "#FFFFFF"
    }
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif"
  },
  shape: {
    borderRadius: 12
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
