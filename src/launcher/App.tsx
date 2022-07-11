import { AppBar, Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, TextField, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { Profiles } from '../@types/global';
import AddProfile from './AddProfile';
import DeleteProfile from './DeleteProfile';

const LauncherAPI = window.LauncherAPI;

const App = () => {
    const [profiles, setProfiles] = useState<Profiles | null>(null);
    const [isShowCreateDialog, setIsShowCreateDialog] = useState(false);
    const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);
    const [deleteProfileId, setDeleteProfileId] = useState<string>('');
    useEffect(() => {
        LauncherAPI.getProfiles().then((profiles) => {
            setProfiles(profiles);
        });
    }, [isShowCreateDialog, isShowDeleteDialog]);
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
                    <IconButton color='primary' onClick={() => setIsShowCreateDialog(true)}>
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
                                <ListItem
                                    key={i}
                                    disablePadding
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={() => {
                                            setDeleteProfileId(profileId);
                                            setIsShowDeleteDialog(true);
                                        }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemButton
                                        onClick={() => LauncherAPI.launch(profileId)}
                                    >
                                        <ListItemAvatar>
                                            <Avatar>{profile.version ?? '?'}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={profileId} secondary={profile.path} />
                                    </ListItemButton>
                                </ListItem>

                            ))
                    }
                </List>
            </Box>
            <AddProfile open={isShowCreateDialog} onClose={() => setIsShowCreateDialog(false)} />
            <DeleteProfile open={isShowDeleteDialog} onClose={() => setIsShowDeleteDialog(false)} deleteProfileId={deleteProfileId} />
        </Box>
    );
};
export default App;