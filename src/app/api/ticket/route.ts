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