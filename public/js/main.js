/*
 *
 * Module: <main>
 * This module implements main entry point. First, the window will load the redraw function to display the web page.
 * Then, when the binding or loginbinding function have been called, the system will implement designste function in the model.js.
 * After that, the designste function will call the addEventListener to retrieve the lastest data and using the participate view function in the views.js.
 * 
 * Student Name:WEI-CHIA SU
 * Student Number: 46184597
 *
 */

import * as views from './views.js';
import { Model } from './model.js';
import { splitHash } from './util.js';
import { Auth } from './service.js';


window.addEventListener("modelUpdated", function (event) {
    
    console.log('modelUpdata trigger')
    let data = Model.data.posts;
    console.log("there is", data);

    if (window.location.hash.includes("my-posts")) {
        let aid=Auth.getUser().id;
        console.log('author id',aid);
        let upost = Model.getUserPosts(aid);
        views.mypostView("main", upost,addpostfrom_handler.bind(aid),addimagefrom_handler.bind(aid));

    }else if(window.location.hash.includes("posts")){
        let id =location.hash.split('/')[2];
        console.log(id);
        let show = Model.getPost(id)
        views.singleView("main",show,commentfrom_handler.bind(id))
        views.commentView("comment",show);
    } else{

    var r = Model.getRandomPosts(5);
    console.log(r);

    views.pictureView("pic1", r[0]);


    let date = Model.getRecentPosts(10);
    views.pictureView("pic2", r[1]);
    views.listView("recentPost", date);


    let like = Model.getPopularPosts(10);
    views.pictureView("pic3", r[2]);
    views.listView("popularPost", like);

    }
    
    

    window.onhashchange = onNavigate;
   

    bindings();
    let user=Auth.getJWT()

    if(user===null){
        loginbinding();
        console.log("work")
    }
    

})

function onNavigate() {
    if (window.location.hash.includes("all-posts")) {
        console.log("all posts")
        let udata = Model.getPosts();
        udata.sort(dateData("published_at"));
        function dateData(property) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];

                return Date.parse(value2) - Date.parse(value1);

            }

        }
        views.allpostView("main", udata);
        let names = document.getElementsByClassName("p_name");
        for (let i = 0; i < names.length; i++) {
          names[i].onclick = singleView_handler;}
        
    }else if(window.location.hash.includes("my-posts")){
        if (!Auth.getJWT()) {
            window.alert('please login first');
            location.hash = "";
        } else{
           
            let aid=Auth.getUser().id;
            console.log('author id',aid);
            let uff = Model.getUserPosts(aid);
             views.mypostView("main", uff,addpostfrom_handler.bind(aid),addimagefrom_handler.bind(aid));
             let names = document.getElementsByClassName("p_name");
            for (let i = 0; i < names.length; i++) {
              names[i].onclick = singleView_handler;
              }
            bindings();
             
    }    
    }
} 

window.addEventListener("userLogin", function (e) {
    console.log('userLogin triggered')
    
    views.loginView("login", Auth.getUser())
})

window.addEventListener("postAdded", function (e) {

    console.log('postAdded triggered')
   
    Model.updatePosts();

    
})

window.addEventListener("imageAdded", function (e) {

    console.log('imageAdded triggered')
   
    Model.updatePosts();

    
})

window.addEventListener("commentAdded", function (e) {

    console.log('commentAdded triggered')
    
    Model.updatePosts();
})

window.addEventListener("likeAdded", e => {

    Model.updatePosts();


    bindings();
})

window.addEventListener("postRemoved", e => {

    Model.updatePosts();


    bindings();
})

function addpostfrom_handler(event) {
    event.preventDefault()
    

    const pict = event.target.elements['p_url'].value
    const cap = event.target.elements['p_caption'].value
    let ln = Auth.getUser();

    console.log(ln)
    const postData = {
        'p_url': pict,
        'p_caption': cap,
        'p_author': ln
    }
    console.log(postData)
    Model.addPost(postData)

}

function addimagefrom_handler(event) {
    event.preventDefault()
    console.log(this)

    const cap = event.target.elements['p_caption'].value
    const picture = event.target.elements['p_image'].files[0]
    let ln = Auth.getUser();

    console.log(ln)
    const postData = {
        'p_caption': cap,
        'p_author': ln
    }
    const pictureData = new FormData()
    pictureData.append("files", picture)


    Model.addImage(pictureData, postData)

}

function commentfrom_handler(event) {
    if (!Auth.getJWT()) {
        window.alert('please login first');

    } else{
        event.preventDefault()
        const com = event.target.elements['c_content'].value
        let ln = Auth.getUser();
        const commentData = {
            'c_content': com,
            'c_author': ln,
            'c_post': this
        }
        console.log(commentData)
        Model.addComment(commentData)
    }
    
}

function like_handler() {
    event.preventDefault()
    Model.addLike(this.dataset.id)
}

function remove_handler() {
    event.preventDefault()
    Model.addDelete(this.dataset.id)
}

function singleView_handler() {
    let id = this.dataset.id;
    console.log(id);
    let pic = Model.getPost(id);
    console.log("this ",pic)
    console.log("this ",pic.p_comment)
    
    location.hash = "#!/posts/" + pic.id;
    views.singleView("main", pic, commentfrom_handler.bind(id));
    views.commentView("comment",pic)
    bindings()
}


function bindings() {
    let names = document.getElementsByClassName("p_name");
    for (let i = 0; i < names.length; i++) {
        names[i].onclick = singleView_handler;
    }

    let likes = document.getElementsByClassName("p_like");
    for (let i = 0; i < likes.length; i++) {
        likes[i].onclick = like_handler;
    }

    let remove = document.getElementsByClassName("delete");
    for (let i = 0; i < remove.length; i++) {
        remove[i].onclick = remove_handler;
    }

    
    // let imageform = document.getElementById('addimage-form')
    // imageform.onsubmit = image_handler

   
}

function loginbinding() {

    let loginform = document.getElementById('login-form')
    loginform.onsubmit = loginfrom_handler

    function loginfrom_handler(event) {
        event.preventDefault()
        console.log('the login form', this)
    
        const pname = this.elements['user'].value
        const pword = this.elements['password'].value
    
        const username = {
            'identifier': pname,
            'password': pword
        }
    
        const password = {
    
            'password': pword
        }
        Auth.login(username, password);
        views.loginView("login", Auth.getUser())
        
    }

}

function redraw(){
    Model.updatePosts();
}


window.onload = function () {
    redraw();
    views.loginView("login", Auth.getUser(), true)
    console.log('here we are now')
};

