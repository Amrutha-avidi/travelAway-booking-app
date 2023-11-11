import { useState,useContext } from 'react';
import {Link,Navigate} from 'react-router-dom'
import axios from 'axios';
import { UserContext } from '../UserContext';

export default function LoginPage(){
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [redirect, setRedirect] = useState(false)
    const {setUser} = useContext(UserContext)

    async function loginUser(event){
        event.preventDefault()
        try{
            const {data} = await axios.post('/login',{email,password});
            if(email==='' || password===''){
                alert("Enter your details")
                setRedirect(false)
            }
            else{
                setUser(data)
                alert("Login Successful")
                setRedirect(true)
            }
            
        }
        catch(e){
            alert("You are not the active user! Get Registered Now!")
        }

    }
    if(redirect){
        return <Navigate to={'/'} />
    }

    return (
        <div className="-mt-3 grow flex justify-around items-center ">
            <div className="flex items-center justify-around">
                <img className='w-200' src='/src/images/loginPageImage1.png'/>
                
                <div className='mx-32'>
                <h1 className="text-center text-3xl font-semibold">Login</h1>
                <form  className="mx-auto max-w-md mt-5" onSubmit={loginUser}>
                    <input type="email" placeholder="your@email.com"
                    value={email}
                    onChange={event=>setEmail(event.target.value)}
                    />
                    <input type="password" placeholder="Password" 
                    value={password}
                    onChange={event=>setPassword(event.target.value)}
                    />
                    <button className="bg-primary w-full text-white p-2  rounded-lg font-semibold" >Login</button>
                <div className='mt-4 text-center'>Don't have an account yet?  
                    <Link to={'/register'}><b className=' text-primary'>&nbsp; Register Now</b></Link>
                </div>
                </form>

                </div>
            </div>
        </div>
    );


}