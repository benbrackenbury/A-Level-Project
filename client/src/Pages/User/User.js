import React, { Component } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import './User.css'
import Post from '../../Components/Post/Post'
import FollowBtn from './FollowBtn/FollowBtn'

const cookies = new Cookies()

const getUrlParameter = name => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

class User extends Component {
    constructor() {
        super()
        this.state = {
            user: {},
            username: '',
            posts: [],
            isMe: true
        }
    }
    componentWillMount() {
        if (!cookies.get('user')) window.location = '/login'
        let token = cookies.get('token')
        let myUsername = cookies.get('user').username
        let path = this.props.location.pathname
        let user = path.split('/user/')[1]
        let isMe = user == myUsername
        this.setState({ isMe, username: user })
        if (path == '/user' || path == '/user/') window.location = `/user/${myUsername}`
        axios.get(`/api/user/username/${user}?token=${token}`)
            .catch(err => console.error(err))
            .then(response => {
                let userData = response.data.result[0]
                if (!userData) window.location = `/user/${myUsername}`
                this.setState({ user: userData })
                let avatarWrapper = document.getElementById('avatar-wrapper')
                if (this.state.user.avatar !== '') {
                    avatarWrapper.style.backgroundImage = `url('${this.state.user.avatar}')`
                    avatarWrapper.style.backgroundSize = 'cover'
                }
                //get posts by user
                axios.get(`/api/post/user/${this.state.user.username}?token=${token}`)
                    .catch(err => console.error(err))
                    .then(response => {
                        this.setState({ posts: response.data.result })
                    })
            })
    }

    componentDidMount() {
        let gradients = [
            'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
            'linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%)',
            'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)',
            'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
            'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
            'linear-gradient(to top, #a8edea 0%, #fed6e3 100%)',
            'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        ]
        let index = Math.floor((Math.random() * gradients.length - 1) + 0)
        let header = document.querySelector('.header')
        header.style.backgroundImage = gradients[index]
    }

    render() {

        const renderFollowBtn = () => {
            if (!this.state.isMe) return (
                <FollowBtn userToFollow={this.state.username} me={cookies.get('user')} />
            )
        }

        return (
            <div className="User">

                <div className="header">
                    <div id="header-wrapper">
                        <div id="avatar-wrapper"></div>
                        <div id="header-textblock">
                            <h1 id="fullname">{this.state.user.name}</h1>
                            <h2 id="username">{this.state.user.username}</h2>
                        </div>
                    </div>
                    {renderFollowBtn()}
                </div>

                <div className="PostsView">
                    {this.state.posts.map(post => (
                        <Post key={post.id} postID={`post_${post.id}`} user={post.user} body={post.description} imgurLink={post.imgur_link} category={post.category} />
                    ))}
                </div>

            </div>
        )
    }
}


export default User