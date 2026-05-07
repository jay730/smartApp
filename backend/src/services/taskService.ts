import { tasks as initialTasks } from "../data/tasks";
import { Task } from "../types/task";

export class TaskService {
  private tasks: Task[] = [...initialTasks];

  getAllTask = (): Task[] => {
    return this.tasks;
  };

  getTaskById = (id: number): Task | undefined => {
    for (const taskMember of this.tasks) {
      if (taskMember.id === id) {
        return taskMember;
      }
    }
    return undefined;
  };

  createTask = (newTask: Task): Task | string => {
    for (const taskMember of this.tasks) {
      if (taskMember.id === newTask.id) {
        return "Task with the same ID already exists";
      }
    }
    this.tasks.push(newTask);
    return newTask;
  };

  updateTask = (
    id: number,
    updateData: Partial<Omit<Task, "id">>,
  ): Task | undefined => {
    for (const taskMember of this.tasks) {
      if (taskMember.id === id) {
        Object.assign(taskMember, updateData);
        return taskMember;
      }
    }
    return undefined;
  };

  deleteTask = (id: number): boolean => {
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i]?.id === id) {
        this.tasks.splice(i, 1);
        return true;
      }
    }
    return false;
  };
}

const service = new TaskService();

console.log(
  1,
  service.createTask({
    id: 1,
    name: "x",
    residentId: 1,
    description: "Ambulation",
  }),
);
console.log(2, service.getAllTask());
console.log(3, service.getTaskById(1));
console.log(4, service.updateTask(1, { description: "Jane" }));
console.log(5, service.deleteTask(3));
console.log(
  6,
  service.createTask({ id: 4, name: "y", description: "Ambulation" }),
);
console.log(7, service.deleteTask(99));
console.log(6, service.createTask({ id: 3, name: "z", description: "Ad hoc" }));
console.log(9, service.getAllTask());
