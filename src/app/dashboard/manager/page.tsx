"use client";

import { Suspense } from "react";
import Manager from "./ManagerClient";

export default function ManagerPage() {
    return (
        <Suspense fallback={<p className="p-6">Carregando página de gerenciamento...</p>}>
            <Manager />
        </Suspense>
    );
}








