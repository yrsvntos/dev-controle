"use client"

import { Input } from "@/components/input"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { api } from "@/lib/api"
import { CustomerDataInfo } from "../../page"

const schema = z.object({
    name: z.string().min(1, "O nome do ticket é obrigatório"),
    description: z.string().min(1, "A descrição do ticket é obrigatória!")
})

type FormData = z.infer<typeof schema>

interface FormTicketProps{
    customer: CustomerDataInfo
}
export function FormTicket({customer}: FormTicketProps){

    const {register, handleSubmit, setValue, formState: {errors}} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    async function handleRegisterTicket(data: FormData){
        const response = await api.post("/api/ticket", {
            name: data.name,
            description: data.description,
            customerId: customer.id
        })

        setValue("name", "")
        setValue("description", "")
    }
    return(
        <form 
            onSubmit={handleSubmit(handleRegisterTicket)}
            className="bg-slate-100 py-6 px-2 rounded border border-slate-300 mt-6">
            <label className="mb-1 text-lg font-medium">Nome do chamado</label>
            <Input
                register={register}
                placeholder="Digite o nome do ticket"
                name="name"
                type="text"
                error={errors.name?.message}
            />
            <label className="mb-1 text-lg font-medium">Descreva o problema...</label>
            <textarea
                className="w-full border border-slate-400 rounded-md h-24 resize-none px-2"
                id="description"
                placeholder="Descreva o seu problema"
                {...register("description")}
            >
            
            </textarea>

            {errors.description?.message && <p className="text-red-500 mt-1 mb-4">{errors.description?.message}</p> }

            <button
                type="submit"
                className="bg-blue-500 rounded w-full font-bold text-white h-11 px-2"
            >
                Cadastrar
            </button>
        </form>
    )
}