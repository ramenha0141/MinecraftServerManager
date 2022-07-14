import { Box, Button } from '@mui/material';
import { useMemo } from 'react';

const Backup = () => {
    return useMemo(() => {
        return (
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant='contained'>バックアップを作成する</Button>
                </Box>
            </Box>
        );
    }, []);
};
export default Backup;