/// <reference types="Cypress" />

/* Filename: levels-34-part2-ver2.spec
 *
 * NOTE: before you start, make sure you can access 
 * http://localhost:1337/posts
 * http://localhost:1337/comments
 * http://localhost:1337/users
 * for /users see Permissions screenshots on iLearn next to this file
 * 
 * ver2: in (3) and (4) replaced expect(a_post).to.deep.equal(post_by_id);
 * with comparing individual fields
 */


import { Model } from '../../public/js/model.js';

var assert = chai.assert;

describe('My posts View', function(){   

  beforeEach(() => {
           
      cy.visit('http://localhost:1337');
      cy.request('http://localhost:1337/posts').then((response) => {
        Model.data.posts  = response.body;
      });
      cy.request('http://localhost:1337/users').then((response) => {
        Model.data.users  = response.body;  
      });
  }),
 
  it("FR 3-7 (1) My Posts: image, caption, post date, number of likes ", function(){

    cy.visit('http://localhost:1337/#!/my_posts');

    cy.contains(/p_url|p_image/);
    cy.contains("p_caption");
    cy.contains("published_at");
    cy.contains("p_likes");
    cy.contains("button");
   
  }),

  it("FR 3-7  (2) My Posts: displays most recent post on top ", function(){

    cy.visit('http://localhost:1337/#!/my_posts');

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
          var lasttime = new Date(my_posts[0].published_at);
          var thistime = null;
          for(let i=1; i<num_posts; i++) {
            let a_post = my_posts[i];
            // my posts are correctly extracted
            expect((a_post.p_author).username).to.deep.equal(username);
            thistime = new Date(a_post.published_at);
            if (a_post.p_comment !== []) {  
               let num_comments = (a_post.p_comment).length;
               let comment_list = a_post.p_comment;
               expect(comment_list).not.null;
               // iterate through comments
               for(let j=0; j < num_comments; j++) {
                let a_comment = comment_list[j].c_content;
                expect(a_comment).not.null;
               }
            }
            expect(thistime).to.be.below(lasttime)
            lasttime = thistime;
           }
        }
      }
  })
});




describe('APIs', function(){   

    beforeEach(() => {
          cy.visit('http://localhost:1337/');      
          cy.request('http://localhost:1337/posts').then((response) => {
            Model.data.posts  = response.body;
          });
          cy.request('http://localhost:1337/comments').then((response) => {
            Model.data.comments  = response.body;
          });
          cy.request('http://localhost:1337/users').then((response) => {
            Model.data.users  = response.body;
          });
        })
  
        it(" (3) Implemented getPost()", function(){    
          let db_all_posts = Model.data.posts;
  
          // three post at random  
          for(let i = 0; i < 4; i++) {
            let j = (Math.floor(Math.random() * (db_all_posts.length)));
            // posts are correctly extracted
            let post_id  = db_all_posts[j].id;
            let post_from_api = Model.getPost(post_id);
            let db_post = db_all_posts[j];
            expect(db_post.id).to.equal(post_from_api.id);
            expect(db_post.p_caption).to.equal(post_from_api.p_caption);
            expect(db_post.p_author).to.equal(post_from_api.p_author);
            expect(db_post.p_likes).to.equal(post_from_api.p_likes);
          }
      }),

        it(" (4) Implemented getUserPosts()", function(){
          var my_posts = null;
          var num_posts = 0;
          // three users at random
          for(let i=0; i<4; i++) {
            let j = (Math.floor(Math.random() * (Model.data.users.length)));
            let a_user = Model.data.users[j];
            let pid = a_user.id;
          
            my_posts = Model.getUserPosts(pid);
            num_posts = my_posts.length;
          
            // if any posts for that user extracted with getUserPosts()
            if (num_posts > 0) {
                for(let k=0; k < num_posts; k++) {
                  let a_post = my_posts[k];
                  let post_id  = my_posts[k].id;
                  let post_by_id = Model.getPost(post_id);
                  // posts are correctly extracted
                  expect(a_post.id).to.equal(post_by_id.id);
                  expect(a_post.p_caption).to.equal(post_by_id.p_caption);
                  expect(a_post.p_author).to.equal(post_by_id.p_author);
                  expect(a_post.p_likes).to.equal(post_by_id.p_likes);
                }
              }
            }    
    })

 });