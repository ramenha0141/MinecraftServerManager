import { Alert, Avatar, Box, Button, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Snackbar } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import DeleteIcon from '@mui/icons-material/Delete';

const ServerAPI = window.ServerAPI;

type alertType = 'createSuccess' | 'createFailed' | 'deleteSuccess' | 'deleteFailed' | 'restoreSuccess' | 'restoreFailed';

const Backup = () => {
    const [backups, setBackups] = useState<number[]>([]);
    const [isShowAlert, setIsShowAlert] = useState<boolean>(false);
    const [alertType, setAlertType] = useState<alertType>();
    useEffect(() => {
        ServerAPI.getBackups().then((backups) => setBackups(backups));
    }, []);
    return useMemo(() => {
        const handleClickBackup = async () => {
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
        return (
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', pb: 2 }}>
                    <Button variant='contained' onClick={handleClickBackup}>バックアップを作成する</Button>
                </Box>
                <List component={Paper} sx={{ flexGrow: 1 }}>
                    {
                        backups.map((backup, i) => (
                            <ListItem
                                key={i}
                                disablePadding
                                secondaryAction={
                                    <IconButton edge='end'>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemButton>
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
            </Box>
        );
    }, [backups, isShowAlert, alertType]);
};
export default Backup;