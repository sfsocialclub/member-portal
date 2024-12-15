'use client';
import { Provider } from "react-redux"

import { NavLinks } from "./components/NavLinks";
import { store } from "@/lib/store";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (<Provider store={store}>
        <NavLinks />
        {children}
    </Provider>)
}