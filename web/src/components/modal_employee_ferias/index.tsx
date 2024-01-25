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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import { formatISO } from 'date-fns';
import { parse } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import SnackbarWithDecorators from '../snackbar';
import { Employee } from '@/types/employee';
import { mask } from '../modal_employee/cpfmask';
import { Divider } from '@mui/material';
import { Select, Textarea, selectClasses, Option, TabPanel, Table } from '@mui/joy';
import { TDocumentDefinitions, StyleDictionary } from 'pdfmake/interfaces';
import pdfmake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Duplex } from 'stream';
import { KeyboardArrowDown } from '@mui/icons-material';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';


pdfmake.vfs = pdfFonts.pdfMake.vfs;
pdfmake.vfs = vfsFonts.pdfMake.vfs;

interface NewEmployeeModalProps {
    isEditMode: boolean;
    selectedEmployee: Employee | null;
    setSelectedEmployee: React.Dispatch<React.SetStateAction<Employee | null>>;
    setLayout: React.Dispatch<React.SetStateAction<ModalDialogProps['layout'] | undefined>>;
    employeeList: Employee[];
}

interface EmployeeData {
    matricula: number | string;
    nome: string;
    // Adicione mais campos conforme necessário
}


export default function NewEmployeeModal_Ferias(props: NewEmployeeModalProps) {

    const [valor, setValor] = useState('')
    const [matricula, setMatricula] = useState<number | string>('');
    const [nome, setNome] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [cpf, setCpf] = useState('');
    const [secretaria, setSecretaria] = useState('');
    const [TipoAfastamento, setTipoAfastamento] = useState('');
    const [mensagemDialog, setMensagemDialog] = useState('')
    const [colorDialog, setcolorDialog] = useState('')
    const [variantDialog, setvariantDialog] = useState('')
    const [isEditMode, setIsEditMode] = useState(false);
    const [dataSaida, setDataSaida] = useState('');
    const [dataRetorno, setDataRetorno] = useState('');
    const [observacao, setObservacao] = useState('');
    const [employeeList, setEmployeeList] = useState<Employee[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Atualiza os estados iniciais com base no modo de edição
    useEffect(() => {
        if (!props.isEditMode) {
            // Limpa os estados ao entrar no modo de novo cadastro
            setMatricula('');
            setNome('');
            setDataNascimento('');
            setCpf('');
            setSecretaria('');
        } else {
            // Se estiver no modo de edição e houver um funcionário selecionado, atualize os estados
            setMatricula(props.selectedEmployee?.matricula || '');
            setNome(props.selectedEmployee?.nome || '');
            setDataNascimento(props.selectedEmployee?.dataNascimento || '');
            setCpf(props.selectedEmployee?.cpf || '');
            setSecretaria(props.selectedEmployee?.secretaria || '');
            setOpen(true);
        }
    }, [props.isEditMode, props.selectedEmployee]);

    const handleClose = () => {
        setIsEditMode(false);  // Setar como false para abrir o mesmo item, caso queira. 
    };

    const handleChange = (event: React.ChangeEvent<{ value: string }>, value: string) => {
        // Atualiza o estado local com o valor selecionado
        console.log(value)
        setselectedTipoAfastamento(value);
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
    
        if (files && files.length > 0) {
          const selectedFile = files[0];
          console.log('Arquivo selecionado:', selectedFile);
    
          try {
            const formData = new FormData();
            formData.append('file', selectedFile);
    
            // Substitua 'SUA_API_ENDPOINT' pelo endpoint real da sua API
            const response = await axios.post(`${apiUrl}/anexos/:afastamentoid`, formData);
    
            console.log(response.data);
          } catch (error) {
            console.error('Erro ao fazer upload:', error);
          }
        }
      };


    function handleChangeMask(event: any) {
        const { value } = event.target

        setValor(mask(value))
    }

    function handleClearMask() {
        setValor('')
    }

    class PDFStream extends Duplex {
        _read() { }
        _write(chunk: Buffer, encoding: string, callback: () => void) {
            this.push(chunk);
            callback();
        }
    }


    function generatePDF(employeeData: EmployeeData): PDFStream {
        const docDefinition: TDocumentDefinitions = {
            content: [
                {
                    text: 'DECLARAÇÃO DE AUTORIZAÇÃO DE FÉRIAS',
                    style: 'header',
                    alignment: 'center',
                    marginBottom: 20,
                    decoration: 'underline',
                    fontSize: 14,
                    bold: true,
                },
                {
                    text: 'Declaro para os devidos fins que o(a) Sr(a) ',
                    style: 'none',
                },
                {
                    text: [
                        { text: employeeData.nome, decoration: 'underline' },
                        { text: '.' },
                    ],
                    style: 'none',
                },
                { text: `Matrícula: ${employeeData.matricula}`, style: 'subheader' },
                { text: `Nome: ${employeeData.nome}`, style: 'subheader' },
                // Adicione mais campos conforme necessário
            ],
            styles: {
                header: { fontSize: 18, bold: true, margin: [0, 10, 0, 10] },
                subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
            } as StyleDictionary,
        };

        const pdfStream = new PDFStream();

        // Use pdfmake para criar o documento PDF
        const pdfDocGenerator = pdfmake.createPdf(docDefinition);

        pdfDocGenerator.getBuffer((buffer) => {
            const bufferArray = new Uint8Array(buffer);
            pdfStream.push(bufferArray);
            pdfStream.push(null);
        });

        return pdfStream;
    }


    const [openSnackbar, setOpenSnackbar] = React.useState<boolean>(false);

    const showMsg = (mensagem: string, color: string, variant: string) => {
        setMensagemDialog(mensagem);
        setcolorDialog(color);
        setvariantDialog(variant);
        setOpenSnackbar(true);
    }

    const apiUrl = 'http://localhost:3333';

    const handleSubmit = async () => {
        try {
            if (!props.selectedEmployee) {
                console.error('Erro: Nenhum funcionário selecionado');
                return;
            }

            const parsedSaidaDate = parse(dataSaida, 'yyyy-MM-dd', new Date());
            const utcSaidaDate = utcToZonedTime(parsedSaidaDate, 'UTC');

            const parsedRetornoDate = parse(dataRetorno, 'yyyy-MM-dd', new Date());
            const utcRetornoDate = utcToZonedTime(parsedRetornoDate, 'UTC');

            const employeeId = props.selectedEmployee.id;

            const response = await axios.post(`${apiUrl}/ferias/${employeeId}`, {
                dataSaida: formatISO(utcSaidaDate),
                dataRetorno: formatISO(utcRetornoDate),
                periodo: periodo, // Certifique-se de que periodo está sendo definido corretamente no seu componente
                observacao: observacao, // Certifique-se de que observacao está sendo definido corretamente no seu componente
            });

            console.log('Dados antes de enviar para a API:', {
                dataSaida: formatISO(utcSaidaDate),
                dataRetorno: formatISO(utcRetornoDate),
                periodo: periodo,
                observacao: observacao,
            });

            if (response.status === 200) {
                console.log('Férias cadastrada com sucesso!');
                showMsg('Férias cadastrada com sucesso.', 'success', 'outlined');
                const employeeData = {
                    matricula,
                    nome,
                    // Adicione mais campos conforme necessário
                };
                const pdfDoc = generatePDF(employeeData);

                const chunks: Uint8Array[] = [];
                pdfDoc.on('data', (chunk: Uint8Array) => {
                    chunks.push(chunk);
                });

                pdfDoc.on('end', () => {
                    // Agora você pode usar os chunks para exibir ou baixar o PDF
                    const pdfBuffer = Buffer.concat(chunks);

                    // Exibir o PDF em uma nova guia
                    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
                    const fileURL = URL.createObjectURL(blob);
                    window.open(fileURL);

                    // Alternativamente, você pode baixar o PDF
                    // FileSaver.saveAs(blob, 'nome-do-arquivo.pdf');
                });
            } else {
                console.error('Erro ao cadastrar as férias:', response.data);
                console.log('Resposta da API:', response);
            }
        } catch (error) {
            console.error('Erro na solicitação:', error);
            showMsg('Houve um erro na solicitação. Verifique os campos digitados.', 'danger', 'outlined');
        } finally {
            setOpen(false);
            handleClearMask();
        }
    };






    // Verifica se o modal foi fechado. Caso sim, define o modo edição como FALSE para permitir abrir o mesmo modal novamente.
    const wasClosed = () => {
        setOpen(false)
        setIsEditMode(false);
        console.log('Janela fechada.')
        setPeriodo('')
    }

    const [selectedTipoAfastamento, setselectedTipoAfastamento] = useState(
        props.isEditMode ? props.selectedEmployee?.secretaria || '' : ''
    );


    const [open, setOpen] = React.useState<boolean>(false);

    const [periodo, setPeriodo] = useState<string>(''); // Estado para armazenar o valor formatado do período

    // Função para formatar o período e atualizar o estado
    const handlePeriodoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valorDigitado = e.target.value;

        // Remove caracteres não numéricos
        const numerosPeriodo = valorDigitado.replace(/\D/g, '');

        // Aplica a máscara de formatação
        const periodoFormatado = numerosPeriodo.replace(/(\d{4})(\d{4})/, '$1 - $2');

        setPeriodo(periodoFormatado);
    };

    return (
        <React.Fragment>
            <Button
                color="success"
                onClick={() => {
                    if (props.setSelectedEmployee) {
                        props.setSelectedEmployee(null);
                    }
                    setIsEditMode(false);  // Garante que está no modo de novo cadastro
                    setOpen(true);
                }}
                variant="outlined"
            >
                <PersonAddIcon style={{ marginRight: '5px' }} /> Novo Afastamento
            </Button>


            <Modal open={open} onClose={() => { wasClosed(); setOpen(false); }}>

                <ModalDialog size="sm" sx={{ height: '80vh', minWidth: '80vw', overflow: 'auto' }}>
                    <Tabs aria-label="Basic tabs" defaultValue={0}>
                        <TabList>
                            <Tab>Dados do Funcionário</Tab>
                            <Tab>Anexos</Tab>
                        </TabList>
                        <TabPanel value={0}>
                            <DialogTitle>Liberação de Férias</DialogTitle>
                            <DialogContent>Valide os dados do funcionários abaixo e preencha o período de férias do servidor.</DialogContent>
                            <form
                                onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                                    event.preventDefault();
                                    handleSubmit(); // Chame a função de envio aqui
                                }}
                            >

                                <Stack spacing={2}>
                                    <FormControl>
                                        <FormLabel>Matrícula</FormLabel>
                                        <Input disabled type='number' autoFocus required onChange={(e) => setMatricula(parseInt(e.target.value, 10) || '')} value={props.isEditMode ? props.selectedEmployee?.matricula || '' : ''} />
                                    </FormControl>
                                </Stack>
                                <FormControl>
                                    <FormLabel>Nome</FormLabel>
                                    <Input disabled autoFocus required onChange={(e) => setNome(e.target.value)} value={props.isEditMode ? props.selectedEmployee?.nome || '' : ''} />
                                </FormControl>
                                <Stack spacing={1} sx={{ textAlign: 'center', marginTop: 2 }}>
                                    <Divider orientation='horizontal'>Período do Afastamento</Divider>
                                    <FormControl>
                                        <FormLabel>Data de Saída</FormLabel>
                                        <Input type='date' autoFocus required onChange={(e) => setDataSaida(e.target.value)} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Data de Retorno</FormLabel>
                                        <Input type='date' autoFocus required onChange={(e) => setDataRetorno(e.target.value)} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Período</FormLabel>
                                        <Input autoFocus required value={periodo} onChange={handlePeriodoChange} />
                                    </FormControl>
                                    <Stack spacing={1} sx={{ textAlign: 'center', marginTop: 2 }}>
                                        <Divider orientation='horizontal'>Tipo do Afastamento</Divider>
                                        <Select
                                            placeholder="Selecione um motivo..."
                                            indicator={<KeyboardArrowDown />}
                                            onChange={handleChange as any}
                                            value={selectedTipoAfastamento}
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
                                            <Option value="FÉRIAS">Férias</Option>
                                            <Option value="LICENÇA MÉDICA">Licença Médica</Option>
                                        </Select>
                                    </Stack>
                                    <FormControl>
                                        <FormLabel>Observação</FormLabel>
                                        <Textarea minRows={1} sx={{ marginBottom: '10px' }} onChange={(e) => setObservacao(e.target.value)} />
                                    </FormControl>
                                    <Button type="submit" variant='outlined'>Enviar</Button>
                                </Stack>
                            </form>
                        </TabPanel>
                        <TabPanel value={1}>
                            
                            <div>
                            <Button variant='outlined'>
                                <label htmlFor="fileInput">
                                    <UploadIcon />
                                    <span>Fazer upload do anexo</span>
                                </label>
                                <input
                                    id="fileInput"
                                    type="file"
                                    hidden
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFileChange(event)}
                                />
                                </Button>
                            </div>
                            
                            <Table aria-label="basic table">

                                <thead>
                                    <tr>
                                        <th>Anexos</th>
                                        <th>Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Lista de Anexos</td>
                                        <td><Button onClick={function () { }} variant="outlined" ><DeleteIcon /></Button></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </TabPanel>
                    </Tabs>
                </ModalDialog>

            </Modal>

            <SnackbarWithDecorators open={openSnackbar} setOpen={setOpenSnackbar} mensagem={mensagemDialog} color={colorDialog} variant={variantDialog} />
        </React.Fragment>
    );
}