import { CircularProgress, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import propertiesData from './propertiesData';

const ServerAPI = window.ServerAPI;

const Config = () => {
    const [properties, setProperties] = useState<{ [key: string]: string }>();
    useEffect(() => {
        ServerAPI.getConfig().then((properties) => {
            setProperties(properties);
        });
    }, []);
    if (!properties) return (
        <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </Box>
    );
    return (
        <TableContainer component={Paper} sx={{ flex: '1 1 0', overflowY: 'scroll' }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>名前</TableCell>
                        <TableCell align='right'>値</TableCell>
                        <TableCell align='right'>デフォルト値</TableCell>
                        <TableCell align='right'>説明</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ userSelect: 'text' }}>
                    {
                        Object.entries(propertiesData).map(([name, { isBool, defaultValue, detail }]) => {
                            if (isBool) {
                                const value = properties[name] ?? defaultValue;
                                const handleChange = (event: SelectChangeEvent) => {
                                    const newProperties = { ...properties };
                                    newProperties[name] = event.target.value;
                                    setProperties(newProperties);
                                    ServerAPI.setConfig(newProperties);
                                };
                                return (
                                    <TableRow
                                        key={name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>{name}</TableCell>
                                        <TableCell align='right'>
                                            <Select
                                                size='small'
                                                value={value}
                                                onChange={handleChange}
                                                sx={{ color: value === 'true' ? 'green' : 'red' }}
                                            >
                                                <MenuItem value={'true'} sx={{ color: 'green' }}>true</MenuItem>
                                                <MenuItem value={'false'} sx={{ color: 'red' }}>false</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell align='right' sx={{ color: defaultValue === 'true' ? 'green' : 'red' }}>{defaultValue}</TableCell>
                                        <TableCell align='right'>{detail}</TableCell>
                                    </TableRow>
                                );
                            } else {
                                const value = properties[name] ?? defaultValue;
                                const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                                    const newProperties = { ...properties };
                                    newProperties[name] = event.target.value;
                                    setProperties(newProperties);
                                    ServerAPI.setConfig(newProperties);
                                    console.log('change')
                                };
                                return (
                                    <TableRow key={name}>
                                        <TableCell>{name}</TableCell>
                                        <TableCell align='right'>
                                            <TextField
                                                variant='standard'
                                                multiline
                                                value={value}
                                                onChange={handleChange}
                                                sx={{ textarea: { color: 'darkblue', textAlign: 'center' } }}
                                                disabled={name === 'level-name'}
                                            />
                                        </TableCell>
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