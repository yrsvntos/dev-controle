import { ReactNode } from "react";

export function Container({children}: {children: ReactNode}){
    return(
        <div className="w-full px-2 py-4 max-w-7xl mx-auto">
            {children}
        </div>
    )
}