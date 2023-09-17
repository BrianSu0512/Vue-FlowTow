

export { Model };
import { Auth } from './service.js';


/*
 *
 * Module: <model>
 *This module implements modifying the post data.
 * updatePosts function is to retrieve the lastest data.
 * getPosts function is to collect the current array of the posts.
 * getPost function is to find the specifically post in the array by post id
 * addPost function is to send the new data which contain URL, caption and author name to the backend server.
 * addImage function is to send the new data which contain local image, caption and author nameto the backend server.
 * getUserPosts function is to find the posts wich belong to the user.
 * addLike function is to increase the number of like to the speciifcally post.
 * addComment function is to add the commnet to the speciifcally post.
 * addDelete function is to remove the post from the backend server.
 * getRandomPosts function is to get the random post from the current posts.
 * getRecentPosts function is to sort the array by the publish time.
 * getPopularPosts function is to sort the array by the number of like.
 * 
 * Student Name:WEI-CHIA SU
 * Student Number:46184597
 *
 */

/* 
 * Model class to support the FlowTow application
 * this object provides an interface to the web API and a local
 * store of data that the application can refer to.
 * The API generates different events:
 *   "modelUpdated" event when new data has been retrieved from the API
 *   "postAdded" event when a request to add a new post returns
 *   "likeAdded" event when a request to add a new like returns
 *   "commentAdded" event when a request to add a new comment returns 
*/

const Model = {
    postsUrl: '/posts',
    uploadUrl: '/upload',
    commentsUrl: '/comments',

    //this will hold the post data stored in the model
    data: {
        posts: []
    },



    // updatePosts - retrieve the latest list of posts from the server API
    // when the request is resolved, creates a "modelUpdated" event 
    updatePosts: function () {

        fetch(this.postsUrl)
            .then(
                function (response) {
                    return response.json();
                }
            )
            .then(
                (data) => {

                    this.data.posts = data;

                    let event = new CustomEvent("modelUpdated");
                    window.dispatchEvent(event);


                }
            );
    },

    // getPosts - return an array of post objects
    getPosts: function () {
        //before that you may need to sort the posts by their timestamp
        return this.data.posts;
    },

    // getPost - return a single post given its id
    getPost: function (postid) {

        let post = this.getPosts();

        for (let i = 0; i < post.length; i++) {
            if (post[i].id == postid) {
                return post[i];
            }
        }
    },

    setPosts: function (posts) {
        this.data.posts = posts;
    },

    // addPost - add a new post by submitting a POST request to the server API
    // postData is an object containing all fields in the post object (e.g., p_caption)
    // when the request is resolved, creates an "postAdded" event
    addPost: function (postData) {
        fetch(this.postsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `bearer ${Auth.getJWT()}`
            },
            body: JSON.stringify(postData)
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                console.log('the data is ', data)
                this.data.posts.push(data)
                let event = new CustomEvent("postAdded");
                window.dispatchEvent(event)
            })
    },


    addImage: function (pictureData, postData) {
        fetch(this.uploadUrl, {
            method: 'POST',
            headers: {
                
                Authorization: `bearer ${Auth.getJWT()}`
            },
            body: pictureData
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                console.log('the data is ', data)
                postData = { ...postData, "p_image": data[0] }
                return fetch(this.postsUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `bearer ${Auth.getJWT()}`
                    },
                    body: JSON.stringify(postData)
                })
            })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                console.log(data)
                this.data.posts.push(data)
                let event = new CustomEvent('imageAdded');
                window.dispatchEvent(event)
            })
    },

    // getUserPosts - return just the posts for one user as an array
    getUserPosts: function (userid) {
        console.log(userid);
       
        let posts = this.getPosts();
        posts.sort(dateData("published_at"));
        function dateData(property) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];

                return Date.parse(value2) - Date.parse(value1);

            }

        }

        let result=posts.filter(post => post.p_author?.id===userid);
        return result;
    },

    // addLike - increase the number of likes by 1 
    //      by submitting a PUT request to the server API
    //      postId - is the id of the post
    // when the request is resolved, creates an "likeAdded" event
    addLike: function (postId) {
        fetch(`${this.postsUrl}/${postId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                p_likes: this.getPost(postId).p_likes + 1
            })
        })
            .then(res => res.json())
            .then(data => {
                this.updatePosts();
                window.dispatchEvent(new CustomEvent("likeAdded"));
            })
    },

    addDelete: function (postId) {
        fetch(`${this.postsUrl}/${postId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                Authorization: `bearer ${Auth.getJWT()}`
            }
            
        })
            .then(res => res.json())
            .then(data => {
                this.updatePosts();
                window.dispatchEvent(new CustomEvent("postRemoved"));
            })
    },

    // addComment - add a comment to a post 
    //      by submitting a POST request to the server API
    //      commentData is an object containing the content of the comment, the author and the postid
    // when the request is resolved, creates an "commentAdded" event
    addComment: function (commentData) {
        fetch(this.commentsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `bearer ${Auth.getJWT()}`
            },
            body: JSON.stringify(commentData)
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                console.log('the data is ', data)
                this.data.posts.push(data)
                let event = new CustomEvent("commentAdded");
                window.dispatchEvent(event)
            })
    },

    //getRandomPosts - return N random posts as an array
    getRandomPosts: function (N) {
        let post = this.getPosts();
        var result = [];

       for(let i=0;i<N;i++){
           result.push(post[Math.floor(Math.random() * 10)]) ;
       }
    
       return result.slice(0);
        //return Math.floor(Math.random() * N);
    },


    // getRecentPosts - return the N most recent as an array
    //  posts, ordered by timestamp, most recent first
    getRecentPosts: function (N) {
        let post = this.getPosts();
        post.sort(dateData("published_at"));
        function dateData(property) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];

                return Date.parse(value2) - Date.parse(value1);

            }

        }
        return post.slice(0, N);
    },

    // getPopularPosts - return the N most popular as an array
    // posts, ordered by the number of likes
    getPopularPosts: function (N) {
        let post = this.getPosts();
        post.sort(function (a, b) {
            return b.p_likes - a.p_likes;
        });

        return post.slice(0, N);
    },

}