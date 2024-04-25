// App.js
require('dotenv').config();

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Cookies from "js-cookie";

import { Container, Typography, Box, CssBaseline, AppBar, Toolbar, IconButton, Snackbar, Divider } from '@mui/material';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import { ThemeProvider } from "@mui/material/styles";

import theme from "./theme"; // Import the theme you created
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";

import ExpenseForm from "./components/ExpenseForm";
import ExpensesOfLoggedInUser from './components/ExpensesOfLoggedInUser';

function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({ username: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  const [expensesRefreshKey, setExpensesRefreshKey] = useState(0);

  useEffect(() => {
    let isUserInfoSet = false;

    if (process.env.REACT_APP_ENV === "dev") {
      // Mock the auth flow
      const mockUserInfo = { username: "john", name: "John Doe" };
      localStorage.setItem("userDetails", JSON.stringify(mockUserInfo));
      setUserDetails(mockUserInfo);
      setLoggedIn(true);
      isUserInfoSet = true;
    } else {
      const storedUserDetails = localStorage.getItem("userDetails");
      if (storedUserDetails) {
        const userDetails = JSON.parse(storedUserDetails);
        setUserDetails(userDetails);
        setLoggedIn(true);
        isUserInfoSet = true;
      }
    }

    if (!isUserInfoSet) {
      const encodedUserInfo = Cookies.get("userinfo");
      if (encodedUserInfo) {
        const userInfo = JSON.parse(atob(encodedUserInfo));
        setUserDetails(userInfo);
        setLoggedIn(true);
        localStorage.setItem("userDetails", JSON.stringify(userInfo));
      }
    }

    setLoading(false);
  }, []);

  const doExpenseListRefresh = () => {
    setExpensesRefreshKey(prevKey => prevKey + 1);
  };

  const doLogout = () => {
    // Clear stored user info
    setUserDetails({});
    setLoggedIn(false);
    localStorage.removeItem('userDetails');

    // Redirect to Choreo logout with session_hint
    const sessionHint = Cookies.get('session_hint');
    window.location.href = `/auth/logout?session_hint=${sessionHint}`;

    Cookies.remove('userinfo', { path: '/' });
  };  

  const doOpenSnackbar = (message) => {
    setSnackbar({ open: true, message });
  };

  const doCloseSnackbar = (event, reason) => {
    if (reason !== "clickaway") {
      setSnackbar({ ...snackbar, open: false });
    }
  };
  
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="primary" />
      </div>
    );
  }  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Router>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {" "}
                Expense Manager - Streamline Your Spending
              </Typography>
              {loggedIn && (
                <IconButton color="inherit" onClick={doLogout}>
                  <ExitToAppIcon />
                </IconButton>
              )}
            </Toolbar>
          </AppBar>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute isLoggedIn={loggedIn} />}>
              <Route
                path="/"
                element={
                  <Container maxWidth="sm">
                    <Box
                      sx={{
                        my: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        component="h1"
                        variant="h5"
                        style={{ marginBottom: 20 }}
                      >
                        {" "}
                        Hello, {userDetails.name}
                      </Typography>
                      <ExpenseForm
                        userDetails={userDetails}
                        doOpenSnackbar={doOpenSnackbar}
                        onExpenseActionSuccess={doExpenseListRefresh}
                      />
                      <Divider style={{ margin: "20px 0" }} />
					  <ExpensesOfLoggedInUser email={userDetails.email} triggerRefresh={expensesRefreshKey} />
                    </Box>
                  </Container>
                }
              />
            </Route>
          </Routes>
        </Router>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={doCloseSnackbar}
          message={snackbar.message}
          action={
            <React.Fragment>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={doCloseSnackbar}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;