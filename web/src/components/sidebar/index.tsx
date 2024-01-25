import * as React from 'react';
import Box from '@mui/joy/Box';
import Drawer from '@mui/joy/Drawer';
import Button from '@mui/joy/Button';
import List from '@mui/joy/List';
import Divider from '@mui/joy/Divider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import LogoMunicipio from 'next/image'
import { Avatar, Chip, DialogContent, DialogTitle, IconButton, Tooltip, Typography } from '@mui/joy';
import ReorderIcon from '@mui/icons-material/Reorder';
import CloseIcon from '@mui/icons-material/Close';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { FavoriteBorder } from '@mui/icons-material';

export default function DrawerTransition() {
    const [open, setOpen] = React.useState(true);

    return (
        <React.Fragment>

            <div className='sidebar' style={{ margin: '10px' }}>
                <Tooltip
                    title="Expandir"
                    size='sm'
                    variant='plain'
                >
                    <Button variant='outlined' onClick={() => setOpen(true)}>
                        <ReorderIcon />
                    </Button>
                </Tooltip>
            </div>

            <Drawer
                open={open}
                size='sm'
                onClose={() => setOpen(false)}
                sx={{
                    '--Drawer-transitionDuration': open ? '0.4s' : '0.4s',
                    '--Drawer-transitionFunction': open
                        ? 'cubic-bezier(0.79,0.14,0.15,0.86)'
                        : 'cubic-bezier(0.77,0,0.18,1)',
                }}
            >
                <Box role="presentation" sx={{ p: 2 }}>
                    <div className='autentication' style={{ display: 'flex', justifyContent: '' }}>
                        <div className='sidebar-recolher' style={{ margin: '1px' }}>
                            <Tooltip
                                title="Recolher"
                                size='sm'
                                variant='plain'
                            >
                                <Button size='sm' variant='outlined' onClick={() => setOpen(false)}>
                                    <CloseIcon />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
                        <LogoMunicipio src='/logoreino.png' alt='Logo Município' width='100' height='100' />
                        <Chip
                            color="primary"
                            size="sm"
                            variant="soft"
                        >
                            Município de Teste
                        </Chip>
                    </div>
                    <DialogContent>
                        <Divider orientation='horizontal'>Controle de Funcionários</Divider>
                        <List>

                        <a href="/">
                        <ListItem>
                        <ListItemButton>Servidores</ListItemButton>
                        </ListItem>
                        </a>

                        <a href="ferias">
                        <ListItem>
                        <ListItemButton>Férias</ListItemButton>
                        </ListItem>
                        </a>

                        <ListItem>
                        <ListItemButton>Licenças Médicas</ListItemButton>
                        </ListItem>

                        </List>

                        
                        <Divider orientation='horizontal'>Relatórios</Divider>
                        <List>
                            {['Gerar Relatório'].map((text) => (
                                <ListItem key={text}>
                                    <ListItemButton>{text}</ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </DialogContent>
                </Box>


                <div style={{ position: 'absolute', bottom: '0', width: '100%' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            p: 1.5,
                            pb: 2,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Avatar size="lg" />
                        <div>
                            <Typography level="title-md">user_name</Typography>
                            <Typography level="body-sm">role_name</Typography>
                        </div>
                            <IconButton
                              sx={{
                                "--IconButton-size": "50px"
                              }}
                            >
                                <ExitToAppIcon />
                            </IconButton>
                    </Box>
                </div>
            </Drawer>
        </React.Fragment>
    );
}