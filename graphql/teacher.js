const { GraphQLObjectType, GraphQLString, GraphQLNonNull } = require("graphql");

const TeacherType = new GraphQLObjectType({
  name: "Teacher",
  description: "This represents a teacher",
  fields: () => ({
    name: { type: GraphQLNonNull(GraphQLString) },
    acronym: { type: GraphQLNonNull(GraphQLString) },
  }),
});

module.exports = TeacherType;
