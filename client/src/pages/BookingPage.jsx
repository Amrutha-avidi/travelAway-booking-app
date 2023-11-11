import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";

export default function BookingPlace(){
    const {id}  = useParams()
    const [booking, setBooking] = useState(null)
    useEffect(()=>{
        if(id){
            axios.get('/bookings').then(response =>{
                const foundBooking = response.data.find(({_id})=> _id ===id)
                if(foundBooking){
                    setBooking(foundBooking)
                }

            })

        }
    },[id])
    if( ! booking){
        return '';
    }
    return(
        <div className="my-8"> 
            <h1 className="text-3xl mb-6">{booking.place.title}</h1>
            <div className="bg-gray-300 p-3 px-6 rounded-2xl my-3 flex justify-between items-center">
                <div>
                <h2 className="font-semibold text-xl">Your Booking Information</h2>
                <BookingDates booking={booking}/>
                </div>
                <div className="bg-primary p-3 rounded-lg text-white">
                    <div>
                    Total Price :
                    </div>
                    <div className="text-3xl">
                    ₹ {booking.price}
                    </div>
                </div>
            </div>
            <PlaceGallery place={booking.place}/>
        </div>
    )
}