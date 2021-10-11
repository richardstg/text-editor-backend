const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
} = require("graphql");

const TeacherType = require("./teacher.js");
const StudentType = require("./student.js");

const CourseType = new GraphQLObjectType({
  name: "Course",
  description: "This represents a course",
  fields: () => ({
    courseCode: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    credits: { type: GraphQLNonNull(GraphQLFloat) },
    teachers: {
      type: GraphQLList(TeacherType),
      resolve: (course) => {
        return course.teachers;
      },
    },
    students: {
      type: GraphQLList(StudentType),
      resolve: (course) => {
        return course.students;
      },
    },
  }),
});

module.exports = CourseType;
