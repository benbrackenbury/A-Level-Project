import React, { Component } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import './Register.css'

const cookies = new Cookies()

class Register extends Component {
    constructor() {
        super()
        console.log('this.props', this.props)
        this.state = {
            name: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            avatar: '',
            bio: ''
        }
        this.formChange = this.formChange.bind(this)
        this.formSubmit = this.formSubmit.bind(this)
    }

    componentWillMount() {
        if (cookies.get('user')) window.location = '/'
    }

    formChange(e) {
        let field = e.target.id
        let value = e.target.value
        switch (field) {
            case 'name':
                this.setState({ name: value })
                break;

            case 'username':
                this.setState({ username: value })
                break;

            case 'email':
                this.setState({ email: value })
                break;

            case 'password':
                this.setState({ password: value })
                break;

            case 'confirm-password':
                this.setState({ confirmPassword: value })
                break;

            case 'avatar':
                this.setState({ avatar: value })
                break;

            case 'bio':
                this.setState({ bio: value })
                break;

            default:
                break;
        }
    }

    formSubmit(e) {
        e.preventDefault()
        let { password, confirmPassword } = this.state
        if (password !== confirmPassword) {
            alert('You have entered two different passwords, make sure they match.')
        } else {
            axios.post(`/api/user`, this.state)
                .then(response => {
                    console.log(response)
                    let { name, username, email, avatar, bio } = this.state
                    let userCookie = { name, username, email, avatar, bio }
                    cookies.set('user', userCookie, { path: '/' })
                    console.log('cookies', cookies.get('user'))
                    window.location = '/feed'
                })
                .catch(err => console.log(err))
        }
    }

    render() {
        return (
            <div className="Register">
                <div className="wrapper">
                    <h1 className="title">Create an account</h1><br />

                    <form className="needs-validation" noValidate onSubmit={this.formSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" className="form-control" id="name" placeholder="John Smith" required onChange={this.formChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" className="form-control" id="username" placeholder="johnsmith1" required onChange={this.formChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="johnsmith@example.com" required onChange={this.formChange} />
                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" placeholder="Password" required onChange={this.formChange} />
                        </div >
                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirm Password</label>
                            <input type="password" className="form-control" id="confirm-password" placeholder="Confirm Password" required onChange={this.formChange} />
                        </div >
                        <div className="form-group">
                            <label htmlFor="avatar">Choose an Avatar (optional)</label>
                            <input type="file" id="avatar" style={{ margin: "0 auto" }} accept="image/png, image/jpeg" onChange={this.formChange} />
                        </div >
                        <div className="form-group">
                            <label htmlFor="Bio">Bio (optional)</label>
                            <input type="text" className="form-control" id="Bio" placeholder="Introduce yourself" onChange={this.formChange} />
                        </div >
                        <button type="submit" className="btn btn-primary">Register</button>
                    </form >

                </div >
            </div >
        )
    }
}


export default Register
