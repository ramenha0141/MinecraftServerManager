import { Alert, Button, ButtonGroup, Snackbar } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import TerminalIcon from '@mui/icons-material/Terminal';
import { useMemo, useState } from 'react';

const ServerAPI = window.ServerAPI;

type alertType = 'startSuccess' | 'startFailed' | 'stopSuccess';

const Control = () => {
    const [isServerRunning, setIsServerRunning] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isShowAlert, setIsShowAlert] = useState<boolean>(false);
    const [alertType, setAlertType] = useState<alertType>();
    return useMemo(() => {
        const handleStart = async () => {
            if (isServerRunning) return;
            setIsProcessing(true);
            if (await ServerAPI.start()) {
                setIsServerRunning(true);
                showAlert('startSuccess');
            } else {
                showAlert('startFailed');
            }
            setIsProcessing(false);
        };
        const handleStop = async () => {
            if (!isServerRunning) return;
            setIsProcessing(true);
            if (await ServerAPI.stop()) {
                setIsServerRunning(false);
                showAlert('stopSuccess');
            }
            setIsProcessing(false);
        };
        const handleShowConsole = () => {
            ServerAPI.showConsole();
        };
        const showAlert = (type: alertType) => {
            setAlertType(type);
            setIsShowAlert(true);
        };
        const handleAlertClose = () => {
            setIsShowAlert(false);
        };
        return (
            <>
                <ButtonGroup variant='contained' sx={{ mr: 10, backgroundColor: '#fff' }}>
                    <LoadingButton
                        variant='outlined'
                        disabled={isServerRunning || isProcessing}
                        onClick={handleStart}
                        loading={isProcessing && !isServerRunning}
                    ><PlayArrowIcon /></LoadingButton>
                    <LoadingButton
                        variant='outlined'
                        disabled={!isServerRunning || isProcessing}
                        onClick={handleStop}
                        loading={isProcessing && isServerRunning}
                    ><StopIcon /></LoadingButton>
                    <Button
                        variant='outlined'
                        onClick={handleShowConsole}
                    ><TerminalIcon /></Button>
                </ButtonGroup>
                <Snackbar open={isShowAlert} autoHideDuration={5000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleAlertClose}>
                    <Alert severity={alertType === 'startFailed' ? 'error' : 'success'} sx={{ width: '100%' }} onClose={handleAlertClose}>
                        {
                            alertType === 'startSuccess'
                                ? '??????????????????????????????????????????'
                                : alertType === 'startFailed'
                                    ? '??????????????????????????????????????????'
                                    : '??????????????????????????????????????????'
                        }
                    </Alert>
                </Snackbar>
            </>
        );
    }, [isServerRunning, isProcessing, isShowAlert, alertType]);
};
export default Control;