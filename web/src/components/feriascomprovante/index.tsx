import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Employee } from '@/types/employee';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

interface ComprovanteFeriasProps {
  employees: Employee[]; // Certifique-se de ter a definição correta do tipo Employee
}

const ComprovanteFerias: React.FC<ComprovanteFeriasProps> = ({ employees }) => (
  <Document>
    {employees.map((employee, index) => (
      <Page key={index} size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Nome: {employee.nome}</Text>
          <Text>Matrícula: {employee.matricula}</Text>
          <Text>CPF: {employee.cpf}</Text>
          {/* Adicione mais campos conforme necessário */}
        </View>
      </Page>
    ))}
  </Document>
);

export default ComprovanteFerias;
