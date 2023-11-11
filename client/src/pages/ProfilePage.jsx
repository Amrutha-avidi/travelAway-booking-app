import { useContext } from "react"
import { UserContext } from "../UserContext.jsx"
import { Link, Navigate, useParams } from "react-router-dom"
import axios from 'axios'
import { useState } from "react"
import PlacesPage from "./PlacesPage.jsx"
import AccountNav from "./AccountNav.jsx"

export default function ProfilePage() {
    const [redirect, setRedirect] = useState(null)
    const { ready, user, setUser } = useContext(UserContext)
    let { subpage } = useParams();
    if (subpage === undefined) {
        subpage = 'profile'
    }

    async function logout() {
        await axios.post('/logout')

        setRedirect('/')
        setUser(null)
    }

    if (!ready) {
        return 'Loading...'
    }

    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }



    //bg-primary rounded-2xl text-white font-semibold"

    if (redirect) {
        return <Navigate to={redirect} />
    }



    return (
        <div>
            <AccountNav/>
            
            {subpage === 'profile' && (
                <div className="text-center mx-auto mt-10 max-w-lg">
                    Logged in as {user.name} ({user.email}) <br />
                    <button onClick={logout} className="bg-primary p-2 rounded-lg text-white font-semibold  mt-3">Logout</button>
                </div>

            )}
            {subpage === 'places' && (
                <PlacesPage />
            )}
        </div>
    )
}

