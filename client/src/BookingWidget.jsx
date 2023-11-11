import {useContext, useState,useEffect } from "react"
import {differenceInCalendarDays} from 'date-fns'
import { Navigate } from "react-router-dom"
import { UserContext } from "./UserContext.jsx"
import axios from "axios"


export default function BookingWidget({place}){
    const [checkIn , setCheckIn] = useState('')
    const [checkOut , setCheckOut] = useState('')
    const [numberOfGuests , setNumberOfGuests] = useState(1)
    const [name,setName] = useState("")
    const[phone, setPhone] = useState('')
    const [redirect, setRedirect] = useState("")
    const {user} = useContext(UserContext)

    useEffect(()=>{
        if(user){
            setName(user.name)
        }
    },[user])


    let numOfNights = 0;
    if(checkIn && checkOut){
        numOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
    }

    async function bookThisPlace(){
        const response = await axios.post('/bookings',{
            checkIn, checkOut, phone,numberOfGuests,name,
            place:place._id,
            price: numOfNights * place.price,
        })
        const bookingId  = response.data._id
        setRedirect(`/account/bookings/${bookingId}`)

    }

    if(redirect){
        return <Navigate to={redirect} />
    }


    return (
        <div className='bg-white shadow p-4 rounded-2xl'>
            <div className="text-2xl text-center">
                Price: ₹ {place.price} / night
            </div>
            <div className="border rounded-2xl mt-4">
                <div className="flex">
                    <div className=" px-4 py-3 ">
                        <label>Check In: </label>
                        <input type="date" 
                        value={checkIn} 
                        onChange={ev=> setCheckIn(ev.target.value)} />
                    </div>
                    <div className=" px-4 py-3 border-t">
                        <label>Check Out: </label>
                        <input type="date" 
                        value={checkOut}
                         onChange={ev=> setCheckOut(ev.target.value)} />
                    </div>
                </div>
                <div className="px-4">
                    <label>Number of Guests:</label>
                    <input type="number" 
                    value={numberOfGuests} 
                    onChange={ev=> setNumberOfGuests(ev.target.value)} />
                </div>
                {numOfNights>0 && (
                    <div className="py-3 px-4 border-t">
                        <label>Your Full Name: </label>
                        <input type="text" 
                               value={name}
                               onChange={ev=> setName(ev.target.value)} />
                        <label>Phone Number: </label>
                        <input type="tel" 
                               value={phone}
                               onChange={ev=> setPhone(ev.target.value)} />       
                    </div>
                )}

            </div>
            <button className="primary mt-4" onClick={bookThisPlace}>
                Book this place for
                {numOfNights>0 && (
                    <span> ₹{numOfNights*place.price}</span>
                )}
            
            </button>
        </div>
    )
}