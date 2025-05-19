
// Priority Queue implementation
export class PriorityQueue<T> {
  private items: Array<{ element: T; priority: number }>;

  constructor() {
    this.items = [];
  }

  enqueue(element: T, priority: number): void {
    const item = { element, priority };
    let added = false;

    for (let i = 0; i < this.items.length; i++) {
      if (item.priority < this.items[i].priority) {
        this.items.splice(i, 0, item);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(item);
    }
  }

  dequeue(): { element: T; priority: number } | undefined {
    if (this.isEmpty()) return undefined;
    return this.items.shift();
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}
