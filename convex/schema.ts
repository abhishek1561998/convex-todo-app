import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    text: v.string(),        // Todo description
    completed: v.boolean(),  // Completion status
  }),
});