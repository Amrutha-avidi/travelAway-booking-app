import { useEffect,useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function IndexPage() {
    const [places,setPlaces] = useState([])
    useEffect(()=>{
        axios.get('/places').then(response=>{
            setPlaces(response.data)
        });
    },[])
    return (
        <div className="mt-7 gap-x-6 gap-y-8 grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {places.length > 0 && places.map(place=>(
                <Link to={'/place/'+place._id}>
                    <div className="mb-2 bg-gray-500 rounded-2xl flex">
                        {place.photos?.[0] && (
                            <img className="rounded-2xl object-cover aspect-square" src={'http://localhost:4001/uploads/'+place.photos?.[0]}/>
                        )}
                    </div>
{/*truncate makes the multiple lines of txt into single line by adding ... at the end and leading property helps in proving the vertical line space*/}
                    <h2 className="font-semibold">{place.address}</h2>
                    <h3 className="text-sm truncate leading-5">{place.title}</h3>  
                    <div className="mt-1"> <span className="font-bold">₹ {place.price}</span> per night </div>
                </Link>

            ))}
        </div>
    );

} 