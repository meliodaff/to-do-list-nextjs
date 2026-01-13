"use client";
import { useState } from "react";
import Checkbox from "./ui/Checkbox";

interface Task {
  id: number;
  title: string;
  isComplete: boolean;
  isEditing?: boolean;
}

const TaskList = ({ initialTasks }: { initialTasks: Task[] }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleCompleteTask = async (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, isComplete: !task.isComplete } : task
      )
    );

    const taskToBeUpdate = tasks.find((task) => task.id === id);
    const taskStatus = !taskToBeUpdate?.isComplete;

    try {
      const response = await fetch("/api/tasks", {
        method: "PATCH",
        body: JSON.stringify({
          taskId: id,
          // isComplete: !tasks.find((t) => t.id === id)?.isComplete,
          isComplete: taskStatus,
        }),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to update task");
        // Revert optimistic update on error
        setTasks(initialTasks);
      }
    } catch (error) {
      console.log(error);
      throw new Error("Failed to update task");
    }
  };

  const handleEditTask = async (id: number, title: string) => {
    setTasks(() =>
      tasks.map((task) => (task.id === id ? { ...task, title } : task))
    );

    try {
      const response = await fetch(`/api/tasks/${id}/title`, {
        method: "PATCH",
        body: JSON.stringify({
          // isComplete: !tasks.find((t) => t.id === id)?.isComplete,
          title,
        }),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to update task");
        // Revert optimistic update on error
        setTasks(initialTasks);
      }
    } catch (error) {
      console.log(error);
      throw new Error("Failed to update task");
    }
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Mark as done</th>
          <th>No.</th>
          <th>Title</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task: Task, index: number) => {
          console.log(task);
          return (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  className="checkbox checkbox-success"
                  defaultChecked={task.isComplete}
                  onChange={() => handleCompleteTask(task.id)}
                />
              </td>
              <td>{index + 1}. </td>
              {editingTaskId === task.id ? (
                <td>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border-2 px-2 py-1"
                    onBlur={() => {
                      // Save changes when input loses focus
                      // handleUpdateTask(task.id, editValue);
                      setEditingTaskId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleEditTask(task.id, editValue);
                        setEditingTaskId(null);
                      }
                      if (e.key === "Escape") {
                        setEditingTaskId(null);
                      }
                    }}
                    autoFocus
                  />
                </td>
              ) : (
                <td
                  className={task.isComplete ? "line-through" : ""}
                  onDoubleClick={() => {
                    if (!task.isComplete) {
                      setEditingTaskId(task.id);
                      setEditValue(task.title);
                    }
                  }}
                >
                  {task.title}
                </td>
              )}
              <td
                className={task.isComplete ? " text-green-700" : "text-red-700"}
              >
                {task.isComplete ? "Completed" : "Incomplete"}
              </td>
              <td>
                <button
                  disabled={task.isComplete}
                  onClick={() => {
                    setEditingTaskId(task.id);
                    setEditValue(task.title);
                  }}
                  className="btn btn-sm"
                >
                  Edit
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TaskList;
