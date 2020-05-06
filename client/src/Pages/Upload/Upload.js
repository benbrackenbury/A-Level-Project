import React, { Component } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import './Upload.css'
var imgur = require('imsave')('074bfa89ec1444c')

const cookies = new Cookies()

class Upload extends Component {
    constructor() {
        super()
        this.state = {
            description: '',
            category: '',
            points: 1
        }
        this.formChange = this.formChange.bind(this)
        this.formSubmit = this.formSubmit.bind(this)
    }

    componentWillMount() {
        if (!cookies.get('user')) window.location = '/login'
    }

    componentDidMount() {
        document.querySelector('#loading-wrapper').style.display = 'none'
        document.querySelector('#loading-wrapper').style.display = 'main'
    }

    formChange(e) {
        let field = e.target.id
        let value = e.target.value
        switch (field) {
            case 'image_file':
                var FR = new FileReader()
                FR.addEventListener("load", e => {
                    this.setState({ image_file: document.getElementById('image_file').files[0] })
                })
                FR.readAsDataURL(e.target.files[0])
                break;

            case 'description':
                this.setState({ description: value })
                break;

            case 'category':
                this.setState({ category: value })
                break;

            default:
                break;
        }
    }

    formSubmit(e) {
        e.preventDefault()
        document.querySelector('#loading-wrapper').style.display = ''
        document.querySelector('#main-wrapper').style.display = 'none'
        imgur(this.state.image_file, (err, imgur_link) => {
            if (err) throw err
            this.setState({ imgur_link })
            let { username } = cookies.get('user')
            this.setState({ user: username, date: Date() })
            let postData = { ...this.state }
            delete postData.image_file //because we dont need to actual file now we have the imgur link
            let token = cookies.get('token')
            axios.post('/api/post', postData, {
                headers: { Authorization: token }
            })
                .catch(err => console.log(err))
                .then(response => {
                    window.location = '/'
                })
        })
    }

    render() {
        return (
            <div className="Upload">

                <div className="wrapper" id="loading-wrapper">
                    <h1>Uploading image...</h1>
                </div>

                <div className="wrapper" id="main-wrapper">
                    <h1 className="title">Upload an Image</h1><br />

                    <form className="needs-validation" noValidate onSubmit={this.formSubmit}>
                        <div className="form-group">
                            <label htmlFor="image_file">Choose an image</label>
                            <input type="file" className="form-control" id="image_file" accept="image/png, image/jpeg" required onChange={this.formChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea type="textarea" className="form-control" id="description" placeholder="Description" onChange={this.formChange} />
                        </div >
                        <div className="form-group">
                            <label htmlFor="category">Enter a Category</label>
                            <input type="text" className="form-control" id="category" onChange={this.formChange} />
                        </div>
                        <button type="submit" className="btn btn-primary">Upload</button>
                    </form >

                </div >
            </div>
        )
    }
}

export default Upload