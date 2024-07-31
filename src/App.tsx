import { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import RecursiveList from './components/RecursiveList';
import { ListItemType } from './types/types';
import { Brightness4, Brightness7 } from '@mui/icons-material';
// import data from './data.json';
import data from './data2.json';

const typedData: ListItemType[] = data as ListItemType[];

const App = (): JSX.Element => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      ...(darkMode && {
        background: {
          default: '#424242',
          paper: '#616161',
        },
        text: {
          primary: '#e0e0e0',
          secondary: '#b0b0b0',
        },
      }),
    },
  });

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#424242' : '#f5f5f5';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [darkMode]);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="top"
          alignItems="center"
          minHeight="100vh"
          sx={{ backgroundColor: 'background.default', p: 2 }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            p={3}
            sx={{
              backgroundColor: 'background.paper',
              borderRadius: 2,
              boxShadow: 3,
              width: '100%',
              maxWidth: 800,
              color: 'text.primary',
            }}
          >
            <Typography variant="h4" gutterBottom>
              Recursive React Component
            </Typography>
            <Typography variant="h5" gutterBottom>
              File System
            </Typography>
            <RecursiveList items={typedData} />
            <IconButton onClick={handleThemeToggle} sx={{ position: 'absolute', top: 16, right: 16 }}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default App;