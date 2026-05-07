import { BaseEntity } from "../types/base";
export class BaseService<T extends BaseEntity> {
  protected items: T[] = [];
  getAll = (): T[] => {
    return this.items;
  };

  getById = (id: number): T | undefined => {
    for (const item of this.items) {
      if (item.id === id) {
        return item;
      }
    }
    return undefined;
  };

  delete = (id: number): boolean => {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i]?.id === id) {
        this.items.splice(i, 1);
        return true;
      }
    }
    return false;
  };

  create = (newItem: T): T | string => {
    for (const item of this.items) {
      if (item.id === newItem.id) {
        return "Item with the same ID already exists";
      }
    }
    this.items.push(newItem);
    return newItem;
  };
}
