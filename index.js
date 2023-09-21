import express from 'express'
import cors from 'cors'
import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBzwKUAmRfQnHN3zMvEd1PpgqN0GqaExlI",
    authDomain: "proyecto-backfront.firebaseapp.com",
    projectId: "proyecto-backfront",
    storageBucket: "proyecto-backfront.appspot.com",
    messagingSenderId: "480219900439",
    appId: "1:480219900439:web:2ec2a3c07c7fd13872ca52"
  };

const firebase = initializeApp(firebaseConfig)
const db = getFirestore(firebase)

//Settings de la aplicacion
const app = express()
app.use(express.json())
app.use(cors())



//Creacion de rutas
app.get('/', async(req, res) => {
    try{
        //conexion a la coleccion de la base de datos
        const Users = await collection(db, 'Users')
        const listUsers = await getDocs(Users)
        const aux = []
        listUsers.forEach((doc) => {
            const obj = {
                id: doc.id,
                ...doc.data()
            }
            aux.push(obj)
        })
        res.send({
            'msg': 'success',
            'data': aux
        })
    } catch (error){
        res.send({
            'msg': 'error',
            'data': error
        })
        
    }
})
//Crear usuario
app.post('/create', async (req,res) => {
    try{
        const body = req.body
        const Users = await collection(db, 'Users')
        await addDoc(Users, body)
        res.send({
            'msg': 'success'
        })
    } catch (error){
        res.send({
            'msg': 'error',
            'data': error
        })
    }
})
//Delete
app.get('/delete/:id', async(req, res) =>{
    //console.log('@@@ param => ', req.params.id)
    const id = req.params.id
    try {
        await deleteDoc(doc(db, 'Users', id))
        res.send({
            'msg': 'user deleted'
        })
    } catch (error){
        res.send({
            'msg': 'error',
            'data': error
        })
    }
})
//Update get
app.get('/get-update/:id', async(req, res) => {
    const id = req.params.id 

    const userRef = doc(db, 'Users', id)
    const user = await getDoc(userRef)

    if (user.exists()) {
        res.send({
            'msg': 'success',
            'data': user.data()
        })
    } else {
        res.send({
            'msg': 'user doesnt exist'
        })
    } 

})
// Update
app.post('/update', async (req, res) => {
    const {id, firstname, lastname, address, city, phone, cp} = req.body
    const newData = {
        firstname,
        lastname,
        address,
        city,
        phone,
        cp
    }
    await updateDoc(doc(db, 'Users', id), newData)
    res.send({
        'msg': 'success'
    })
    //console.log('@@@ body => ', result)
})

// Prendemos el servidor
app.listen(9000, () => {
    console.log('Servidor Trabajando')
})