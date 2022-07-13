import { Box, Button } from '@mui/material';

const Backup = () => {
    return (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
                <Button variant='contained'>バックアップを作成する</Button>
            </Box>
        </Box>
    );
};
export default Backup;