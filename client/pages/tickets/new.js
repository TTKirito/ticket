import { useEffect, useState } from 'react'
import Router from 'next/router'
import Axios from 'axios'



const newTicket = ()=>{
    const [title,setTitle] = useState('')
    const [price,setPrice]= useState('')
    const [image,setImage]= useState(null)
    const [preview,setPreview]=useState()
    const [errors,setErrors]=useState(null)

    const onBlur=()=>{
        const value = parseFloat(price)
        if(isNaN(value)){
            return
        }

        setPrice(value.toFixed(2))
    }

    const onFileChange=(event)=>{
        if(event.target.files && event.target.files.length === 1){
            const pickedFile = event.target.files[0]
            setImage(pickedFile)
        }
    }

    useEffect(()=>{
        if(!image){
            return
        }
        const fileReader = new FileReader()
        fileReader.onload = () => {
            setPreview(fileReader.result)
        }
        fileReader.readAsDataURL(image)
    },[image])

    const onSubmit=async(event)=>{
        event.preventDefault()
        const formData= new FormData()
        formData.append('title',title)
        formData.append('price',price)
        formData.append('image',image)
        try{
            const response = await Axios.post('/api/tickets',formData)
            if(response.data){
                Router.push('/')
            }
        }catch(err){
            setErrors(
                <div className="alert alert-danger">
                    <h4>Ooops...</h4>
                    <ul className="my-0">
                        {err.response.data.errors.map(err => (
                            <li key={err.message}>{err.message}</li>
                        ))}
                    </ul>
                </div>
            )
        }
    }

    return (
        <div>
            <h1>Create a new Ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        value={title}
                        className="form-control"
                        onChange={(e)=>setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Price:</label>
                    <input
                        value={price}
                        className="form-control"
                        onChange={(e)=>setPrice(e.target.value)}
                        onBlur={onBlur}
                    />
                </div>
                <div className="form-group">
                    <label>Upload:</label>
                    <input
                        className="form-control"
                        onChange={onFileChange}
                        type="file" 
                        accept="image"
                    />
                    {preview && <img src={preview} alt="Preview" style={{width:350,height:350}}/>}
                    {!preview && <p>Please pick an image</p>}
                </div>

                {errors}
                <button className="btn btn-primary">Create</button>
            </form>
        </div>
    )
}




export default newTicket




