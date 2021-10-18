process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const { app: server } = require("../../app.js");
const User = require("../../models/user.js");

chai.should();

chai.use(chaiHttp);
let token;

describe("Auth", () => {
  describe("POST /signup", () => {
    it("201 SIGNUP SUCCESS", (done) => {
      chai
        .request(server)
        .post("/auth/signup")
        .send({
          email: "signup@test.com",
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
