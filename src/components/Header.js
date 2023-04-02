import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack, TextField, InputAdornment } from "@mui/material";
import { Search, SentimentDissatisfied } from "@mui/icons-material";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import "./Header.css";
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("balance")

    window.location.reload();
  }

  const login = () => {
    history.push("/login");
  }
  const register = () => {
    history.push("/register");
  }
  const explore = () => {
    history.push("/");
  }



  if(hasHiddenAuthButtons) {
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={explore}
        >
          Back to explore
        </Button>
      </Box>
    );
  } else {
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
            </Box>
            {children}
        <Stack direction="row" spacing={2}>
          {localStorage.getItem("username") ? (
            <>
            <Avatar alt={localStorage.getItem("username") || "profile"} src="avatar.png" />
            <p className="username_text">{localStorage.getItem("username")}</p>
           <Button type="primary" onClick={logout}>
             LogOut
           </Button>
            </>
          ) : (
            <>
           <Button onClick={login}>Login</Button>
          <Button className="button" variant="contained" onClick={register}>Register</Button>
            </>
          )}
        </Stack>
      </Box>
    );
  }
};

export default Header;
