import { useState } from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios' //http library that requests mongoose to fetch the data 

export default function RegisterPage(){
    const[name, setName] = useState('')
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')

    async function registerUser(event){
        event.preventDefault()
        try{
            await axios.post('/register',{
                name,
                email,
                password
            })
            if(email==='' || password==='' || name===''){
                alert("Enter your details")
                
            }
            else{
                alert("Registration Successuful. Now you can login")
            }
            
        }
        catch(e){
            alert("User with this email already existed. Please Login")
        }
        //wVkXoOgxW4jvisth

    }
    return (
        <div className="-mt-3 grow flex justify-around items-center ">
            <div className="flex items-center justify-around">
                <img className='w-200' src='/src/images/loginPageImage1.png'/>  
                <div className='mx-32'>
                <h1 className="text-center text-3xl font-semibold">Register</h1>
                <form  className="mx-auto max-w-md mt-5" onSubmit={registerUser}>
                    <input type="text" placeholder='John Doe'
                        value={name}
                        onChange={event=>setName(event.target.value)} />
                    <input type="email" placeholder="your@email.com"
                        value={email}
                        onChange={event=>setEmail(event.target.value)}  />
                    <input type="password" placeholder="Password"
                        value={password}
                        onChange={event=>setPassword(event.target.value)}  />
                    <button className="bg-primary w-full text-white p-2  rounded-lg font-semibold" >Register</button>
                <div className='mt-4 text-center'>Already Registered?  
                    <Link to={'/login'}><b className=' text-primary'>&nbsp; Login Now</b></Link>
                </div>
                </form>

                </div>
            </div>
        </div>
    );


}