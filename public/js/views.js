/*
 *
 * Module: <views>
 * This module implements view functions which represent seven different interfaces to decorate the page and meet the requirement. 
 *
 * Student Name:WEI-CHIA SU
 * Student Number: 46184597
 *
 */

export { listView, pictureView, loginView, allpostView, singleView, mypostView,commentView}

function apply_template(targetid, templateid,data) {

    let target = document.getElementById(targetid);

    let template = Handlebars.compile(
        document.getElementById(templateid).textContent
    )
    target.innerHTML = template(data);
}

function listView(targetid, pic) {

    apply_template(targetid,"list-template",{ 'pic': pic })

   
}


function pictureView(targetid, p) {

    apply_template(targetid,"picture-template",p)

}
function commentView(targetid, pic) {

    apply_template(targetid,"comment-template",{ 'pic': pic })

}

function allpostView(targetid, pic) {

    let target = document.getElementById(targetid);
    let template = Handlebars.compile(
        document.getElementById("allPosts-template").textContent
    );
    let list = template();

    target.innerHTML = list;
    let test = [];
    pic.forEach(
        p => {
            console.log(p);
            test.push(`<tr style="border-bottom: 1px solid #ddd;">
            <th  class="p_name" data-id=${p.id} ><img width="80px" height="70px" src="${p.p_url}"></th> 
            <th >${p.p_caption}</th>  
            <th >${p.published_at}</th> 
            <th >${p.p_likes}</th>
            <th >
                <ul>
                ${p.p_comment.map(comment => comment.c_content).reduce(
                (previous, current) => previous + `<li>${current}</li>`, ''
            )}
                </ul>
            </th>
        
            `);
        }
    );
    console.log(target.children);
    console.log(target.children[1]);
     target.children[1].innerHTML = test.reduce(
        (previous, current) => previous + current, ''
    );
}




function singleView(targetid, p, handler) {

    let target = document.getElementById(targetid);

    let template = Handlebars.compile(
        document.getElementById("single-template").textContent
    );
    let pic = template(p);
    console.log(p);
    target.innerHTML = pic;
    let commentform = target.children[0].children[1];
    console.log(commentform);
    commentform.onsubmit = handler
}

function mypostView(targetid, pic,handler,handler1) {

    let target = document.getElementById(targetid);

    let template = Handlebars.compile(
        document.getElementById("myposts-template").textContent
    );
    let list = template({ 'pic': pic });
    console.log(list);
    target.innerHTML = list;
    console.log(target.children);
    console.log(target.children[2]);
    let addpostform = target.children[1];
    console.log(addpostform);
    addpostform.onsubmit = handler

    let addimageform = target.children[2];
    console.log(addimageform);
    addimageform.onsubmit = handler1
    
}

function loginView(targetid, user, untouched = false) {

    let target = document.getElementById(targetid);

    let template = Handlebars.compile(
        document.getElementById("login-template").textContent
    );
    let cus = template({ user, untouched });

    target.innerHTML = cus;

}





