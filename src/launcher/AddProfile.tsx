import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';

const LauncherAPI = window.LauncherAPI;

const AddProfile = (props: { open: boolean, onClose: () => void }) => {
    const [errorText, setErrorText] = useState<string>('');
    const [profileId, setProfileId] = useState<string>('');
    const [profilePath, setProfilePath] = useState<string>('');
    useEffect(() => {
        setErrorText('');
        setProfileId('');
        setProfilePath('');
    }, [props.open]);
    const handleClickPath = async () => {
        const path = await LauncherAPI.showFolderSelector();
        if (path) setProfilePath(path);
    };
    const handleClickCreate = async () => {
        if (!profileId) {
            setErrorText('プロファイル名は必須です');
            return;
        }
        if (!profilePath) {
            setErrorText('パスは必須です');
            return;
        }
        const profiles = await LauncherAPI.getProfiles();
        if (profiles[profileId]) {
            setErrorText('そのプロファイル名は既に使われています');
            return;
        }
        profiles[profileId] = { path: profilePath };
        LauncherAPI.setProfiles(profiles);
        props.onClose();
    };
    return (
        <Dialog fullWidth open={props.open} onClose={props.onClose}>
            <DialogTitle>プロファイルを作成</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {
                        errorText && <Alert severity='error'>{errorText}</Alert>
                    }
                    <TextField
                        variant='standard'
                        label='プロファイル名'
                        required
                        value={profileId}
                        onChange={(event) => setProfileId(event.target.value)}
                        sx={{ mb: 1 }}
                    />
                    <TextField
                        variant='standard'
                        label='パス'
                        required
                        value={profilePath}
                        onClick={handleClickPath}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ mb: 1, mr: 1 }}>
                <Button variant='outlined' onClick={props.onClose}>キャンセル</Button>
                <Button variant='contained' onClick={handleClickCreate}>作成</Button>
            </DialogActions>
        </Dialog>
    );
};
export default AddProfile;