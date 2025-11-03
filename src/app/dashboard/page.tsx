import { Container } from "@/components/container";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { TicketItem } from "./components/ticket";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ButtonRefresh } from "./components/button";

import prisma from "@/lib/prisma";

export default async function Dashboard(){
    const session = await getServerSession(authOptions)

    if(!session || !session.user){
        redirect("/")
    }

    const tickets = await prisma.ticket.findMany({
        where: {
            status: "Aberto",
            customer:{
                userId: session.user.id
            }
        },
        include:{
            customer: true
        }
    })



    return(
        <Container>
            <main className="mt-4 mb-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Chamados</h1>
                    <div className="flex items-center gap-3">
                        <ButtonRefresh/>
                        <Link href="/dashboard/new" className="px-4 bg-blue-500 py-1 text-white rounded">Abrir Chamado</Link>
                    </div>
                </div>
                <table className="min-w-full my-2">
                    <thead>
                        <tr>
                            <th className="font-medium text-left pl-1">Cliente</th>
                            <th className="font-medium text-left hidden sm:block">Data Cadastro</th>
                            <th className="font-medium text-left">Status</th>
                            <th className="font-medium text-left">Acções</th>
                        </tr>
                    </thead>
                    <tbody>
                       {tickets.map(ticket => (
                            <TicketItem 
                                key={ticket.id}
                                customer={ticket.customer}
                                ticket={ticket}
                            />
                       ))}
                    </tbody>
                </table>

                {tickets.length === 0 && (
                    <h1 className="px-2 md:px-0 text-gray-500">Nenhum ticket aberto foi encontrado...</h1>
                )}
            </main>
        </Container>
    )
} 