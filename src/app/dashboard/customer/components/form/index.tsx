"use client"

import { useForm } from "react-hook-form"
import z, { email } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/input"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"


const schema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("Digite um e-mail válido").min(1, "O email é obrigatório"),
    phone: z.string().refine((value) => {
        return /^(?:\(\d{3}\)\s?)?\d{9}$/.test(value) || /^\d{3}\s\d{9}$/.test(value) || /^\d{11}$/.test(value)
    }, {
        message: "O número de telefone deve estar no formato (DDD) XXXXXXXXX"
    }),
    address: z.string()
})

type UserForm = z.infer<typeof schema>

export function NewCustomerForm({userId}: {userId: string}){

    const {register, handleSubmit, formState: {errors}} = useForm<UserForm>({
        resolver: zodResolver(schema), 
    })

    const router = useRouter();

    async function handleRegister(data: UserForm){
        const response = await api.post("/api/customer/", {
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            userId: userId
        })
        
        router.replace("/dashboard/customer");
        router.refresh();
    }
    return(
        <form className="flex flex-col mt-6" onSubmit={handleSubmit(handleRegister)}>
            <label className="mb-2 text-lg font-medium">Nome completo:</label>
            <Input
                type="text"
                placeholder="Digite o nome"
                register={register}
                name="name"
                error={errors.name?.message}
            />
            <section className="flex flex-col sm:flex-row gap-2 my-4">
                <div className="flex-1">
                    <label className="mb-2 text-lg font-medium">Telefone:</label>
                    <Input
                        type="text"
                        placeholder="Ex: (DDD) XXXXXXXXX"
                        register={register}
                        name="phone"
                        error={errors.phone?.message}
                    />
                </div>
                <div className="flex-1">
                    <label className="mb-2 text-lg font-medium">Email:</label>
                    <Input
                        type="email"
                        placeholder="Digite o email"
                        register={register}
                        name="email"
                        error={errors.email?.message}
                    />
                </div>
            </section>
            <label className="mb-2 text-lg font-medium">Endereço completo:</label>
            <Input
                type="text"
                placeholder="Digite o endereço do cliente"
                register={register}
                name="address"
                error={errors.address?.message}
            />

            <button 
                type="submit"
                className="bg-blue-500 my-4 px-2 h-11 rounded text-white font-bold"
            >
                Cadastar
            </button>
        </form>
    )
}