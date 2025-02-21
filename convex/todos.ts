import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to list all todos
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("todos").collect();
  },
});

// Mutation to add a todo
export const add = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const todoId = await ctx.db.insert("todos", {
      text: args.text,
      completed: false,
    });
    return todoId;
  },
});

// Mutation to toggle completion
export const toggle = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (todo) {
      await ctx.db.patch(args.id, { completed: !todo.completed });
    }
  },
});

// Mutation to delete a todo
export const remove = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});


export const edit = mutation({
    args: { id: v.id("todos"), text: v.string() },
    handler: async (ctx, args) => {
      const todo = await ctx.db.get(args.id);
      if (!todo) throw new Error("Todo not found");
      await ctx.db.patch(args.id, { text: args.text });
    },
  });