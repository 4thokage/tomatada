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

  return (

    <div class="panel">

      <div class="title-section">
        Tasks
      </div>

      <div class="task-input-row">

        <input
          placeholder="Add task..."
          value={title()}
          onInput={e => setTitle(e.currentTarget.value)}
        />

        <button
          class="btn-add-task"
          onClick={submit}
        >
          +
        </button>

      </div>

      <div class="task-list">

        <For each={tasks()}>
          {(task) => (

            <div
              class={`task-item ${task.completed ? "completed" : ""}`}
            >

              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />

              <span class="task-title">
                {task.title}
              </span>

              <button
                class="task-delete"
                onClick={() => removeTask(task.id)}
              >
                ✕
              </button>

            </div>

          )}
        </For>

      </div>

    </div>
  )
}
