import React, { Component } from 'react'
import './Post.css'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'
import axios from 'axios';

const cookies = new Cookies()
const token = cookies.get('token')

class Post extends Component {
    constructor(props) {
        super(props)
        this.state = { votes: 0, btnToDisable: null }
        this.clickImage = this.clickImage.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
        this.upvote = this.upvote.bind(this)
        this.downvote = this.downvote.bind(this)
        this.undoVote = this.undoVote.bind(this)
        this.addVote = this.addVote.bind(this)
        this.deleteVote = this.deleteVote.bind(this)
    }

    componentDidMount = () => {
        let that = this
        let postID = Number(this.props.postID.slice(-1))
        let user_id = cookies.get('user').id
        //get number of votes for post
        axios.get(`/api/vote/${postID}?token=${token}`)
            .then(res => {
                let payloadSum = 0
                res.data.result.map(vote => payloadSum += vote.payload)
                this.setState({ votes: payloadSum })

                //check if I have already voted on this
                axios.get(`/api/vote/${postID}/${user_id}?token=${token}`)
                    .then(res => {
                        //if there are no results, I have not voted
                        if (res.data.result.length !== 0) {
                            //already voted
                            let currentPayload = res.data.result[0].payload
                            if (currentPayload == 1) {
                                //already upvoted => disable upvote button
                                this.setState({ btnToDisable: 'upvote-button' })
                            } else if (currentPayload == -1) {
                                //already downvoted => disable downvote button
                                this.setState({ btnToDisable: 'downvote-button' })
                            }
                        }
                    })
                    .catch(err => console.error(err))

            })
            .catch(err => console.error(err))

        setTimeout(function () {
            if (that.props.body == '') {
                let thisID = that.props.postID
                let thisElelemt = document.getElementById(thisID)
                thisElelemt.style.cssText = 'height:auto !important'
            }
        }, 100)
    }

    clickImage() {
        let url = this.props.imgurLink
        let win = window.open(url, '_blank')
        win.focus()
    }

    undoVote() {
        return new Promise((resolve, reject) => {
            //delete vote w/ my user_id and this post_id
            let post_id = Number(this.props.postID.slice(-1))
            let user_id = cookies.get('user').id
            axios.delete(`/api/vote?token=${token}`, { data: { post_id, user_id } })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    deleteVote(payload) {
        return new Promise((resolve, reject) => {
            //delete vote w/ my user_id and this post_id and payload
            let post_id = Number(this.props.postID.slice(-1))
            let user_id = cookies.get('user').id
            axios.delete(`/api/vote?token=${token}`, { post_id, user_id, payload })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    addVote(payload) {
        return new Promise((resolve, reject) => {
            let post_id = Number(this.props.postID.slice(-1))
            let user_id = cookies.get('user').id
            axios.post(`/api/vote?token=${token}`, { post_id, user_id, payload })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    upvote(e) {
        if (this.state.btnToDisable !== 'upvote-button') {
            let altBtn
            altBtn = e.target.nextSibling
            if (!altBtn) altBtn = e.target.parentNode.nextSibling
            if (e.target.classList.contains('active')) {
                e.target.classList.remove('active')
                this.undoVote()
                    .catch(err => console.error(err))
                    .then(() => {
                        this.setState({ votes: this.state.votes - 1 })
                    })
            } else {
                e.target.classList.add('active')
                altBtn.classList.remove('active')
                //delete vote w/ negative payload, my user_id and this post_id if it exists
                // thencreate new vote w/ positive payload, my user_id and this post_id
                this.deleteVote(-1)
                    .catch(err => console.error(err))
                    .then(() => {
                        this.addVote(1)
                            .catch(err => console.error(err))
                            .then(() => {
                                this.setState({ votes: this.state.votes + 1 })
                            })
                    })
            }
        } else {
            e.target.classList.remove('active')
            this.undoVote()
                .catch(err => console.error(err))
                .then(() => {
                    this.setState({ votes: this.state.votes - 1 })
                })
        }
    }

    downvote(e) {
        if (this.state.btnToDisable !== 'downvote-button') {
            let altBtn = e.target.parentNode.previousSibling
            if (e.target.classList.contains('active')) {
                e.target.classList.remove('active')
                this.undoVote()
                    .catch(err => console.error(err))
                    .then(() => {
                        this.setState({ votes: this.state.votes + 1 })
                    })
            } else {
                e.target.classList.add('active')
                altBtn.classList.remove('active')
                //delete vote w/ positive payload, my user_id and this post_id
                //create vote w/ negative payload, my user_id and this post_id
                this.deleteVote(1)
                    .catch(err => console.error(err))
                    .then(() => {
                        this.addVote(-1)
                            .catch(err => console.error(err))
                            .then(() => {
                                this.setState({ votes: this.state.votes - 1 })
                            })
                    })
            }
        } else {
            e.target.classList.remove('active')
            this.undoVote()
                .catch(err => console.error(err))
                .then(() => {
                    this.setState({ votes: this.state.votes + 1 })
                })
        }
    }

    render() {

        let disableVoteBtns = () => {
            let btnToDisable = this.state.btnToDisable
            switch (btnToDisable) {
                case 'upvote-button':
                    return (
                        <>
                            <button type="button" className="btn vote-button upvote-button active" onClick={this.upvote}><i className="fas fa-arrow-up"></i></button>
                            <button type="button" className="btn vote-button downvote-button" onClick={this.downvote}><i className="fas fa-arrow-down"></i></button>
                        </>
                    )

                case 'downvote-button':
                    return (
                        <>
                            <button type="button" className="btn vote-button upvote-button" onClick={this.upvote}><i className="fas fa-arrow-up"></i></button>
                            <button type="button" className="btn vote-button downvote-button active" onClick={this.downvote}><i className="fas fa-arrow-down"></i></button>
                        </>
                    )

                default:
                    return (
                        <>
                            <button type="button" className="btn vote-button upvote-button" onClick={this.upvote}><i className="fas fa-arrow-up"></i></button>
                            <button type="button" className="btn vote-button downvote-button" onClick={this.downvote}><i className="fas fa-arrow-down"></i></button>
                        </>
                    )
            }
        }

        return (
            <div className="Post" id={this.props.postID}>
                <div className="img-wrapper" onClick={this.clickImage}>
                    <img src={this.props.imgurLink} />
                </div>
                <p className="bodyText">{this.props.body}</p>
                <div className="blank"></div>
                <div className="voteButtons">
                    {disableVoteBtns()}
                </div>
                <div className="footer">
                    <p id="votes-text">{this.state.votes}</p>
                    <p id="points-text">points</p>
                    <span style={{ display: 'flex' }}>
                        <Link to={`/user/${this.props.user}`}><p id="user-text">{this.props.user}</p></Link>
                        <p id="category-text">in <Link id="category-link" to={`/category/${this.props.category}`}>{this.props.category}</Link></p>
                    </span>
                    <div className="blank"></div>
                    <div id="timestamp">4h ago</div>
                </div >
            </div >
        )
    }
}


export default Post