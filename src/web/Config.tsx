import { CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import propertiesData from './propertiesData';

const ServerAPI = window.ServerAPI;

const Config = () => {
    const [properties, setProperties] = useState<{ [key: string]: string }>();
    useEffect(() => {
        ServerAPI.getConfig().then((properties) => setProperties(properties));
    }, []);
    if (!properties) return (
        <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </Box>
    );
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>name</TableCell>
                        <TableCell align='right'>value</TableCell>
                        <TableCell align='right'>default</TableCell>
                        <TableCell align='right'>detail</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ userSelect: 'text' }}>
                    {
                        Object.entries(propertiesData).map(([name, { isBool, defaultValue, detail }]) => {
                            if (isBool) {
                                const value = properties[name] === 'true' ?? defaultValue;
                                return (
                                    <TableRow key={name}>
                                        <TableCell>{name}</TableCell>
                                        <TableCell align='right' sx={{ color: value ? 'green' : 'red' }}>{value ? 'true' : 'false'}</TableCell>
                                        <TableCell align='right' sx={{ color: defaultValue ? 'green' : 'red' }}>{defaultValue ? 'true' : 'false'}</TableCell>
                                        <TableCell align='right'>{detail}</TableCell>
                                    </TableRow>
                                );
                            } else {
                                return (
                                    <TableRow key={name}>
                                        <TableCell>{name}</TableCell>
                                        <TableCell align='right' sx={{ color: 'darkblue' }}>{properties[name] ?? defaultValue}</TableCell>
                                        <TableCell align='right' sx={{ color: 'darkblue' }}>{defaultValue}</TableCell>
                                        <TableCell align='right'>{detail}</TableCell>
                                    </TableRow>
                                );
                            }
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
};
export default Config;