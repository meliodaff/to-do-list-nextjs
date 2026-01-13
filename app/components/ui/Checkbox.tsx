import React from "react";
interface Task {
  id: number;
  title: string;
  isComplete: boolean;
}
const Checkbox = ({ id, task }: { id: number; task: Task }) => {
  return <input type="checkbox" className="checkbox checkbox-success" />;
};

export default Checkbox;
