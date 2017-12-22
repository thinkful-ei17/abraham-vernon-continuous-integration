const chai = require('chai');
const chaiHttp = require('chai-http');
/*
global describe, before, after, it

*/
const {app, runServer, closeServer} = require('../index');

// this lets us use *should* style syntax in our tests
// so we can do things like `(1 + 1).should.equal(2);`
// http://chaijs.com/api/bdd/
const should = chai.should();

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);


describe("Blog Posts", function(){
    // Before our tests run, we activate the server. Our `runServer`
    // function returns a promise, and we return the that promise by
    // doing `return runServer`. If we didn't return a promise here,
    // there's a possibility of a race condition where our tests start
    // running before our server has started.
    before(function() {
        return runServer();
    });

    // although we only have one test module at the moment, we'll
    // close our server at the end of these tests. Otherwise,
    // if we add another test module that also has a `before` block
    // that starts our server, it will cause an error because the
    // server would still be running from the previous tests.
    after(function() {
        return closeServer();
    });


    it('should GET all blog posts', function(){
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array'); // test for this
            });
    });

    it('should POST all blog posts', function(){
        return chai.request(app)
            .post('/blog-posts')
            .send({
              "id": "86" ,
            	"title": "Bitcoin reach a million dollars!! OMFG.",
            	"content" : "Magic Happened." ,
            	 "author": "One",
            	 "publishDate": "12-12-18"
            })
            .then(function(res){
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.include.keys('id', 'author','title', "publishDate", "content");
            });
    });

    it('should DELETE a blog post', function(){
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res){
                return chai.request(app)
                    .delete(`/blog-posts/${res.body[0].id}`);
            })
            .then(function(res){
                res.should.have.status(204);
            });
    });

    it('should PUT a set of changes to a blog post', function(){
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res){
                const rId = res.body[0].id;
                return chai.request(app)
                    .put(`/blog-posts/${rId}`)
                    .send({
                          "id": rId ,
                          "title": "Litecoin drops to a dollar!!!! OMFG.",
                          "content" : "Hackers Happened." ,
                          "author": "One",
                           "publishDate": "12-12-20"
                                })
                    .then(function(res){
                        res.should.have.status(204);
                    });
            });
    });
});
