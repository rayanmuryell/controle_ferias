import Image from 'next/image'
import { Inter } from 'next/font/google'
import DrawerTransition from '@/components/sidebar'
import TableHover_Ferias from '@/components/table_ferias'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {


  return (
    <>
    <DrawerTransition />
    <TableHover_Ferias />
    </>
  )
}
