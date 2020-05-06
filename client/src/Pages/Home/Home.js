import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie'
import { app_title } from '../../config'
import './Home.css'

const cookies = new Cookies()

class Home extends Component {
    componentWillMount() {
        if (cookies.get('user')) window.location = '/feed'
    }
    render() {
        return (
            <div className="Home">

                <div className="header">
                    <h1>Welcome to {app_title}</h1>
                    <h2>This is some sample placeholder text...</h2>
                    <p>sample text</p>
                    <br />
                    <br />
                    <br />
                    <Link to="/signup" id="signup-btn" className="btn btn-primary">Get Started</Link>
                </div>

                <div className="main">
                    <div className="card_">
                        <div className="border"></div>
                        <h1>What is {app_title}?</h1>
                        <br />
                        <i className="lead">
                            {app_title} SAMPLE TEXT.
                        </i>
                        <br /><br /><br /><hr /><br /><br /><br />
                        <h1>How do I sign up?</h1>
                        <br />
                        <i className="lead">
                            To sign up to {app_title}, you need to create
                            an account by clicking on the <strong>Sign Up</strong> button
                            at the top of the page
                        </i>
                    </div>
                </div>

            </div>
        )
    }
}



export default Home