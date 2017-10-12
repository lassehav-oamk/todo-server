var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('controllers', function() {

    describe('todos', function() {

        describe('POST and GET /todos', function() {
            var testTodo = {
                description: "Get winter tyres",
                dueDate: "2017-10-20",
                type: "car",
                isDone: false
            };        

            it('should receive one POSTed object, save it and return an id for the object', function(done) {        
                request(server)
                    .post('/todos')
                    .type('json')
                    .send(testTodo)                    
                    .expect(200, done);
            });

            it('should GET an array containing the same object which was POSTed', function(done) {               
                request(server)
                    .get('/todos')          
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err,res){
                        if (err) return done(err);
                        console.log(res.body);
                        res.body.should.be.instanceof(Array).and.have.lengthOf(2);
                        res.body[1].should.have.property("id");
                        res.body[1].id.should.not.be.null();
                        res.body[1].description.should.equal('Get winter tyres');
                        res.body[1].dueDate.should.match("2017-10-20");
                        res.body[1].type.should.equal('car');
                        res.body[1].isDone.should.equal(false);
                        done();
                    })
            });
        });
    });
});
