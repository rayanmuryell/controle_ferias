import * as React from 'react';
import Button from '@mui/joy/Button';
import PlaylistAddCheckCircleRoundedIcon from '@mui/icons-material/PlaylistAddCheckCircleRounded';
import Snackbar, { SnackbarProps } from '@mui/joy/Snackbar';


interface MensagemProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    mensagem: string
    color: string
    variant: string

}

export default function SnackbarWithDecorators(props: MensagemProps) {

    const { open, setOpen, mensagem } = props;
    const [color, setColor] = React.useState<SnackbarProps['color']>('neutral');

    return (
        <React.Fragment>
            <Snackbar
                variant="soft"
                color={color}
                open={open}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                startDecorator={<PlaylistAddCheckCircleRoundedIcon />}
                autoHideDuration={5000}
                endDecorator={
                    <Button
                        onClick={() => setOpen(false)}
                        size="sm"
                        variant="soft"
                        color={color}
                    >
                        Fechar
                    </Button>
                }
            >
                {mensagem}
            </Snackbar>
        </React.Fragment>
    );
}