import { IconButton, List } from '@mui/material';
import { Box } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';

const App = () => {
    return (
        <Box sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', userSelect: 'none' }}>
            <IconButton>
                <AddIcon></AddIcon>
            </IconButton>
            <List>
                
            </List>
        </Box>
    );
};
export default App;