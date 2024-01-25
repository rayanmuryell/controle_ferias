import * as React from 'react';
import Table from '@mui/joy/Table';
import NewEmployeeModal from '../modal_employee';
import { Employee } from '@/types/employee';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { formatarCPF } from '@/func/cpf_mask';
import { formatarData } from '@/func/format_date';
import { Button, ModalDialogProps } from '@mui/joy';
import PersonAddIcon from '@mui/icons-material/PersonAdd';


export async function getEmployee(): Promise<Employee[]> {
  try {
    const url = "http://localhost:3333/";
    const response = await axios.get(url);
    console.log(response.data.Employee); // Acesse a propriedade correta
    return response.data.Employee;
  } catch (error) {
    console.error('Error fetching employee data:', error);
    throw error;
  }
}





export default function TableHover() {

  interface TableHoverProps {
    // ... outros tipos, se houver
    selectedEmployee: Employee | null;
    setSelectedEmployee: React.Dispatch<React.SetStateAction<Employee | null>>;
  }

  const [employee, setEmployee] = useState<Employee[]>([]);
  const [isOpen, setIsOpen] = useState(false);



  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const employees = await getEmployee();
        console.log(employees); // Verifique se os dados estão presentes aqui
        setEmployee(employees);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchEmployeeData();
  }, []);

  const [layout, setLayout] = React.useState<ModalDialogProps['layout'] | undefined>(
    undefined,
  );

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setLayout('center'); // Abre o modal
  };

  return (
    <div className='margins' style={{ marginLeft: '15%', marginRight: '15%', marginTop: '2%' }}>
      <div className='button_add' style={{ display: 'flex', justifyContent: 'start', marginBottom: '10px' }}>
        <NewEmployeeModal
          id={selectedEmployee?.id || null}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          setLayout={setLayout}
          employeeList={employee}
          setOpen={setIsOpen}
          open= {isOpen}
        />
        <Button
          color="success"
          onClick={() => {
            setSelectedEmployee(null);  // Garante que está no modo de novo cadastro
            setIsOpen(true);
          }}
          variant="outlined"
        >
          <PersonAddIcon style={{ marginRight: '5px' }} /> Novo Cadastro
        </Button>
      </div>
      <Table hoverRow borderAxis='both'>
        <thead>
          <tr>
            <th style={{ textAlign: 'center' }}>Matrícula</th>
            <th style={{ width: '30%', textAlign: 'center' }}>Nome</th>
            <th style={{ textAlign: 'center' }}>Nascimento</th>
            <th style={{ textAlign: 'center' }}>CPF</th>
            <th style={{ width: '20%', textAlign: 'center' }}>Secretaria</th>
            <th style={{ textAlign: 'center' }}>Ação</th>
          </tr>
        </thead>
        <tbody>
          {employee && employee.map((employee: Employee) => (
            <tr key={employee.matricula}>
              <td>{employee.matricula}</td>
              <td>{employee.nome}</td>
              <td>{formatarData(employee.dataNascimento)}</td>
              <td>{formatarCPF(employee.cpf)}</td>
              <td>{employee.secretaria}</td>
              <td style={{ textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setLayout('center');
                    setSelectedEmployee(employee);
                    setIsOpen(true);
                  }}
                >
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}