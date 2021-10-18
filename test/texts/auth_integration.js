process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const { app: server } = require("../../app.js");
const User = require("../../models/user.js");

chai.should();

chai.use(chaiHttp);
let token;

describe("Auth", () => {
  describe("POST /login", () => {
    it("200 LOGIN SUCCESS", (done) => {
      chai
        .request(server)
        .post("/auth/login")
        .send({
          email: "test@test.com",
          password: "richard",
        })
        .end((err, res) => {
          if (err) done(err);
          token = res.body.token;
          res.should.have.status(200);
          done();
        });
    });
    it("403 LOGIN FAIL WRONG PASSWORD", (done) => {
      chai
        .request(server)
        .post("/auth/login")
        .send({
          email: "test@test.com",
          password: "richard_wrong_password",
        })
        .end((err, res) => {
          if (err) done(err);
          token = res.body.token;
          res.should.have.status(403);
          done();
        });
    });
    it("403 LOGIN FAIL USER DOES NOT EXIST", (done) => {
      chai
        .request(server)
        .post("/auth/login")
        .send({
          email: "does_not_exist@test.com",
          password: "richard",
        })
        .end((err, res) => {
          if (err) done(err);
          token = res.body.token;
          res.should.have.status(403);
          done();
        });
    });
  });

  describe("POST /signup", () => {
    it("201 SIGNUP SUCCESS", (done) => {
      chai
        .request(server)
        .post("/auth/signup")
        .send({
          email: "test_user_2@test.com",
          password: "richard",
        })
        .end((err, res) => {
          if (err) done(err);
          userId = res.body.userId;
          res.should.have.status(201);
          User.findById(userId)
            .then((user) => {
              user.remove();
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
        });
    });
    it("422 SIGNUP FAIL USER EXISTS", (done) => {
      chai
        .request(server)
        .post("/auth/signup")
        .send({
          email: "test@test.com",
          password: "richard",
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(422);
          done();
        });
    });
    it("422 SIGNUP FAIL INVALID EMAIL FORMAT", (done) => {
      chai
        .request(server)
        .post("/auth/signup")
        .send({
          email: "testtest.com",
          password: "richard",
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(422);
          done();
        });
    });
    it("422 SIGNUP FAIL INVALID PASSWORD FORMAT", (done) => {
      chai
        .request(server)
        .post("/auth/signup")
        .send({
          email: "testtest.com",
          password: "ri",
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(422);
          done();
        });
    });
  });
});
