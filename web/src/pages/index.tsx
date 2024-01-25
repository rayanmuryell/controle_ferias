import Image from 'next/image'
import { Inter } from 'next/font/google'
import BasicCard from '@/components/card'
import DrawerTransition from '@/components/sidebar'
import TableHover from '@/components/table'
import { Employee } from '@/types/employee'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  return (
    <>
    
    <DrawerTransition />
    <TableHover />
    </>
  )
}
