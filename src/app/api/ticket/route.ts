import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { error } from "console";

export async function PATCH(req: Request){
    const session = await getServerSession(authOptions);

    if(!session || !session.user){
        return NextResponse.json({error: "Not authorized"}, {status: 401});
    }

    const {id} = await req.json();

    const findTicket = await prisma.ticket.findFirst({
        where: {
            id: id as string
        }
    })

    if(!findTicket){
        return NextResponse.json({error: "Failed update ticket"}, {status: 400})
    }

    try {
        await prisma.ticket.update({

            where:{
                id: id as string
            },
            data:{
                status: "Fechado"
            }
        })
        return NextResponse.json({error: "Chamado atualizado com sucesso!"})
    } catch (error) {
        return NextResponse.json({error: "Failed to update ticket"}, {status: 400})
    }


}

export async function POST(req: Request){
    const {customerId, name, description} = await req.json();

    if(!customerId || !name || !description){
        return NextResponse.json({error: "Failed to create a new Ticket"}, {status: 400})
    }

    try {
        await prisma.ticket.create({
            data:{
                name: name,
                description: description,
                status: "Aberto",
                customerId: customerId
            }
        })
        return NextResponse.json({message: "Ticket Registrado com sucesso!"})
    } catch (error) {
        return NextResponse.json({error: "Failed to create a new Ticket"}, {status: 400})
    }




}