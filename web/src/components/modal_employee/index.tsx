import * as React from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog, { ModalDialogProps } from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import Option from '@mui/joy/Option';
import Select, { selectClasses } from '@mui/joy/Select';
import { KeyboardArrowDown } from '@mui/icons-material';
import { mask } from "./cpfmask"
import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { formatISO } from 'date-fns';
import { parse } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import SnackbarWithDecorators from '../snackbar';
import { Employee } from '@/types/employee';
import { format } from "date-fns";


interface NewEmployeeModalProps {
    id: number | null;
    selectedEmployee: Employee | null;
    setSelectedEmployee: React.Dispatch<React.SetStateAction<Employee | null>>;
    setLayout: React.Dispatch<React.SetStateAction<ModalDialogProps['layout'] | undefined>>;
    employeeList: Employee[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
}


export default function NewEmployeeModal(props: NewEmployeeModalProps) {

    const [valor, setValor] = useState('')
    const [matricula, setMatricula] = useState<number | string>('');
    const [nome, setNome] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [dataAdmissao, setdataAdmissao] = useState('');
    const [cpf, setCpf] = useState('');
    const [secretaria, setSecretaria] = useState('');
    const [mensagemDialog, setMensagemDialog] = useState('')
    const [colorDialog, setcolorDialog] = useState('')
    const [variantDialog, setvariantDialog] = useState('')
    const [isEditMode, setIsEditMode] = useState(false);


    // Atualiza os estados iniciais com base no modo de edição
    useEffect(() => {
        if (!props.id) {
            // Limpa os estados ao entrar no modo de novo cadastro
            setMatricula('');
            setNome('');
            setDataNascimento('');
            setdataAdmissao('');
            setCpf('');
            setSecretaria('');
        } else {
            const parseDate = new Date(props.selectedEmployee?.dataNascimento || '');
            const _datanascimentoformat = format(parseDate, "yyyy-MM-dd")

            const parseDateAdmissao = new Date(props.selectedEmployee?.dataAdmissao || '');
            const _dataAdmissaoformat = format(parseDateAdmissao, "yyyy-MM-dd")


            // Se estiver no modo de edição e houver um funcionário selecionado, atualize os estados
            setMatricula(props.selectedEmployee?.matricula || '');
            setNome(props.selectedEmployee?.nome || '');
            setDataNascimento(_datanascimentoformat);
            setdataAdmissao(_dataAdmissaoformat);
            setCpf(props.selectedEmployee?.cpf || '');
            setSecretaria(props.selectedEmployee?.secretaria || '');
            props.setOpen(true);
        }
    }, [props.id, props.selectedEmployee]);







    const handleChange = (event: React.ChangeEvent<{ value: string }>, value: string) => {
        // Atualiza o estado local com o valor selecionado
        console.log(value)
        setSecretaria(value);
    };

    const handleClose = () => {
        setIsEditMode(false);  // Setar como false para abrir o mesmo item, caso queira. 
    };


    function handleChangeMask(event: any) {
        const { value } = event.target

        setValor(mask(value))
    }

    function handleClearMask() {
        setValor('')
    }

    const [openSnackbar, setOpenSnackbar] = React.useState<boolean>(false);

    const showMsg = (mensagem: string, color: string, variant: string) => {
        setMensagemDialog(mensagem);
        setcolorDialog(color);
        setvariantDialog(variant);
        setOpenSnackbar(true);
    }

    const apiUrl = 'http://localhost:3333'; // ou o endereço real da sua API

    const handleSubmit = async () => {
        try {
            // Converte a string de data para um objeto Date
            const parsedDate = parse(dataNascimento, 'yyyy-MM-dd', new Date());
            const parsedDateAdmissao = parse(dataAdmissao, 'yyyy-MM-dd', new Date());

            // Garante que a data seja válida antes de enviar
            if (isNaN(parsedDate.getTime())) {
                console.error('Erro: Data de Nascimento inválida');
                return;
            }

            // Converte para o fuso horário UTC antes de enviar
            const utcDate = utcToZonedTime(parsedDate, 'UTC');
            const utcDateAdmissao = utcToZonedTime(parsedDateAdmissao, 'UTC');

            const cpfWithoutMask = cpf.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

            let response: AxiosResponse<any, any>

            if (!props.id) {

                response = await axios.post(`${apiUrl}/newEmployee`, {
                    matricula,
                    nome,
                    dataNascimento: formatISO(utcDate),
                    dataAdmissao: formatISO(utcDateAdmissao),
                    cpf: cpfWithoutMask, // Use o valor sem máscara
                    secretaria,
                });

            } else {

                response = await axios.put(`${apiUrl}/editEmployee/${props.id}`, {
                    matricula,
                    nome,
                    dataNascimento: formatISO(utcDate),
                    dataAdmissao: formatISO(utcDateAdmissao),
                    cpf: cpfWithoutMask, // Use o valor sem máscara
                    secretaria,
                });
            }

            console.log('Dados antes de enviar para a API:', {
                matricula,
                nome,
                dataNascimento: formatISO(utcDate),
                dataAdmissao: formatISO(utcDateAdmissao),
                cpf: cpfWithoutMask,
                secretaria,
            });

            if (response.status === 201) {
                console.log('Funcionário cadastrado com sucesso!');
                if (!props.id) {
                    showMsg('Funcionário cadastrado com sucesso.', 'success', 'outlined')
                } else {
                    showMsg('Funcionário editado com sucesso.', 'success', 'outlined')
                }

            } else {
                console.error('Erro ao cadastrar ou editar o funcionário:', response.data);
            }
        } catch (error) {
            console.error('Erro na solicitação:', error);
            showMsg('Houve um erro na solicitação. Verifique os campos digitados.', 'danger', 'outlined')
        } finally {
            props.setOpen(false);
            handleClearMask();
        }
    };


    // Verifica se o modal foi fechado. Caso sim, define o modo edição como FALSE para permitir abrir o mesmo modal novamente.
    const wasClosed = () => {
        props.setOpen(false)
        setIsEditMode(false);
        console.log('Janela fechada.')
    }

    const [selectedSecretaria, setSelectedSecretaria] = useState(
        props.id ? props.selectedEmployee?.secretaria || '' : ''
    );

    useEffect(() => {
        if (props.selectedEmployee?.secretaria) {
            setSelectedSecretaria(props.selectedEmployee.secretaria);
        }
    }, [props.selectedEmployee?.secretaria]);

    return (
        <React.Fragment>
            <Modal open={props.open} onClose={() => { wasClosed(); props.setOpen(false); }}>
                <ModalDialog size="lg">
                    <DialogTitle>Cadastro de Funcionário</DialogTitle>
                    <DialogContent>Preencha os campos do funcionário.</DialogContent>
                    <form
                        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            handleSubmit(); // Chame a função de envio aqui
                        }}
                    >
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>Matrícula</FormLabel>
                                <Input type='number' autoFocus required onChange={(e) => setMatricula(parseInt(e.target.value, 10) || '')} value={matricula} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Nome</FormLabel>
                                <Input autoFocus required onChange={(e) => setNome(e.target.value)} value={nome} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Data de Nascimento</FormLabel>
                                <Input
                                    required
                                    type='date'
                                    onChange={(e) => {
                                        setDataNascimento(e.target.value)

                                        console.log(e.target.value)

                                    }}
                                    value={dataNascimento}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Data de Admissão</FormLabel>
                                <Input
                                    required
                                    type='date'
                                    onChange={(e) => setdataAdmissao(e.target.value)}
                                    value={dataAdmissao}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>CPF</FormLabel>
                                <Input required onChange={(e) => {
                                    setValor(mask(e.target.value));
                                    setCpf(e.target.value);
                                }} value={cpf} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Secretaria</FormLabel>

                                <Select
                                    placeholder="Selecione uma secretaria..."
                                    indicator={<KeyboardArrowDown />}
                                    onChange={handleChange as any}
                                    value={secretaria}
                                    sx={{
                                        minWidth: 1,
                                        [`& .${selectClasses.indicator}`]: {
                                            transition: '0.2s',
                                            [`&.${selectClasses.expanded}`]: {
                                                transform: 'rotate(-180deg)',
                                            },
                                        },
                                    }}
                                >
                                    <Option value="Secretaria de Administração">Secretaria de Administração</Option>
                                    <Option value="Secretaria de Educação">Secretaria de Educação</Option>
                                    <Option value="Secretaria de Saúde">Secretaria de Saúde</Option>
                                    <Option value="Secretaria de Assistência Social">Secretaria de Assistência Social</Option>
                                </Select>

                            </FormControl>
                            <Button type="submit" variant='outlined'>Salvar</Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
            <SnackbarWithDecorators open={openSnackbar} setOpen={setOpenSnackbar} mensagem={mensagemDialog} color={colorDialog} variant={variantDialog} />
        </React.Fragment>
    );
}