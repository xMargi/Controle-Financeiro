import { Navigate } from "react-router";

interface protectedData {
    children: React.ReactNode
}

export const ProtectedRoute = ({
    children
}: protectedData) => {
    const getToken = localStorage.getItem("token");

    if (!getToken) return <Navigate to={"/auth/login"}/>
    else {
        return (
            <>
                {children}
            </>
        )
    }
}