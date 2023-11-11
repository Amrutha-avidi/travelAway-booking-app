import Header from "./Header"
import { Outlet } from 'react-router-dom'

export default function Layout() {
    return (
        <div className="py-4 px-8 flex flex-col min-h-screen">
            <Header />
            <Outlet  />
            {/*  <Outlet/> component (from react-router-dom ) is used within the parent route element to indicate where a child route element should be rendered */}


        </div>
    )
}