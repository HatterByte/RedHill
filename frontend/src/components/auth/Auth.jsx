import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import LoginModal from './LoginModal';
import CreateAccount from './CreateAccount';

const Auth = ({ setOpenLogin, toggleLogin, setToggleLogin }) => {
  const handleTabChange = (event, newValue) => {
    setToggleLogin(newValue === 1); // 0 = login, 1 = signup
  };

  return (
    <>
      {/* Blurred Background */}
      <div
        className="fixed bg-black/70 backdrop-blur-sm h-screen w-screen z-40"
        onClick={() => setOpenLogin(false)}
      />

      {/* Centered Auth Box */}
      <Box
        className="fixed z-50"
        sx={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          position: 'fixed',
          width: '90vw',
          maxWidth: 550,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            px: 3,
            py: 4,
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Fancy MUI Tabs as buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              mb: 3,
              bgcolor: '#f0f0f0',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <Tabs
              value={toggleLogin ? 1 : 0}
              onChange={handleTabChange}
              variant="fullWidth"
              TabIndicatorProps={{ style: { display: 'none' } }}
              sx={{
                '& button': {
                  fontWeight: 600,
                  fontSize: '1rem',
                  borderRadius: '9999px',
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  color: '#75002b',
                  transition: '0.2s ease',
                },
                '& button.Mui-selected': {
                  backgroundColor: '#75002b',
                  color: 'white',
                },
              }}
            >
              <Tab label="Complaint Login" />
              <Tab label="Create Account" />
            </Tabs>
          </Box>

          {/* Conditional Rendering of Forms */}
          <Box sx={{ width: '100%' }}>
            {!toggleLogin && <LoginModal setToggleLogin={setToggleLogin} />}
            {toggleLogin && (
              <CreateAccount reset={() => setToggleLogin(false)} />
            )}
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Auth;
