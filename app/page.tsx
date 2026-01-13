export const dynamic = "force-dynamic";

import TaskList from "./components/TaskList";
import { supabase } from "@/lib/db";
interface Task {
  id: number;
  title: string;
  isComplete: boolean;
}
export default async function Home() {
  const { data, error } = await supabase.from("tasks").select("*");
  //dsadasdas
  if (error) {
    alert("error fetching data" + error.message);
    return;
  }

  const initialTasks: Task[] =
    data?.map((task, index) => ({
      id: task.id,
      title: task.title,
      isComplete: task.isComplete,
    })) || [];

  return (
    <div>
      <h1>To do list</h1>
      <TaskList initialTasks={initialTasks} />
    </div>
  );
}
