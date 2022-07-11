import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const LauncherAPI = window.LauncherAPI;

const DeleteProfile = (props: { open: boolean, onClose: () => void, deleteProfileId: string }) => {
    const handleClickDelete = async () => {
        const profiles = await LauncherAPI.getProfiles();
        delete profiles[props.deleteProfileId];
        LauncherAPI.setProfiles(profiles);
        props.onClose();
    };
    return (
        <Dialog fullWidth open={props.open} onClose={props.onClose}>
            <DialogTitle>プロファイルを削除</DialogTitle>
            <DialogContent>
                <Alert severity='error'>プロファイルを削除しますか？</Alert>
            </DialogContent>
            <DialogActions sx={{ mb: 1, mr: 1 }}>
                <Button variant='outlined' onClick={props.onClose}>キャンセル</Button>
                <Button variant='contained' onClick={handleClickDelete}>削除</Button>
            </DialogActions>
        </Dialog>
    );
};
export default DeleteProfile;