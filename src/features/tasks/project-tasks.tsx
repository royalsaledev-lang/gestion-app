"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import {
  getTasks,
  createTask,
  submitTask,
  approveManager,
  approvePrestataire,
  assignTask,
  updateTask,
} from "@/features/tasks/task.service";
import { UserLite, Project } from "@/types/database";
import { Task, UpdateTaskDTO } from "@/types/task";
import { log } from "console";


interface Props {
  membersList: UserLite[];
  project: Project;
}

function getStatusColor(status: string) {
  switch (status) {
    case "DRAFT":
      return "bg-gray-300";
    case "IN_PROGRESS":
      return "bg-blue-400";
    case "VALIDATION_REQUESTED":
      return "bg-yellow-400";
    case "APPROVED":
      return "bg-purple-400";
    case "COMPLETED":
      return "bg-green-500";
    default:
      return "bg-gray-200";
  }
}

export function ProjectTasks({ membersList, project }: Props) {
  const { accessToken, user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    startDate: "",
    deadline: "",
    assignedToId: "",
  })
  const [editForm, setEditForm] = useState<UpdateTaskDTO>({
    title: "",
    description: "",
    priority: "MEDIUM",
    startDate: "",
    deadline: "",
    assignedToId: "",
  })
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")

  // 🔹 load tasks
  useEffect(() => {
    if (!membersList && !accessToken) return;

    getTasks(accessToken as string).then((data) => {
      const filtered = data.filter((t: Task) => t.projectId === project.id);
      setTasks(filtered);
    });
  }, [accessToken, project.id]);  

  // 🔹 create task
  // async function handleCreate() {
  //   if (!accessToken || !title) return;

  //   setLoading(true);

  //   await createTask(
  //     {
  //       title,
  //       projectId: project.id,
  //       priority: "MEDIUM",
  //     },
  //     accessToken,
  //   );

  //   const updated = await getTasks(accessToken);
  //   setTasks(updated.filter((t: Task) => t.projectId === project.id));

  //   setTitle("");
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 2000);
  // }

  async function handleCreate() {
    if (!accessToken || !form.title) return

    setLoading(true)

    const res = await createTask(
      {
        title: form.title,
        description: form.description,
        priority: form.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
        startDate: form.startDate
          ? new Date(form.startDate).toISOString()
          : undefined,
        deadline: form.deadline
          ? new Date(form.deadline).toISOString()
          : undefined,
        assignedToId: form.assignedToId || undefined,
        projectId: project.id,
      },
      accessToken
    )

    console.log(res)

    const updated = await getTasks(accessToken)
    setTasks(updated.filter((t: Task) => t.projectId === project.id))

    setForm({
      title: "",
      description: "",
      priority: "MEDIUM",
      startDate: "",
      deadline: "",
      assignedToId: "",
    })

    setTimeout(() => {
      setLoading(false)
    }, 2000);
  }

  console.log(tasks);
  
  

  // async function handleUpdate(taskId: string) {
  //   if (!accessToken) return

  //   await updateTask(
  //     taskId,
  //     {
  //       title: editTitle,
  //     },
  //     accessToken
  //   )

  //   const updated = await getTasks(accessToken)
  //   setTasks(updated.filter((t: Task) => t.projectId === project.id))

  //   setEditingId(null)
  //   setEditTitle("")
  // }

  // 🔹 progression
  async function handleUpdate(taskId: string) {
    if (!accessToken) return

    await updateTask(taskId, {
      ...editForm,
      startDate: form.startDate
        ? new Date(form.startDate).toISOString()
        : undefined,
      deadline: form.deadline
        ? new Date(form.deadline).toISOString()
        : undefined,
      assignedToId: form.assignedToId || undefined,
    }, accessToken)

    const updated = await getTasks(accessToken)
    setTasks(updated.filter((t: Task) => t.projectId === project.id))

    setEditingId(null)
    setEditForm({
      title: "",
      description: "",
      priority: "MEDIUM",
      startDate: "",
      deadline: "",
      assignedToId: "",
    })
  }
  
  
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* 🔥 CREATE */}
      {(user?.role === "ADMIN" ||
        user?.role === "MANAGER" ||
        user?.role === "PRESTATAIRE") && (
        <div className="space-y-2">
          <input
            placeholder="Titre"
            className="border h-10 px-2 w-full"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            placeholder="Description"
            className="border h-10 px-2 w-full"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <select
            className="border h-10 px-2 w-full"
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value as "LOW" | "MEDIUM" | "HIGH" | "URGENT"})
            }
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>

          <select
            className="border h-10 px-2 w-full"
            value={form.assignedToId}
            onChange={(e) =>
              setForm({ ...form, assignedToId: e.target.value })
            }
          >
            <option value="">Assigner</option>
            {membersList.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            className="border h-10 px-2 w-full"
            value={form.startDate}
            onChange={(e) =>
              setForm({ ...form, startDate: e.target.value })
            }
          />

          <input
            type="datetime-local"
            className="border h-10 px-2 w-full"
            value={form.deadline}
            onChange={(e) =>
              setForm({ ...form, deadline: e.target.value })
            }
          />

          <button
            disabled={loading}
            onClick={handleCreate}
            className="bg-black text-white px-4 h-10 cursor-pointer"
          >
            {loading ? "En cour..." : "Ajouter"}
          </button>
        </div>
      )}

      <div>
        <p className="text-sm mb-1">Progression</p>
        <div className="w-full bg-gray-200 h-3 rounded">
          <div
            className="bg-black h-3 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs mt-1">{progress}%</p>
      </div>

      {/* 🔥 LIST */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="border rounded p-3 flex justify-between items-center"
          >
            <div className="flex justify-between items-center">
              {/* {editingId === task.id && ["ADMIN", "MANAGER", "PRESTATAIRE"].includes(user?.role ?? "") ? (
                  <input
                    className="border px-2 h-8"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                ) : (
                  <p
                    className="font-medium cursor-pointer"
                    onClick={() => {
                      setEditingId(task.id)
                      setEditForm(task)
                    }}
                  >
                    {task.title}
                  </p>
                )} */}

                {editingId === task.id && ["ADMIN", "MANAGER", "PRESTATAIRE"].includes(user?.role ?? "") ? (
                  <div className="space-y-1">
                    <input
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="border px-2 h-8"
                    />

                    <input
                      value={editForm.description || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                      className="border px-2 h-8"
                    />

                    <select
                      value={editForm.priority}
                      onChange={(e) =>
                        setEditForm({ ...editForm, priority: e.target.value as "LOW" | "MEDIUM" | "HIGH" | "URGENT"})
                      }
                      className="border px-2 h-8"
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="URGENT">URGENT</option>
                    </select>

                    <select
                      className="border h-10 px-2 w-full"
                      value={form.assignedToId}
                      onChange={(e) =>
                        setForm({ ...form, assignedToId: e.target.value })
                      }
                    >
                      <option value="">Assigner</option>
                      {membersList.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="datetime-local"
                      className="border h-10 px-2 w-full"
                      value={form.startDate}
                      onChange={(e) =>
                        setForm({ ...form, startDate: e.target.value })
                      }
                    />

                    <input
                      type="datetime-local"
                      className="border h-10 px-2 w-full"
                      value={form.deadline}
                      onChange={(e) =>
                        setForm({ ...form, deadline: e.target.value })
                      }
                    />
                  </div>
                ) : (
                  <p 
                    className="font-medium cursor-pointer"
                    onClick={() => {
                      setEditingId(task.id)
                      setEditForm(task)
                    }}
                  >
                    {task.title}
                  </p>
                )}

              &nbsp;&nbsp;

              <span
                className={`text-xs px-2 py-1 rounded text-white ${getStatusColor(task.status)}`}
              >
                {task.status}
              </span>
            </div>

            {/* Assigned */}
            <p className="text-sm text-gray-500">
              Assigné à : {task.assignedTo?.name || "Personne"}
            </p>

            {/* Assign dropdown */}
            {(user?.role === "ADMIN" ||
              user?.role === "MANAGER" ||
              user?.role === "PRESTATAIRE") && (
              <div className="flex gap-2">
                <select
                  onChange={(e) => {
                    if (!membersList && !accessToken) return;

                    assignTask(task.id, e.target.value, accessToken!)
                    getTasks(accessToken as string).then((data) => {
                      const filtered = data.filter((t: Task) => t.projectId === project.id);
                      setTasks(filtered);
                    });
                  }}
                  className="border rounded px-2"
                >
                  <option value="">Assigner</option>

                  {Array.isArray(membersList) &&
                    membersList.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* 🔥 ACTIONS */}
            <div className="flex gap-2">
              {editingId === task.id && ["ADMIN", "MANAGER", "PRESTATAIRE"].includes(user?.role ?? "") && (
                <button
                  onClick={() => handleUpdate(task.id)}
                  className="text-xs border px-2"
                >
                  Save
                </button>
              )}
              {/* ✅ SUBMIT (EXECUTANT / PRESTATAIRE assigné seulement + bon status) */}
              {(user?.role === "EXECUTANT" || user?.role === "PRESTATAIRE") &&
                task.assignedToId === user?.id &&
                task.status !== "COMPLETED" && (
                  <button
                    onClick={() => {
                      if (!membersList && !accessToken) return;

                      submitTask(task.id, accessToken!)
                      getTasks(accessToken as string).then((data) => {
                        const filtered = data.filter((t: Task) => t.projectId === project.id);
                        setTasks(filtered);
                      });
                    }}
                    className="text-xs border px-2 cursor-pointer"
                  >
                    Submit
                  </button>
                )}

              {/* ✅ PRESTATAIRE VALIDATION */}
              {user?.role === "PRESTATAIRE" &&
                task.status === "VALIDATION_REQUESTED" && (
                  <button
                    onClick={() => {
                      if (!membersList && !accessToken) return;

                      approvePrestataire(task.id, accessToken!)
                      getTasks(accessToken as string).then((data) => {
                        const filtered = data.filter((t: Task) => t.projectId === project.id);
                        setTasks(filtered);
                      });
                    }}
                    className="text-xs border px-2 cursor-pointer"
                  >
                    Valider
                  </button>
                )}

              {/* ✅ MANAGER FINAL APPROVAL */}
              {(user?.role === "MANAGER" || user?.role === "ADMIN") &&
                (task.status === "APPROVED" ||
                  task.status === "VALIDATION_REQUESTED") && (
                  <button
                    onClick={() => {
                      if (!membersList && !accessToken) return;

                      approveManager(task.id, accessToken!)
                      getTasks(accessToken as string).then((data) => {
                        const filtered = data.filter((t: Task) => t.projectId === project.id);
                        setTasks(filtered);
                      });
                    }}
                    className="text-xs border px-2 cursor-pointer"
                  >
                    Finaliser
                  </button>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
