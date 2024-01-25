import * as React from 'react';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog, { ModalDialogProps } from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';

export default function LayoutModalDialog() {
  const [layout, setLayout] = React.useState<ModalDialogProps['layout'] | undefined>(
    undefined,
  );
  return (
    <React.Fragment>
      <Stack direction="column" spacing={1}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            setLayout('center');
          }}
        >
          Editar
        </Button>
      </Stack>
      <Modal open={!!layout} onClose={() => setLayout(undefined)}>
        <ModalDialog layout={layout}>
          <ModalClose />
          <DialogTitle>Modal Dialog</DialogTitle>
          <DialogContent>
            <div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt dolorem et in, porro ratione consectetur, veritatis aspernatur optio deleniti, repellat quas omnis fuga quia id alias. Qui recusandae molestiae accusamus.
            </div>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}