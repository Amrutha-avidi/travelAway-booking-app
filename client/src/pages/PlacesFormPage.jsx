import PhotosUploader from '../PhotosUploader';
import Perks from '../Perks';
import { useState ,useEffect} from 'react';
import axios from 'axios';
import AccountNav from './AccountNav';
import { Navigate, useParams } from 'react-router-dom';

export default function PlacesFormPage(){
    const {id} = useParams()
    const [title, setTitle] = useState('')
    const [address, setAddress] = useState('')
    const [addedPhotos, setAddedPhotos] = useState([])
    const [description, setDescription] = useState('')
    const [perks, setPerks] = useState([])
    const [extraInfo, setExtraInfo] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [maxGuests, setMaxGuests] = useState(1)
    const [redirect, setRedirect] = useState(false)
    const [price,setPrice] = useState(100)
    useEffect(()=>{
        if(!id){
            return;
        }
    
        axios.get('/places/'+id ).then(response=>{
            const {data} = response
            setTitle(data.title)
            setAddress(data.address)
            setAddedPhotos(data.photos)
            setDescription(data.description)
            setPerks(data.perks)
            setExtraInfo(data.extraInfo)
            setCheckIn(data.checkIn)
            setCheckOut(data.checkOut)
            setMaxGuests(data.maxGuests)
            setPrice(data.price)

        })
        

    },[id])

    function inputHeader(text) {
        return (
            <h2 className='text-2xl mt-4'>{text}</h2>
        )
    }

    function inputDescription(text) {
        return (
            <p className='text-sm text-gray-500'>{text}</p>

        )
    }

    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}

            </>
        )
    }

    async function savePlace(event){
        event.preventDefault(); 
        const placeData = {title,address,addedPhotos,
            description,perks,extraInfo,
            checkIn,checkOut,maxGuests,price}
        if(id){
            await axios.put('/places',{
                id,...placeData
                
            });
            setRedirect(true);
        }
        else{
            await axios.post('/places',placeData);
            setRedirect(true);

        }
        

    }
    if(redirect){
        return <Navigate to={'/account/places'} />
    }
    return(
        <div className='px-6'>
            <AccountNav/>
            <form onSubmit={savePlace}>
                {preInput('Title', 'Title for your place, should be short and attractive')}
                <input value={title} onChange={event => setTitle(event.target.value)} type="text" placeholder='title, for example: my lovely appartment' />

                {preInput('Address', 'Address to this place')}
                <input value={address} onChange={event => setAddress(event.target.value)} type="text" placeholder='address' />

                <h2 className='text-xl mt-4'>Photos</h2>
                <p className='text-sm text-gray-500'> More Photos of your place can attract the customers</p>
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

                {preInput('Description', 'Add Description for you place')}
                <textarea value={description} onChange={event => setDescription(event.target.value)} />

                {preInput('Perks', 'Select all the perks of out place')}
                <div className='mt-3 grid gap-2 gris-cols-2 md:grid-cols-3 lg:grid-cols-6'>
                    <Perks selected={perks} onChange={setPerks} />
                </div>

                {preInput('Extra Info', 'House Rules etc')}
                <textarea value={extraInfo}
                    onChange={event => setExtraInfo(event.target.value)} />

                {preInput('Check in & out times', 'Add Check In and Check Out time and also cleaning time')}
                <div className='grid gap-2 grid:cols-2 md:grid-cols-4'>
                    <div>
                        <h3 className='mt-2 -m-1'>Check In time</h3>
                        <input value={checkIn}
                            onChange={event => setCheckIn(event.target.value)}
                            type='text'
                            placeholder='14' />
                    </div>
                    <div>
                        <h3 className='mt-2 -m-1'>Check Out time</h3>
                        <input value={checkOut}
                            onChange={event => setCheckOut(event.target.value)}
                            type='text'
                            placeholder='11' />
                    </div>
                    <div>
                        <h3 className='mt-2 -m-1'>Maximum number of Guests</h3>
                        <input value={maxGuests}
                            onChange={event => setMaxGuests(event.target.value)}
                            type='number'
                            placeholder='14:00' />
                    </div>
                    <div>
                        <h3 className='mt-2 -m-1'>Price Per Night</h3>
                        <input value={price}
                            onChange={event => setPrice(event.target.value)}
                            type='number'
                            />
                    </div>
                    <button className='primary my-4'>Save</button>
                    
                </div>
            </form>
        </div>
    )
}

