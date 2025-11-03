"use client"
import { useState } from "react"
import { Input } from "@/components/input"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FormTicket } from "./components/FormTicket"
import { FiSearch, FiX } from "react-icons/fi"
import { api } from "@/lib/api"

const schema = z.object({
    email: z.string().email("Digite um e-mail válido").min(1, "E-mail do cliente é obrigatório")
})

export interface CustomerDataInfo{
    id: string;
    name: string;
}

type FormData = z.infer<typeof schema>
export default function OpenTicket(){
    const [customer, setCustomer] = useState <CustomerDataInfo | null >(null)
    const {register, handleSubmit, setValue, setError, formState: {errors}} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    async function handleSearchCustomer(data: FormData){
        const response = await api.get("/api/customer", {
            params: {
                email: data.email
            }
        })


        if(response.data === null){
            setError("email", {
                type: "custom",
                message: "Ops, cliente não foi encontrado"
            })
            return;
        }

        setCustomer({
            id: response.data.id,
            name: response.data.name
        })
    }

    function handleClearCustomer(){
        setCustomer(null)
        setValue("email", "")
    }

    return(
        <div className="w-full max-w-2xl mx-auto px-2">
            <h1 className="font-bold text-3xl text-center mt-24">Abrir Chamado</h1>
            <main className="flex flex-col mt-4 mb-2">
                {customer ? (
                    <div className="bg-slate-100 py-6 px-4 rounded border border-slate-300 flex items-center justify-between">
                        <p className="text-lg"><strong>Cliente selecionado: </strong>{customer.name}</p>
                        <button
                            onClick={handleClearCustomer}
                            className="h-11 cursor-pointer px-2 rounded flex items-center justify-center"
                        >
                            <FiX size={30} color="#ff2929" />
                        </button>
                    </div>
                ): (
                    <form
                        onSubmit={handleSubmit(handleSearchCustomer)}
                        className="bg-slate-100 py-6 px-2 rounded border border-slate-300"
                    >
                        <div className="flex flex-col gap-3">
                            <Input
                                type="text"
                                placeholder="Digite o email do cliente..."
                                name="email"
                                register={register}
                                error={errors.email?.message}
                            
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white flex flex-row gap-3 px-2 h-11 items-center justify-center rounded font-bold"
                            >   
                                Procurar Cliente <FiSearch size={24}/>
                            </button>
                        </div>
                    </form>
                )}

                {customer !== null && <FormTicket customer={customer}/>}

            </main>
        </div>
    )
}