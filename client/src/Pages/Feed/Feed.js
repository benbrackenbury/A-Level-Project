import React, { Component } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import './Feed.css'
import Post from '../../Components/Post/Post'

const cookies = new Cookies()

class Feed extends Component {
    constructor() {
        super()
        this.state = {
            posts: [],
            following: []
        }
    }
    componentWillMount() {
        if (!cookies.get('user')) window.location = '/login'
        let token = cookies.get('token')
        let user = cookies.get('user').username

        axios.get(`/api/user/follow/${user}?token=${token}`)
            .catch(err => console.error(err))
            .then(res => {
                let result = res.data.result
                let following = []
                if (result.length > 0) {
                    result.map(f => {
                        following.push(f.following)
                    })
                    this.setState({ following })
                    let userArray = this.state.following
                    axios.post(`/api/post/feed?token=${token}`, { userArray })
                        .catch(err => console.error(err))
                        .then(res => {
                            let posts = res.data.result
                            this.setState({ posts })
                        })
                }
            })
    }
    render() {
        let showPosts = () => {
            if (this.state.posts.length > 1) {
                this.state.posts.map(post => {
                    return (
                        <Post key={post.id} postID={`post_${post.id}`} user={post.user} body={post.body} imgurLink={post.imgur_link} category={post.category} />
                    )
                })
            } else {
                return (
                    <h2 style={{ marginTop: 40 + 'vh', opacity: 0.6 }}>You don't follow anyone</h2>
                )
            }
        }
        return (
            <div className="Feed">
                <div className="PostsView">
                    {showPosts()}
                </div>
            </div>
        )
    }
}

export default Feed