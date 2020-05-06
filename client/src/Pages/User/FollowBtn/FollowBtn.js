import React, { Component } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import './FollowBtn.css'

const cookies = new Cookies()
const token = cookies.get('token')

class FollowBtn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFollowing: false
        }

        this.follow = this.follow.bind(this)
        this.unfollow = this.unfollow.bind(this)
    }

    componentWillMount() {
        let follower = this.props.me.username
        let following = this.props.userToFollow
        console.log({ follower, following })
        axios.get(`/api/user/follow/${following}/${follower}?token=${token}`)
            .catch(err => console.log(err))
            .then(res => {
                let isFollowing = res.data.result.length > 0 ? true : false
                this.setState({ isFollowing })
            })
    }

    follow() {
        let follower = this.props.me.username
        let following = this.props.userToFollow
        let postData = { follower, following }
        axios.post(`/api/user/follow?token=${token}`, postData)
            .catch(err => console.log(err))
            .then(res => {
                this.setState({ isFollowing: true })
            })
    }

    unfollow() {
        let follower = this.props.me.username
        let following = this.props.userToFollow.username
        axios.delete(`/api/user/follow/${following}/${follower}?token=${token}`)
            .catch(err => console.log(err))
            .then(res => {
                this.setState({ isFollowing: false })
            })
    }

    render() {
        if (this.state.isFollowing) {
            return (
                <button className="FollowBtn active" onClick={this.unfollow}>Unfollow</button>
            )
        } else {
            return (
                <button className="FollowBtn" onClick={this.follow}>Follow</button>
            )
        }
    }
}


export default FollowBtn