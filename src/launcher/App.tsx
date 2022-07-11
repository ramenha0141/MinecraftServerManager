import { AppBar, Avatar, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, Paper, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { Profiles } from '../@types/global';

const LauncherAPI = window.LauncherAPI;

const App = () => {
    const [profiles, setProfiles] = useState<Profiles | null>(null);
    useEffect(() => {
        LauncherAPI.getProfiles().then((profiles) => {
            setProfiles(profiles);
        });
    }, []);
    if (!profiles) return <Box sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', userSelect: 'none' }}></Box>;
    return (
        <Box sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', userSelect: 'none' }}>
            <AppBar position='static'>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Minecraft Server Manager
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{ flexGrow: 1, px: 4, pb: 4, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton color='primary'>
                        <AddIcon />
                    </IconButton>
                </Box>
                <List component={Paper} sx={{ flexGrow: 1 }}>
                    {
                        Object.keys(profiles).length === 0
                            ? <Typography variant='h6' component='div' color='GrayText' sx={{ m: 4 }}>
                                "+" をクリックしてプロファイルを作成してください
                            </Typography>
                            : Object.entries(profiles).map(([profileId, profile], i) => (
                                <ListItemButton key={i} onClick={() => LauncherAPI.launch(profileId)}>
                                    <ListItemAvatar>
                                        <Avatar>{profile.version ?? '?'}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={profileId} secondary={profile.path} />
                                </ListItemButton>
                            ))
                    }
                </List>
            </Box>
        </Box>
    );
};
export default App;