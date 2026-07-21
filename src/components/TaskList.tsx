import { createSignal, For } from "solid-js"
import { useTasks } from "../stores/taskStore"

export default function TaskList() {
  const { tasks, addTask, toggleTask, removeTask } = useTasks()
  const [title, setTitle] = createSignal("")

  const submit = () => {
    if (!title()) return
    addTask(title())
    setTitle("")
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter") submit()
  }

  return (
    <div class="section">
      <div class="section-title">Tasks</div>

      <div class="task-input-row">
        {/* @ts-ignore */}
        <jelly-input placeholder="Add a task..." value={title()} onInput={(e: InputEvent) => setTitle((e.target as HTMLInputElement).value)} onKeyDown={handleKeydown} />{/* @ts-ignore */}
        <jelly-button onClick={submit}>+</jelly-button>
      </div>

      <div class="task-list">
        <For each={tasks()}>
          {(task) => (
            <div class={`task-item ${task.completed ? "completed" : ""}`}>
              {/* @ts-ignore */}
              <jelly-checkbox checked={task.completed ? "" : undefined} onChange={() => toggleTask(task.id)} />
              <span class="task-title">{task.title}</span>
              {/* @ts-ignore */}
              <jelly-icon-button onClick={() => removeTask(task.id)}>✕</jelly-icon-button>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}
