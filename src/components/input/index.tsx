import { RegisterOptions, UseFormRegister } from "react-hook-form";
import { StringFormatParams } from "zod/v4/core";

interface InputProps{
    type: string;
    name: string;
    placeholder: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions;
}

export function Input({type, name, placeholder, register, rules, error}: InputProps){
    return(
        <>
            <input 
                className="w-full border border-slate-400 rounded-md h-11 px-2"
                type={type}
                placeholder={placeholder}
                id={name}
                {...register(name, rules)}
            />

            {error && <p className="text-red-500 my-1">{error}</p>}
        </>
    )
}