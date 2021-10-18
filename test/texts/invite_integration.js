process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const { app: server } = require("../../app.js");

chai.should();
chai.use(chaiHttp);

let token;

describe("Invite", () => {
  beforeEach((done) => {
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

  // describe("REJECTED WHEN NO TOKEN", () => {
  //   it("403 FAIL", (done) => {
  //     chai
  //       .request(server)
  //       .get("/invite")
  //       .end((err, res) => {
  //         if (err) done(err);
  //         res.should.have.status(403);
  //         done();
  //       });
  //   });
  // });

  describe("POST /", () => {
    it("200 SEND INVITE", (done) => {
      chai
        .request(server)
        .post("/invite")
        .set("content-type", "application/json")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          email: "richard.stegersjo@gmail.com",
          textId: "616bd342975b0e3794c8cf26",
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.be.an("object");
          done();
        });
    });
    it("500 SEND INVITE TEXT DOES NOT EXIST", (done) => {
      chai
        .request(server)
        .post("/invite")
        .set("content-type", "application/json")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          email: "richard.stegersjo@gmail.com",
          textId: "616ad1485b44d20d7",
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(500);
          done();
        });
    });
  });
});
