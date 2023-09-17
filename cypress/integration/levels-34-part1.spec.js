/// <reference types="Cypress" />

/* NOTE: before you start, make sure you can access 
 * http://localhost:1337/posts
 * http://localhost:1337/comments
 * http://localhost:1337/users
 * for /users see Permissions screenshots on iLearn next to this file
 */

import { Model } from '../../public/js/model.js';


var assert = chai.assert;

describe('Locate page elements', function(){  

    beforeEach(() => {
      cy.visit('http://localhost:1337/');  
      cy.wait(100);
      cy.request('http://localhost:1337/posts').then((response) => {
        Model.data.posts  = response.body;
      });
    }),

    it("FR 3-1  FR 3-2 Navigation and Login Form  ", function(){
      // Home (#),(#!/all-posts),(#!/my-posts),(#whatis)
      cy.get("a[href='#']");
      cy.get("a[href='#!/all-posts']");
      cy.get("a[href='#!/my-posts']");
      cy.get("a[href='#whatis']");
  
      // As a visitor to the site, when I load the main page, I see a form with 
      // entry boxes for username and password and a button labelled 'Login'.
      // The login form will have the id 'loginform' and will use fields named 'username' and 'password'.
      cy.get("form");
      cy.contains('input').contains('username');
      cy.contains('input').contains('password');
      cy.contains('input').contains('submit');
      cy.contains("Login");
    })

});

describe('All Posts and comments', function(){   

    beforeEach(() => {
      cy.visit('http://localhost:1337/#!/all-posts');  

      cy.request('http://localhost:1337/posts').then((response) => {
        Model.data.posts  = response.body;
      });
    }),

    it("FR 3-6 All Posts View", function(){
      // The 'All Posts' view displays all posts with the most recent posts on top.
      let db_posts  = Model.getPosts();
      let all_posts = Model.getRecentPosts(db_posts.length);
      let lasttime = new Date(all_posts[0].published_at);
      for(let i=1; i<all_posts.length; i++) {
          let thistime = new Date(all_posts[i].published_at);
          if (all_posts[i].p_comment != []) {
             let num_comments = (all_posts[i].p_comment).length;
             // iterate through comments
             for(let j=0; j<num_comments; j++) {
                  let comment = all_posts[i].p_comment[j].c_content;
                  expect(comment).not.null;
             }
          }
          expect(thistime).to.be.below(lasttime)
          lasttime = thistime;
      }
     })
 });




describe('User posts', function(){   

  beforeEach(() => {
           
      cy.visit('http://localhost:1337');
      cy.request('http://localhost:1337/posts').then((response) => {
                  Model.data.posts  = response.body;
      });
      cy.request('http://localhost:1337/users').then((response) => {
                  Model.data.users  = response.body;
      });
  }),
 

  it("FR 3-7  Selects My Posts ", function(){

    cy.visit('http://localhost:1337/#!/my_posts/');

    var my_posts = null;
    var num_posts = 0;

    // two random users
    for(let i=0; i<3; i++) {
      let j = (Math.floor(Math.random() * (Model.data.users.length)));
      let a_user = Model.data.users[j];
      let username = a_user.username;
      let pid = a_user.id;
    
      my_posts = Model.getUserPosts(pid);
      num_posts = my_posts.length;
    
      // if any posts for that user
      if (num_posts > 0) {
          for(let k=0; k < num_posts; k++) {
            let a_post = my_posts[k];
            // posts are correctly extracted
            expect((a_post.p_author).username).to.deep.equal(username);
          }
        }
      }
  })
});


 describe('Comment and post form page elements', function(){   

    beforeEach(() => {
        cy.visit('http://localhost:1337/');  
            
        cy.request('http://localhost:1337/posts').then((response) => {
                Model.data.posts  = response.body;
        });
       
    }),
  

    it("FR 4-1 Post Form in My Posts", function(){
        // As a logged-in user, when I load the 'My Posts' view, I see a form that has entry boxes for a URL link for the image and a 
        // caption for the image and a button labelled 'Create a Post'.
        // The post form will have the id 'postform' and will use fields named 'p_url' and 'p_caption'.
        
        cy.visit("http://localhost:1337/#!/my_posts/"); 
        cy.get("form");
        cy.contains("button");
        cy.contains("Create a Post");

    }),

    it("FR 4-4 Comment Form in Single Post view", function(){
        // As a logged-in user, when I load the 'Single Post' view for a post, 
        // I can see a comment form which has the following: an entry box 
        // for the comment and a 'Add a Comment' button.
        // The form will have the id 'commentform' and will use a filed named 'c_content'.
       
       let a_post = Model.getRandomPosts(1);
       let pid = a_post[0].id;
       cy.visit("http://localhost:1337/#!/posts/"+pid); 
       cy.wait(100);
       cy.get("form");
       cy.contains("commentform");
       cy.contains("Comment");
       cy.contains("Add a Comment");
       cy.contains("button");
       cy.contains("c_content");
       cy.contains("c_post");
   })
});


describe('Show comments in Single Post view', function(){   

    beforeEach(() => {
          cy.visit('http://localhost:1337/');      
          cy.request('http://localhost:1337/posts').then((response) => {
                  Model.data.posts  = response.body;
          });
          cy.request('http://localhost:1337/comments').then((response) => {
            Model.data.comments  = response.body;
          });
        }),
  

  it("FR 4-3 Show All Comments in Single Post View", function(){
    // As a logged-in user, when I load the 'Single Post' view for a post, 
    // I can see all the comments for the currently viewed post order by most 
    // recently added on top, along with all the information required in Level 2.

      // select a post at random and get all its comments
      let a_post = Model.getRandomPosts(1);
      let pid = a_post[0].id;
 
      cy.visit("http://localhost:1337/#!/posts/"+pid); 
      let comments_list = a_post[0].p_comment;
      if ( comments_list!= []) {
           let num_comments = comments_list.length;
           // iterate through comments
           for(let j=0; j<num_comments; j++) {
                let a_comment = comments_list[j].c_content;
                expect(a_comment.length).not.lessThan(1);
           }
        }
    })
 });