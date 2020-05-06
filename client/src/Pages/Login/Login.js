import React, { Component } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import './Login.css'

const cookies = new Cookies()

class Login extends Component {
    constructor() {
        super()
        console.log('this.props', this.props)
        this.state = {
            username: '',
            password: '',
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
            case 'username':
                this.setState({ username: value })
                break;

            case 'password':
                this.setState({ password: value })
                break;

            default:
                break;
        }
    }

    formSubmit(e) {
        e.preventDefault()

        axios.post(`/api/user/auth`, this.state)
            .then(response => {
                console.log(response)
                let token = response.data.token
                axios.get(`api/user/username/${this.state.username}?token=${token}`)
                    .catch(err => console.error(err))
                    .then(response => {
                        let userData = response.data.result[0]
                        cookies.set('user', userData, { path: '/', maxAge: 31536000 }) //lasts one year
                        cookies.set('token', token, { path: '/', maxAge: 31536000 })
                        window.location = '/feed'
                    })
            })
            .catch(err => {
                alert('The username or password is incorrect.')
            })
    }

    render() {
        return (
            <div className="Register">
                <div className="wrapper">
                    <h1 className="title">Login</h1><br />

                    <form className="needs-validation" noValidate onSubmit={this.formSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" className="form-control" id="username" placeholder="johnsmith1" required onChange={this.formChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" placeholder="Password" required onChange={this.formChange} />
                        </div >
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form >

                </div >
            </div >
        )
    }
}


export default Login
