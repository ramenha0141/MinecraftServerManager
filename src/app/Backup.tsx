import { Alert, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Snackbar } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import DeleteIcon from '@mui/icons-material/Delete';

const ServerAPI = window.ServerAPI;

type alertType = 'createSuccess' | 'createFailed' | 'deleteSuccess' | 'deleteFailed' | 'restoreSuccess' | 'restoreFailed';

const Backup = () => {
    const [backups, setBackups] = useState<number[]>([]);
    const [isShowAlert, setIsShowAlert] = useState<boolean>(false);
    const [alertType, setAlertType] = useState<alertType>();
    const [isShowDeleteDialog, setIsShowDeleteDialog] = useState<boolean>(false);
    const [isShowRestoreDialog, setIsShowRestoreDialog] = useState<boolean>(false);
    const [backup, setBackup] = useState<number>(0);
    useEffect(() => {
        ServerAPI.getBackups().then((backups) => setBackups(backups));
    }, []);
    return useMemo(() => {
        const handleClickCreate = async () => {
            const isSuccess = await ServerAPI.createBackup();
            if (isSuccess) {
                showAlert('createSuccess');
                setBackups(await ServerAPI.getBackups());
            } else {
                showAlert('createFailed');
            }
        };
        const showAlert = (type: alertType) => {
            setAlertType(type);
            setIsShowAlert(true);
        };
        const handleAlertClose = () => setIsShowAlert(false);
        const showDeleteDialog = (backup: number) => {
            setBackup(backup);
            setIsShowDeleteDialog(true);
        };
        const handleClickDelete = async () => {
            const isSuccess = await ServerAPI.deleteBackup(backup);
            if (isSuccess) {
                showAlert('deleteSuccess');
                setBackups(await ServerAPI.getBackups());
            } else {
                showAlert('deleteFailed');
            }
            setIsShowDeleteDialog(false);
        };
        const showRestoreDialog = (backup: number) => {
            setBackup(backup);
            setIsShowRestoreDialog(true);
        };
        const handleClickRestore = async () => {
            const isSuccess = await ServerAPI.restore(backup);
            if (isSuccess) {
                showAlert('restoreSuccess');
                setBackups(await ServerAPI.getBackups());
            } else {
                showAlert('restoreFailed');
            }
            setIsShowRestoreDialog(false);
        };
        return (
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', pb: 2 }}>
                    <Button variant='contained' onClick={handleClickCreate}>バックアップを作成する</Button>
                </Box>
                <List component={Paper} sx={{ flexGrow: 1 }}>
                    {
                        backups.map((backup, i) => (
                            <ListItem
                                key={i}
                                disablePadding
                                secondaryAction={
                                    <IconButton edge='end' onClick={() => showDeleteDialog(backup)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemButton onClick={() => showRestoreDialog(backup)}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <BackupRestoreIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={(new Date(backup)).toLocaleString()} />
                                </ListItemButton>
                            </ListItem>
                        ))
                    }
                </List>
                <Snackbar open={isShowAlert} autoHideDuration={5000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleAlertClose}>
                    <Alert severity={alertType && ['createFailed', 'deleteFailed', 'restoreFailed'].includes(alertType) ? 'error' : 'success'} sx={{ width: '100%' }} onClose={handleAlertClose}>
                        {
                            alertType === 'createSuccess'
                                ? 'バックアップが正常に作成されました'
                                : alertType === 'createFailed'
                                ? 'バックアップの作成に失敗しました'
                                : alertType === 'deleteSuccess'
                                ? 'バックアップを正常に削除しました'
                                : alertType === 'deleteFailed'
                                ? 'バックアップの削除に失敗しました'
                                : alertType === 'restoreSuccess'
                                ? 'データがバックアップから正常に復元されました'
                                : 'データの復元に失敗しました'
                        }
                    </Alert>
                </Snackbar>
                <DeleteDialog open={isShowDeleteDialog} onClose={() => setIsShowDeleteDialog(false)} backup={backup} handleClickDelete={handleClickDelete} />
                <RestoreDialog open={isShowRestoreDialog} onClose={() => setIsShowRestoreDialog(false)} backup={backup} handleClickRestore={handleClickRestore} />
            </Box>
        );
    }, [backups, isShowAlert, alertType, isShowDeleteDialog, isShowRestoreDialog, backup]);
};
export default Backup;

const DeleteDialog = (props: { open: boolean, onClose: () => void, backup: number, handleClickDelete: () => void }) => {
    return (
        <Dialog fullWidth open={props.open} onClose={props.onClose}>
            <DialogTitle>バックアップを削除</DialogTitle>
            <DialogContent>
                <Alert severity='error'>{(new Date(props.backup)).toLocaleString()} を削除しますか？</Alert>
            </DialogContent>
            <DialogActions sx={{ mb: 1, mr: 1 }}>
                <Button variant='outlined' onClick={props.onClose}>キャンセル</Button>
                <Button variant='contained' onClick={props.handleClickDelete}>削除</Button>
            </DialogActions>
        </Dialog>
    );
};
const RestoreDialog = (props: { open: boolean, onClose: () => void, backup: number, handleClickRestore: () => void }) => {
    return (
        <Dialog fullWidth open={props.open} onClose={props.onClose}>
            <DialogTitle>データを復元</DialogTitle>
            <DialogContent>
                <Alert severity='error'>データを{(new Date(props.backup)).toLocaleString()} から復元しますか？</Alert>
            </DialogContent>
            <DialogActions sx={{ mb: 1, mr: 1 }}>
                <Button variant='outlined' onClick={props.onClose}>キャンセル</Button>
                <Button variant='contained' onClick={props.handleClickRestore}>復元</Button>
            </DialogActions>
        </Dialog>
    );
};