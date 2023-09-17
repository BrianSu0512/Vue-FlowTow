/// <reference types="Cypress" />

import {Model} from '../../public/js/model.js';
var assert = chai.assert;


describe("Main Page", function() {

    beforeEach(function() {
        // visits site
        cy.visit('http://localhost:1337/');
        cy.wait(100);
    });

    

    it("Successfully loads", function() {
        cy.visit('http://localhost:1337/');
        cy.wait(100);
    })


    // FR 1-1
    //a href="#"
    it("FR 1-1 Has links to views # and #whatis", function() {  
        cy.get("a[href='#']");
        cy.get("a[href='#whatis']");
    })

    // FR 1-2  Welcome to FlowTow</h1>
    it("FR 1-2 Has a title Welcome to FlowTow!", function() {
        cy.contains("Welcome to FlowTow!", { matchCase: false });
    })

    // FR 1-3 Thee images in <div> flowtow
    it("FR 1-3 Contains three images", function() {

        for(let i=0; i<3; i++) {
            cy.get("div[class='flowtow']");
            cy.contains(/p_url|p_image/);
            cy.contains("p_caption");
            cy.contains("p_author");
            cy.contains("p_likes");
            }

        
    })

    // FR 1-4, 1-5 Ten Most Recent and Ten Pupular Posts, 3 images
    it("FR 1-4, 1-5, 2-2. Ten most recent and ten most popular posts with correct fields", function() {
        cy.contains("Recent Posts", { matchCase: false });
        cy.contains("Popular Posts", { matchCase: false });
        
        // contains at least 23 images
        for(let i=0; i<23; i++) {
            cy.get("img");
            cy.contains(/p_url|p_image/);
            cy.contains("p_caption");
            cy.contains("p_author");
            cy.contains("published_at");
        }
        // contains 20 likes in the two lists
        for(let i=0; i<20; i++) {
            cy.contains("p_likes");
            cy.contains("button");
        }
    })
    
    // FR 1-6. Like Buttons
    it("FR 1-6 Contains Like button for each post in two lists", function() {
        for(let i=0; i<20; i++) {
            cy.get("button[type='button']");
            cy.contains("Like");
        }
    });


    // FR 1-7. Link to About Section 
    it("FR 1-7 Contains a section About", function() {
        cy.contains('About');
    });

        // FR 1-8.  <link rel="stylesheet" href="css/style.css" type="text/css">
    it("FR 1-8 Uses a stylesheet", function() {      
    
        cy.get('head link[rel="stylesheet"]').should(
            'have.attr',
            'type',
            'text/css'
            );
    })

});

describe("A Single Post View", function() {

    beforeEach(() => {
        cy.visit('http://localhost:1337/');      
        cy.request('http://localhost:1337/posts').then((response) => {
                    Model.data.posts  = response.body;
            });
    
        }),

    it("successfully loads", function() {
        // visit first image entry
        let index = Model.data.posts[0].id;
        cy.visit('http://localhost:1337/#!/posts/'+index);
    })

    // FR 2-3.-- single post: loads and contains correct info
    // A Single Post View: the image (larger version instead of a thumbnail), 
    // caption, author, post date, number of likes, 'Like' button
    it("FR 2-3. Displays four posts at random in a Single Post view", function() {

        // pick three posts at random
        for(let i=0; i<4; i++) {
            let j = Math.floor(Math.random() * Model.data.posts.length);
            cy.visit('http://localhost:1337/#!/posts/'+ j);
            cy.wait(100);
            cy.contains(/p_url|p_image/);
            cy.contains("p_caption");
            cy.contains("p_author");
            cy.contains("published_at");
            cy.contains("p_likes");
            cy.contains("button");
        }
    });

});

