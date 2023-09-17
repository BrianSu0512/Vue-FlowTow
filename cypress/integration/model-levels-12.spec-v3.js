/// <reference types="Cypress" />

import {Model} from '../../public/js/model.js';
var assert = chai.assert;

describe('Model', function(){   

    beforeEach(() => {
      cy.visit('http://localhost:1337/');      
      cy.request('http://localhost:1337/posts').then((response) => {
                Model.data.posts  = response.body;
        });

    }),

    it("FR 2-0 (Strapi) getPosts method returns the list of posts with at least 10 entries", function(){
        let posts = Model.getPosts();
        assert.property(posts[0], "p_image"); 
        assert.property(posts[0], "p_caption");
        assert.property(posts[0], "p_url");
        assert.property(posts[0], "published_at");
        assert.property(posts[0], "p_author");
        assert.property(posts[0], "p_likes");
        // at least 10 entries in posts
        expect(posts.length).greaterThan(9);

    });


    //FR 2-1. Three Posts picked at random  
    // #getRandomPosts:"

    it("FR 2-1. Should return three posts at random", function(){
        // select 3 posts 3 times at randome and do deep compare

        let first_selection = Model.getRandomPosts(3);
        let second_selection = Model.getRandomPosts(3);
        let third_selection = Model.getRandomPosts(3);
        expect(first_selection).to.not.deep.equal(second_selection);
        expect(first_selection).to.not.deep.equal(third_selection);
    });


    //FR 2-2. Ten Most Popular Posts "#getPopularPosts",
    it("FR 2-2. Should return N posts ordered by p_likes", function(){
        let N = 10;
    
        let ten_posts = Model.getPopularPosts(N);
        
            expect(ten_posts.length).to.equal(N);
            let likes1 = Number(ten_posts[0].p_likes);
            for(let i=1; i<ten_posts.length; i++) {
                let likes2 = Number(ten_posts[i].p_likes);
                expect(likes1).to.be.at.least(likes2);
                likes1 = likes2;
            }
    
    });


    //FR 2-2. Ten Most Recent Posts: #getRecentPosts
    //thumbnail of the image, caption, author, post date, number of likes, 'Like' button
    
    it("FR 2-2. Should return N posts ordered by timestamp", function(){

        let N = 10;

        let ten_posts = Model.getRecentPosts(N);
            
            expect(ten_posts.length).to.equal(N);
            let lasttime = new Date(ten_posts[0].published_at);
            for(let i=1; i<ten_posts.length; i++) {
                let thistime = new Date(ten_posts[i].published_at);
                expect(thistime).to.be.below(lasttime)
                lasttime = thistime;
            }
        
    });  

    //FR 2-4. Liking a Post: one more like added: in single View, 10 top and 10 recent
    it("FR 2-4. Liking a Post: one more like added (Single View)", function(){
       // pick a post at random
       let a_post = Model.getRandomPosts(1);
       let pid = a_post[0].id;
       let likes_before = Number(a_post[0].p_likes);

       cy.visit("http://localhost:1337/#!/posts/"+pid); 
       cy.contains("Like").click();
       cy.wait(100);
       
       let updated = String(likes_before + 1);

       // visit same Single Post view again and check number of likes
       cy.visit("http://localhost:1337/#!/posts/"+pid); 
       cy.contains(updated);
    
    });    

    //FR 2-4. Liking a Post: one more like added: in Main page
    it("FR 2-4. Liking a Post: one more like added (Main page)", function(){
        // pick a post at random from Main mage
        cy.visit("http://localhost:1337");
        
        let a_post = Model.getRecentPosts(1);
        let pid = a_post[0].id;
        let likes_before = Number(a_post[0].p_likes);
    
        // first button on the page -- Most recent post
        cy.get("button[type='button']")
        cy.contains("Like").click();
        cy.wait(100);
        
        let updated = String(likes_before + 1);
        cy.visit("http://localhost:1337");
        cy.get("button[type='button']")
        cy.contains(updated);
        
    });    

});

