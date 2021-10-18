process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const { app: server } = require("../../app.js");

chai.should();
chai.use(chaiHttp);

let token;

describe("Texts", () => {
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

  describe("REJECTED WHEN NO TOKEN", () => {
    it("403 FAIL", (done) => {
      chai
        .request(server)
        .get("/")
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(403);
          done();
        });
    });
  });

  describe("GET /", () => {
    it("200 GET ALL TEXTS", (done) => {
      chai
        .request(server)
        .get("/")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.be.an("array");
          res.body.length.should.be.above(0);
          done();
        });
    });
  });

  describe("GET /:id", () => {
    it("200 GET A TEXT BY ID", (done) => {
      chai
        .request(server)
        .get("/616b3560543851487ce503bd")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.be.an("object");
          done();
        });
    });
    it("500 GET A TEXT BY ID TEXT DOES NOT EXIST", (done) => {
      chai
        .request(server)
        .get("/616987fb4d87486")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(500);
          res.body.should.be.an("object");
          done();
        });
    });
  });

  describe("POST /", () => {
    beforeEach((done) => {
      chai
        .request(server)
        .post("/auth/login")
        .send({
          email: "test_2@test.com",
          password: "richard",
        })
        .end((err, res) => {
          if (err) done(err);
          token = res.body.token;
          res.should.have.status(200);
          done();
        });
    });
    it("201 ADD A NEW TEXT", (done) => {
      chai
        .request(server)
        .post("/")
        .set("content-type", "application/json")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          name: "Mr. Tester",
          content: "console.log('hej');",
          code: true,
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(201);
          res.body.should.be.an("object");
          done();
        });
    });
    it("500 ADD A NEW TEXT FAIL", (done) => {
      chai
        .request(server)
        .post("/")
        .set("content-type", "application/json")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          name: "Mr. Tester",
          content: "",
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(500);
          res.body.should.be.an("object");
          done();
        });
    });
  });

  describe("PUT /:id", () => {
    it("200 UPDATE TEXT", (done) => {
      chai
        .request(server)
        .put("/616b3560543851487ce503bd")
        .set("content-type", "application/json")
        .set({ Authorization: `Bearer ${token}` })
        .send({ name: "Mr. Tester", content: "This is a test text." })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.be.an("object");
          done();
        });
    });
    it("500 UPDATE TEXT DOES NOT EXIST", (done) => {
      chai
        .request(server)
        .put("/616987fb4d87434")
        .set("content-type", "application/json")
        .set({ Authorization: `Bearer ${token}` })
        .send({ name: "Mr. Tester", content: "This is a test text." })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(500);
          res.body.should.be.an("object");
          done();
        });
    });
    it("500 UPDATE TEXT INVALID INPUT", (done) => {
      chai
        .request(server)
        .put("/616b3560543851487ce503bd")
        .set("content-type", "application/json")
        .set({ Authorization: `Bearer ${token}` })
        .send({ name: "Mr. Tester", content: "" })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(500);
          res.body.should.be.an("object");
          done();
        });
    });
    it("500 UPDATE TEXT UNAUTHORIZED", (done) => {
      chai
        .request(server)
        .put("/616b367d543851487ce503c0")
        .set("content-type", "application/json")
        .set({ Authorization: `Bearer ${token}` })
        .send({ name: "Mr. Tester", content: "" })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(500);
          res.body.should.be.an("object");
          done();
        });
    });
  });
});
