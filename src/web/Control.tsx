import { Alert, Button, ButtonGroup, Snackbar } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import SpeedIcon from '@mui/icons-material/Speed';
import TerminalIcon from '@mui/icons-material/Terminal';
import { useRecoilState } from 'recoil';
import { isServerRunningState } from './globalState';
import { useState } from 'react';

const ServerAPI = window.ServerAPI;

type alertType = 'startSuccess' | 'startFailed' | 'stopSuccess';

const Control = () => {
    const [isServerRunning, setIsServerRunning] = useRecoilState(isServerRunningState);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isShowAlert, setIsShowAlert] = useState<boolean>(false);
    const [alertType, setAlertType] = useState<alertType>();
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
                <Button
                    variant='outlined'
                    disabled={isServerRunning || isProcessing}
                    onClick={handleStart}
                ><PlayArrowIcon /></Button>
                <Button
                    variant='outlined'
                    disabled={!isServerRunning || isProcessing}
                    onClick={handleStop}
                ><StopIcon /></Button>
                <Button
                    variant='outlined'
                    disabled={!isServerRunning || isProcessing}
                ><SpeedIcon /></Button>
                <Button
                    variant='outlined'
                    disabled={!isServerRunning || isProcessing}
                ><TerminalIcon /></Button>
            </ButtonGroup>
            <Snackbar open={isShowAlert} autoHideDuration={5000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleAlertClose}>
                <Alert severity={alertType === 'startFailed' ? 'error' : 'success'} sx={{ width: '100%'}} onClose={handleAlertClose}>
                    {
                        alertType === 'startSuccess'
                            ? 'Server started successfully'
                            : alertType === 'startFailed'
                            ? 'Failed to start the Server'
                            : 'Server stopped successfully'
                    }
                </Alert>
            </Snackbar>
        </>
    );
};
export default Control;