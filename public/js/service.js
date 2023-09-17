/*
 *
 * Module: <service>
 * This module implements user authentication 
 * login function is to send the input dat to backend server. Then, the server will verify the data which match the user data or not.
 * There also provides the two function to get the user name and JWT. Those can verify the system have been logged in or not  
 *
 * Student Name:WEI-CHIA SU
 * Student Number:46184597
 *
 */ 

export {Auth}

const Auth = {
    userData: null,

    // login - handle user login  
    //      by submitting a POST request to the server API
    //      username - is the input username
    //      password - is the input password
    // when the request is resolved, creates a "userLogin" event
    login: function(username, password) {
        fetch('/auth/local',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(username, password)
            
            
        })
        .then((response)=>{
            return response.json()
        })
        .then((data)=>{
            console.log('well done!')
            console.log('the response data',data)
            this.userData=data

            let event=new CustomEvent('userLogin')
            window.dispatchEvent(event)
        })
       
    }, 

    //getUser - return the user object from userData
    getUser: function() {
        if (this.userData) {
            return this.userData.user;
        } else {
            return null;
        }
    },

    //getJWT - get the JWT from userData
    getJWT: function() {
        if (this.userData) {
            return this.userData.jwt;
        } else {
            return null;
        } 
    }
    
}