import { useRoutes } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import Dashboard from "../views/Dashboard";
import Login from "../views/login";
import Register from "../views/Register";

const MainRoutes = [
    {
        path: '/',
        element: <ProtectedRoute />,
        children: [
            {
                path: '/',
                element: <Dashboard />
            },
        ]
    },
    {
        path: '/login',
        element: <Login />,
    }, {
        path: '/register',
        element: <Register />,
    },
];

export default function ThemeRoutes() {
    return useRoutes(MainRoutes);
};
