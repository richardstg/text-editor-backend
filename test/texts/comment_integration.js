process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const { app: server } = require("../../app.js");

chai.should();
chai.use(chaiHttp);

let token;
let commentDeleteId;

let tokenAdd;
let tokenDelete;

describe("Comments", () => {
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

  describe("GET /", () => {
    it("200 GET ALL COMMENTS FOR TEXT", (done) => {
      chai
        .request(server)
        .get("/comment/616b3560543851487ce503bd")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.be.an("array");
          res.body.length.should.be.above(0);
          done();
        });
    });
    it("500 GET ALL COMMENTS FOR TEXT NO COMMENTS", (done) => {
      chai
        .request(server)
        .get("/comment/616bd906e828c01d2046d9f0")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(500);
          done();
        });
    });
    it("500 GET ALL COMMENTS FOR TEXT, TEXT DOES NOT EXIST", (done) => {
      chai
        .request(server)
        .get("/comment/616987fb4141342b2")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(500);
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
          tokenAdd = res.body.token;
          res.should.have.status(200);
          done();
        });
    });
    it("200 ADD A NEW COMMENT", (done) => {
      chai
        .request(server)
        .post("/comment")
        .set("content-type", "application/json")
        .set({ Authorization: `Bearer ${tokenAdd}` })
        .send({
          row: "1",
          content: "Adding a test comment...",
          textId: "616d5e1e05113f14cafce437",
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.be.an("object");
          done();
        });
    });
    it("500 ADD A NEW COMMENT INVALID INPUT", (done) => {
      chai
        .request(server)
        .post("/comment")
        .set("content-type", "application/json")
        .set({ Authorization: `Bearer ${tokenAdd}` })
        .send({
          row: "row",
          content: "Adding a test comment...",
          textId: "616b3560543851487ce503bd",
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(500);
          res.body.should.be.an("object");
          done();
        });
    });
    it("500 ADD A NEW COMMENT UNAUTHORIZED USER", (done) => {
      chai
        .request(server)
        .post("/comment")
        .set("content-type", "application/json")
        .set({ Authorization: `Bearer ${tokenAdd}` })
        .send({
          row: "1",
          content: "Adding a test comment...",
          textId: "616bd342975b0e3794c8cf26",
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(500);
          res.body.should.be.an("object");
          done();
        });
    });
    it("500 ADD A NEW COMMENT TEXT DOES NOT EXIST", (done) => {
      chai
        .request(server)
        .post("/comment")
        .set("content-type", "application/json")
        .set({ Authorization: `Bearer ${tokenAdd}` })
        .send({
          row: "1",
          content: "Adding a test comment...",
          textId: "616aba98b2209d",
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(500);
          res.body.should.be.an("object");
          done();
        });
    });
  });

  describe("PUT /", () => {
    it("200 UPDATE COMMENT", (done) => {
      chai
        .request(server)
        .put("/comment")
        .set("content-type", "application/json")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          row: "2",
          content: "Updating a test comment...",
          id: "616b356b543851487ce503be",
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.be.an("object");
          done();
        });
    });
    it("500 UPDATE COMMENT DOES NOT EXIST", (done) => {
      chai
        .request(server)
        .put("/comment")
        .set("content-type", "application/json")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          row: "2",
          content: "Updating a test comment...",
          id: "616adac9337184058e511",
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(500);
          done();
        });
    });
    it("500 UPDATE COMMENT INVALID INPUT", (done) => {
      chai
        .request(server)
        .put("/comment")
        .set("content-type", "application/json")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          row: "2",
          content: "",
          id: "616b356b543851487ce503be",
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(500);
          done();
        });
    });
    it("500 UPDATE COMMENT UNAUTHORIZED USER", (done) => {
      chai
        .request(server)
        .put("/comment")
        .set("content-type", "application/json")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          row: "2",
          content: "Content...",
          id: "616b368c543851487ce503c1",
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(500);
          done();
        });
    });
  });

  describe("DELETE /", () => {
    beforeEach((done) => {
      chai
        .request(server)
        .post("/auth/login")
        .send({
          email: "test_3@test.com",
          password: "richard",
        })
        .end((err, res) => {
          if (err) done(err);
          tokenDelete = res.body.token;
          res.should.have.status(200);
          done();
        });
    });
    beforeEach((done) => {
      chai
        .request(server)
        .post("/comment")
        .set("content-type", "application/json")
        .set({ Authorization: `Bearer ${tokenDelete}` })
        .send({
          row: "1",
          content: "Adding a test comment...",
          textId: "616bd76c03c82b5228c48388",
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.be.an("object");
          commentDeleteId = res.body.id;
          done();
        });
    });
    it("200 DELETE COMMENT", (done) => {
      chai
        .request(server)
        .delete("/comment")
        .set("content-type", "application/json")
        .set({ Authorization: `Bearer ${tokenDelete}` })
        .send({
          id: commentDeleteId,
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          done();
        });
    });
    it("500 DELETE COMMENT DOES NOT EXIST", (done) => {
      chai
        .request(server)
        .delete("/comment")
        .set("content-type", "application/json")
        .set({ Authorization: `Bearer ${tokenDelete}` })
        .send({
          id: "616adac93056058e511",
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(500);
          done();
        });
    });
    it("401 DELETE COMMENT UNAUTHORIZED USER", (done) => {
      chai
        .request(server)
        .delete("/comment")
        .set("content-type", "application/json")
        .set({ Authorization: `Bearer ${tokenDelete}` })
        .send({
          id: "616b368c543851487ce503c1",
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(401);
          done();
        });
    });
  });
});
