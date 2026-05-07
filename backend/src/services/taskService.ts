import { tasks as initialTasks } from "../data/tasks";
import { Task } from "../types/task";
import { BaseService } from "./baseService";

export class TaskService extends BaseService<Task> {
  constructor() {
       super();
       this.items = [...initialTasks];
     }

  updateTask = (
    id: number,
    updateData: Partial<Omit<Task, "id">>,
  ): Task | undefined => {
    for (const taskMember of this.items) {
      if (taskMember.id === id) {
        Object.assign(taskMember, updateData);
        return taskMember;
      }
    }
    return undefined;
  };

}

const service = new TaskService();

console.log(
  1,
  service.create({
    id: 1,
    name: "x",
    residentId: 1,
    description: "Ambulation",
  }),
);
console.log(2, service.getAll());
console.log(3, service.getById(1))
console.log(4, service.updateTask(1, { description: "Jane" }));
console.log(5, service.delete(3));
console.log(
  6,
  service.create({ id: 4, name: "y", description: "Ambulation" }),
);
console.log(7, service.delete(99));
console.log(6, service.create({ id: 3, name: "z", description: "Ad hoc" }));
console.log(9, service.getAll());
