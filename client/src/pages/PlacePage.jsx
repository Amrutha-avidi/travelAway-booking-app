import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";

export default function PlacesPage() {
    const { id } = useParams()
    const [place, setPlace] = useState(null)
    useEffect(() => {
        if (!id) {
            return
        }
        else {
            axios.get(`/places/${id}`).then(response => {
                setPlace(response.data)
            })
        }
    }, [id])

    if (!place) return ''

 
    return (
        <div className="mt-5 bg-gray-200 -mx-8 px-8 py-8">
            <h1 className="text-3xl mr-36">{place.title}</h1>
            <a className=" my-2 font-semibold underline flex" target='_blank' href={'https://maps.google.com/?q=' + place.address}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {place.address}
 
            </a>
            <PlaceGallery place={place}/>


            <div className="mt-8  gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr]">

                <div>
                    <div className="my-4">
                        <h2 className="font-semibold text-2xl mb-4">Description</h2>
                        {place.description}
                    </div>
                    Check-in : {place.checkIn} <br />
                    Check-out : {place.checkOut}<br />
                    Max number of guests : {place.maxGuests}
                </div>
                <div>
                    <BookingWidget place={place} />
                </div>
            </div>
            <div className="bg-gray-100 mt-5 -mx-8 p-7 rounded-3xl">
                <h2 className="font-semibold text-2xl mb-4">Extra Info</h2>
                <div className="text-md my-4 text-gray-700 leading-6 mt-2">{place.extraInfo}</div>
            </div>


        </div>
    )
}