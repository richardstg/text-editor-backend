const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");

const CourseType = require("./course.js");
const TeacherType = require("./teacher.js");
const StudentType = require("./student.js");

// const courses = require("../models/courses.js");

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    course: {
      type: CourseType,
      description: "A single course",
      args: {
        courseCode: { type: GraphQLString },
      },
      resolve: async function (parent, args) {
        let courseArray = await courses.getAll();

        return courseArray.find(
          (course) => course.courseCode === args.courseCode
        );
      },
    },
    courses: {
      type: GraphQLList(CourseType),
      description: "List of all courses",
      resolve: async function () {
        return await courses.getAll();
      },
    },
    teacher: {
      type: TeacherType,
      description: "A single teacher",
      args: {
        acronym: { type: GraphQLString },
      },
      resolve: async function (parent, args) {
        let teachers = await getPeople("teachers");

        return teachers.find((teacher) => teacher.acronym === args.acronym);
      },
    },
    teachers: {
      type: GraphQLList(TeacherType),
      description: "List of teachers",
      resolve: async function () {
        return await getPeople("teachers");
      },
    },
    students: {
      type: GraphQLList(StudentType),
      description: "List of students",
      resolve: async function () {
        return await getPeople("students");
      },
    },
  }),
});

async function getPeople(entity) {
  let courseArray = await courses.getAll();
  let people = [];
  let acronyms = [];
  courseArray.forEach(function (course) {
    course[entity].forEach(function (person) {
      if (acronyms.indexOf(person.acronym) === -1) {
        people.push(person);
        acronyms.push(person.acronym);
      }
    });
  });

  return people;
}

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: "Add a book",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorId,
        };
        books.push(book);
        return book;
      },
    },
    addAuthor: {
      type: AuthorType,
      description: "Add an author",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const author = { id: authors.length + 1, name: args.name };
        authors.push(author);
        return author;
      },
    },
  }),
});

module.exports = RootQueryType;
module.exports = RootMutationType;
