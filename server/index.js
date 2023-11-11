const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require("cors");
const { default: mongoose } = require('mongoose');  //db
const bcrypt = require('bcrypt') //password encryption
const jwt = require('jsonwebtoken')
const imageDownloader = require('image-downloader')// A Node module for downloading image to disk from a given URL
const multer = require('multer') //Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files
const fs = require('fs')
const User = require('./models/User.js')
const Place = require('./models/Place.js')
const Booking = require('./models/Booking.js')

require('dotenv').config() //env folder is used to secure connection string 
const app = express(); //middleware


const bcryptSalt =  bcrypt.genSaltSync(10)
const jwtSecret = 'hahahahahahah'

function getUserDataFromReq(req){
    return new Promise((resolve,reject)=>{
        jwt.verify(req.cookies.token, jwtSecret, {}, async(err,userData)=>{
            if(err) throw err;
            resolve(userData)
        })
    })

}

app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(__dirname+'/uploads')) //middleware to upload an image link to the databases
app.use(cors({origin: true, credentials: true}))


mongoose.connect(process.env.MONGO_URL)
app.get('/test', (req, res)=>{
    res.json('test ok')
});


app.post('/register', async (req,res)=>{
    const{name,email,password}  = req.body
    try{
        const newUser = await User.create({
            name,
            email,
            password:bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(newUser)
    }
    catch(e){
        res.status(422).json(e)
    }
    
})

app.post('/login', async (req,res)=>{
    const{email,password}  = req.body
    
    const  newUser = await User.findOne({email})
    if(newUser){
        const passOk = bcrypt.compareSync(password, newUser.password)
        if (passOk){
            jwt.sign({
                email:newUser.email,
                id:newUser._id,
                
            }, jwtSecret, {}, (err,token)=>{
                if(err) throw err;
                res.cookie('token', token).json(newUser)
            });    
        }
        else{ 
            res.status(422).json("pass not ok")
        }
    }
    else if (newUser===null){
        res.json('not found')
    }
})

app.get('/profile',(req,res)=>{
   const {token} = req.cookies
   if(token){
    jwt.verify(token, jwtSecret,{}, async(err, userData)=>{
        if(err) throw err;
        const {name,email,_id} = await User.findById(userData.id)
        res.json({name,email,_id})
    })
   }else{
    res.json(null)
   }

})

app.post('/logout', (req,res)=>{
    res.cookie('token','').json(true)
})

app.post('/upload-by-link', async(req,res)=>{
    const {link} = req.body
    const newName = 'photo'+Date.now() +'.jpg'
    await imageDownloader.image({
        url:link,
        dest:__dirname+'/uploads/' + newName //__dirname provides the path to the req body and ths help the req body link to be placed at a particular folder
    })
    res.json( newName )
})

const photosMiddleware = multer({dest:'uploads/'})
app.post('/upload',photosMiddleware.array('photos',100), (req,res)=>{
    const uploadedFiles = []
    for(let i=0;i<req.files.length; i++){
        const {path,originalname} = req.files[i]
        const parts = originalname.split('.')
        const ext = parts[parts.length-1]
        const newPath = path + '.' + ext
        fs.renameSync(path,newPath)
        uploadedFiles.push(newPath.replace('uploads\\',''))

    }
    res.json(uploadedFiles)
})


app.post('/places',(req,res)=>{
    const {token} = req.cookies
    const {title, address, addedPhotos, 
        description, perks, extraInfo, 
        checkIn, checkOut, maxGuests,price} = req.body
    jwt.verify(token, jwtSecret,{}, async(err, userData)=>{
        if(err) throw err;
        const placeDoc = await Place.create({
            owner:userData.id,
            title, address, photos:addedPhotos, 
            description, perks, extraInfo, 
            checkIn, checkOut, maxGuests,price,
        })
        res.json(placeDoc )
})

})

app.get('/user-places', (req,res)=>{
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async(err,userData)=>{
        const {id}  = userData
        res.json(await Place.find({owner:id}))
    })
}) 

app.get('/places/:id',async(req,res)=>{
    const {id} = req.params
    res.json(await Place.findById(id))
})

app.put('/places',async(req,res)=>{
    const {token} = req.cookies
    const {id,title, address, addedPhotos, 
        description, perks, extraInfo, 
        checkIn, checkOut, maxGuests,price,} = req.body
    const placeDoc = await Place.findById(id)

    jwt.verify(token, jwtSecret, {}, async(err,userData)=>{
        if(userData.id === placeDoc.owner.toString()){
            placeDoc.set({
                title, address, photos:addedPhotos, 
                description, perks, extraInfo, 
                checkIn, checkOut, maxGuests,price,
            })
            await placeDoc.save()
            res.json('ok')
        }
    })    

})

app.get('/places', async(req,res)=>{
    res.json(await Place.find())
})

app.post('/bookings', async(req,res)=>{
    const userData = await getUserDataFromReq(req)
    const {
        place, checkIn, checkOut, numberOfGuests,name,phone,price
    } = req.body
    Booking.create({
        place, checkIn, checkOut, numberOfGuests,name,phone,price,
        user:userData.id,
    }).then((doc)=>{
        res.json(doc)
    }).catch((err)=>{
        throw err;
    })
})


app.get('/bookings',async(req,res)=>{
    const userData = await getUserDataFromReq(req)
    res.json(await Booking.find({user:userData.id}).populate('place'))


})

app.listen(4001, ()=>{
    console.log('listening')
})