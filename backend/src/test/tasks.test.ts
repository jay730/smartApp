import { tasks } from "../data/tasks";
import { TaskStatus } from "../types/task";

describe("tasks", () => {
  it("should be an array", () => {
    expect(tasks).toBeInstanceOf(Array);
  });

  it("should have 3 items", () => {
    expect(tasks).toHaveLength(3);
  });

  it("first task should be Pending", () => {
    expect(tasks[0]?.status).toBe(TaskStatus.Pending);
  });
});