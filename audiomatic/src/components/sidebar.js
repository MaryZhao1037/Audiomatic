import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import MenuIcon from '@rsuite/icons/Menu';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';

export default function TemporaryDrawer() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250, bgcolor: '#333', color: '#fff', height: '100%' }} role="presentation" onClick={toggleDrawer(false)}>
      {/* Title and Logo */}
      <ListItem>
        <ListItemButton onClick={() => navigate('/dashboard')}>
          <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
            <img 
              src="/logo.png" // Replace with your actual logo path
              alt="Audiomatic Logo"
              style={{ width: 40, height: 'auto', marginRight: 8 }}
            />
            <h1 style={{ fontSize: 18, margin: 0, color: '#fff' }}>Audiomatic</h1>
          </Box>
        </ListItemButton>
      </ListItem>

      <Divider sx={{ bgcolor: '#555' }} />

      {/* Navigation Items */}
      <List>
        {['Dashboard', 'Upload', 'History'].map((text, index) => {
          let icon;
          let route;
          if (text === 'Dashboard') {
            icon = <GridViewOutlinedIcon sx={{ color: '#fff' }} />;
            route = '/dashboard';
          } else if (text === 'Upload') {
            icon = <DriveFolderUploadOutlinedIcon sx={{ color: '#fff' }} />;
            route = '/upload';
          } else if (text === 'History') {
            icon = <HistoryOutlinedIcon sx={{ color: '#fff' }} />;
            route = '/history';
          }
          return (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => navigate(route)}>
                <ListItemIcon>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={text} primaryTypographyProps={{ style: { color: '#fff' } }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <div>
      <MenuIcon 
        onClick={toggleDrawer(true)} 
        style={{ marginTop:'20px', marginLeft:'20px', color: "white", fontSize: '2rem', cursor: 'pointer' }} 
      />
      <Drawer open={open} onClose={toggleDrawer(false)} PaperProps={{ sx: { bgcolor: '#333' } }}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
