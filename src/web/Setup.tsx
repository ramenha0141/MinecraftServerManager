import { Backdrop, Box, Button, CircularProgress, Step, StepLabel, Stepper } from '@mui/material';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { isInstalledState } from './globalState';

const ServerAPI = window.ServerAPI;

const steps = ['Install', 'EULA', 'Finish'];
const Setup = () => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const setIsInstalled = useSetRecoilState(isInstalledState);
    const handleInstall = async () => {
        setIsProcessing(true);
        const isInstallSuccess = await ServerAPI.install();
            setIsProcessing(false);
        if (isInstallSuccess) {
            setCurrentStep(1);
        }
    };
    const handleAgree = async () => {
        setCurrentStep(2);
    };
    const handleFinish = async () => {
        setCurrentStep(3);
        setIsInstalled(true);
    };
    return (
        <Box sx={{
            flexGrow: 1,
            px: 4,
            py: 4,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{
                flexGrow: 1,
                pb: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {
                    currentStep === 0
                        ? (
                            <Button
                                variant='contained'
                                size='large'
                                onClick={handleInstall}
                            >Install</Button>
                        ) : currentStep === 1
                            ? (
                                <>
                                    <webview
                                        src='https://account.mojang.com/documents/minecraft_eula'
                                        style={{ flexGrow: 1, width: '80%' }}
                                    />
                                    <Button
                                        variant='contained'
                                        sx={{ mt: 1 }}
                                        onClick={handleAgree}
                                    >Agree</Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant='contained'
                                        size='large'
                                        onClick={handleFinish}
                                    >Finish</Button>
                                </>
                            )
                }
            </Box>
            <Stepper activeStep={currentStep}>
                {
                    steps.map((step, i) => {
                        return (
                            <Step key={step} completed={i < currentStep}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        )
                    })
                }
            </Stepper>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isProcessing}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
};
export default Setup;