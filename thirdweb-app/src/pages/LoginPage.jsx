import { Box, Button, CircularProgress, FormControlLabel, FormGroup, Link, Stack, TextField, Typography, circularProgressClasses, colors } from '@mui/material'
import React, { useState } from 'react'
import { images } from '../assets'
import { CheckBox } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [onRequest, setOnRequest] = useState(false);
  const [loginProgress, setloginProgress] = useState(0);
  const [isLoggedIn, setisLoggedIn] = useState(false);

  const onSignin = (e) => {
    e.preventDefault()
    setOnRequest(true)

    const interval = setInterval(() => {
      setloginProgress(prev => prev + 100 / 40)
    }, 50);

    setTimeout(() => {
      clearInterval(interval)
    },2000);

    setTimeout(() => {
      setisLoggedIn(true)
    },2100);

    setTimeout(() => {
      navigate("/home");
    },3300);
  }
  return (
    <Box
      position="relative"
      height="100vh"
      sx={{"::-webkit-scrollbar": { display : "none"}}}
    >
      {/*background box*/}
      <Box sx={{
        position: "absolute",
        right: 0,
        height: "100%",
        width: "70%",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundImage: `url(${images.loginBg})`
      }}
      />
      {/*background box*/}

      {/* Login form */}
      <Box sx={{
        position: "absolute",
        left: 0,
        height: "100%",
        width: isLoggedIn ? "100%" : {xl: "30%", lg: "40%", md: "50%", xs: "100%"},
        transition: "all 1s ease-in-out",
        bgcolor: colors.common.whites
      }}>
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          opacity: isLoggedIn ? 0 : 1,
          transition: "all 0.3s ease-in-out",
          height: "100%",
          "::-webkit-scrollbar": {display: "none"}
        }}>
          {/* Logo */}
          <Box sx={{ textAlign: "center", p: 5}}>
            <img src={images.logo} alt='logo0' height={60}></img>
          </Box>
          {/* Logo */}

          {/* form */}
          <Box sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "::-webkit-scrollbar": {display: "none"}
          }}>
            <Box component="form" maxWidth={400} width="100%" onSubmit={onSignin}>
              <Stack spacing={3}>
                <TextField label="username" fullWidth />
                <TextField label="password" type="password" fullWidth />
                <Button type='submit' size='large' variant='contained' color='success'>
                  sign in
                </Button>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <FormGroup> 
                    <FormControlLabel control={<CheckBox />} label= "Remember me"/>
                  </FormGroup>
                  <Typography color="error" fontWeight="bold">
                    <Link to="#">
                      Forgot password?
                    </Link>
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>
          {/* form */}

          {/* footer*/}
          <Box sx={{ textAlign: "center", p: 5, zIndex: 2}}>
            <Typography
              display="inline"
              fontWeight="bold"
              sx={{"& > a": { color: colors.red[900], ml: "5px"}}}
            >
              Don't have an account - 
              <Link to="#">
                Register now
              </Link>
            </Typography>
          </Box>
          {/* footer*/}

          {/* Loading box */}
          {onRequest && (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                height: "100%",
                width: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                bgcolor: colors.common.white,
                zIndex: 1000
              }}
            >
              <Box position="relative">
                <CircularProgress 
                  variant="determinate"
                  sx={{ color: colors.grey[200]}}
                  size={100}
                  value={100}
                />
                <CircularProgress 
                  variant="determinate"
                  disableShrink
                  value={loginProgress}
                  size={100}
                  sx={{
                    [`&.${circularProgressClasses.circle}`]: {
                      strokeLinecap: "round"
                    },
                    position: "absolute",
                    left: 0,
                    color: colors.green[600]
                  }}
                />
              </Box>
            </Stack>
          )}
          {/* Loading box */}
        </Box>
      </Box>
      {/* Login form */}
    </Box>
  )
}

export default LoginPage