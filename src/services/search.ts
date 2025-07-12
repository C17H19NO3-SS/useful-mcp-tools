import { promises as fs } from "fs";

export async function searchTasks({
  query,
  projectId,
  status,
  assignee,
  labelId,
}: {
  query?: string;
  projectId?: string;
  status?: string;
  assignee?: string;
  labelId?: string;
}): Promise<any[]> {
  const tasks = JSON.parse(await fs.readFile("data/tasks.json", "utf-8"));
  let filtered = tasks;
  if (projectId)
    filtered = filtered.filter((t: any) => t.projectId === projectId);
  if (status) filtered = filtered.filter((t: any) => t.status === status);
  if (assignee) filtered = filtered.filter((t: any) => t.assignee === assignee);
  if (labelId) {
    const rels = JSON.parse(
      await fs.readFile("data/task_labels.json", "utf-8")
    );
    const taskIds = rels
      .filter((r: any) => r.labelId === labelId)
      .map((r: any) => r.taskId);
    filtered = filtered.filter((t: any) => taskIds.includes(t.id));
  }
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (t: any) =>
        (t.title && t.title.toLowerCase().includes(q)) ||
        (t.description && t.description.toLowerCase().includes(q))
    );
  }
  return filtered;
}

export async function searchProjects({
  query,
}: {
  query?: string;
}): Promise<any[]> {
  const projects = JSON.parse(await fs.readFile("data/projects.json", "utf-8"));
  if (!query) return projects;
  const q = query.toLowerCase();
  return projects.filter(
    (p: any) =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
  );
}
