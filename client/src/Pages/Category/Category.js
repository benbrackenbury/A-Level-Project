import React, { Component } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import './Category.css'
import Post from '../../Components/Post/Post'

const cookies = new Cookies()

class Category extends Component {
    constructor() {
        super()
        this.state = {
            category: 'Category',
            posts: [],
            postCount: '',
            sort: ''
        }
        this.sortChange = this.sortChange.bind(this)
    }

    componentWillMount() {
        if (!cookies.get('user')) window.location = '/login'
        let token = cookies.get('token')
        let path = this.props.location.pathname
        if (path == '/category' || path == '/category/') alert('no category provides')
        let category = path.split('/category/')[1]
        this.setState({ category })
        axios.get(`/api/post/category/${category}?token=${token}`)
            .catch(err => console.error(err))
            .then(response => {
                let posts = response.data.result
                let newPostArray = []

                let postIDs = posts.map(post => post.id)
                let uniquePostIDs = [...new Set(postIDs)]
                uniquePostIDs.map(uid => {
                    let resultsWithThisID = []
                    posts.map(post => {
                        if (post.id == uid && post.payload) {
                            resultsWithThisID.push(post.payload)
                        }
                    })
                    let payloadSum = 0
                    resultsWithThisID.map(r => payloadSum += r)
                    let postsWithThisID = posts.map(p => {
                        if (p.id == uid) return p
                    })
                    let thisPost = {}
                    postsWithThisID.map(p => {
                        if (typeof (p) !== 'undefined') {
                            thisPost = p
                            return
                        }
                    })
                    newPostArray.push({ ...thisPost, votes: payloadSum })
                })

                newPostArray = newPostArray.sort((a, b) => b.id - a.id)
                let postCount = `${newPostArray.length} ${newPostArray.length == 1 ? 'Post' : 'Posts'}`
                this.setState({ posts: newPostArray, postCount })
            })
    }

    sortChange(e) {
        let sort = e.target.value
        switch (sort) {
            case 'newest':
                this.setState({ posts: this.state.posts.sort((a, b) => b.id - a.id) })
                break;

            case 'oldest':
                this.setState({ posts: this.state.posts.sort((a, b) => a.id - b.id) })
                break;

            case 'most-votes':
                this.setState({ posts: this.state.posts.sort((a, b) => b.votes - a.votes) })
                break;

            case 'least-votes':
                this.setState({ posts: this.state.posts.sort((a, b) => a.votes - b.votes) })
                break;

            default:
                break;
        }
    }

    render() {
        return (
            <div className="Category">
                <div className="header">
                    <h1>{this.state.category}</h1>
                    <h4>{this.state.postCount}</h4>
                    <select name="sort" id="sort-select" onChange={this.sortChange}>
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="most-votes">Most votes</option>
                        <option value="least-votes">Least votes</option>
                    </select>
                </div>

                <div className="PostsView">
                    {this.state.posts.map(post => (
                        <Post ref={post.id} id={`post_${post.id}`} key={post.id} postID={`post_${post.id}`} user={post.user} body={post.description} imgurLink={post.imgur_link} category={post.category} />
                    ))}
                </div>

            </div>
        )
    }
}


export default Category