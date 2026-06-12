"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import {
  getTasks,
  createTask,
  approveManager,
  assignTask,
  completeTask,
  updateTask,
  rejectTask,
} from "@/features/tasks/task.service";

import { UserLite, Project, Task } from "@/types/database";
import { UpdateTaskDTO } from "@/types/task";

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

export function ProjectTasks({
  membersList,
  project,
}: Props) {
  const { accessToken, user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    startDate: "",
    deadline: "",
    assignedToId: "",
  });

  const [editForm, setEditForm] =
    useState<UpdateTaskDTO>({
      title: "",
      description: "",
      priority: "MEDIUM",
      startDate: "",
      deadline: "",
      assignedToId: "",
    });

  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    async function loadTasks() {
      try {
        const data = await getTasks(
          accessToken as string
        );

        setTasks(
          data.filter(
            (t: Task) => t.projectId === project.id
          )
        )
      } catch (error) {
        console.error(error);
      }
    }

    loadTasks();
  }, [accessToken, project.id]);

  async function refreshTasks() {
    if (!accessToken) return;

    const updated = await getTasks(
      accessToken
    );

    setTasks(
      updated.filter(
        (task: Task) =>
          task.projectId === project.id
      )
    );
  }

  async function handleCreate() {
    if (!accessToken || !form.title.trim())
      return;

    try {
      setLoading(true);

      await createTask(
        {
          title: form.title,
          description:
            form.description || undefined,

          priority: form.priority as
            | "LOW"
            | "MEDIUM"
            | "HIGH"
            | "URGENT",

          startDate: form.startDate
            ? new Date(
                form.startDate
              ).toISOString()
            : undefined,

          deadline: form.deadline
            ? new Date(
                form.deadline
              ).toISOString()
            : undefined,

          assignedToId:
            form.assignedToId || undefined,

          projectId: project.id,
        },
        accessToken
      );

      await refreshTasks();

      setForm({
        title: "",
        description: "",
        priority: "MEDIUM",
        startDate: "",
        deadline: "",
        assignedToId: "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function reloadTasks() {
    if (!accessToken) return

    const data = await getTasks(accessToken)

    setTasks(
      data.filter(
        (task: Task) =>
          task.projectId === project.id
      )
    )
  }

  async function handleUpdate(
    taskId: string
  ) {
    if (!accessToken) return;

    try {
      await updateTask(
        taskId,
        {
          ...editForm,

          startDate: editForm.startDate
            ? new Date(
                editForm.startDate
              ).toISOString()
            : undefined,

          deadline: editForm.deadline
            ? new Date(
                editForm.deadline
              ).toISOString()
            : undefined,

          assignedToId:
            editForm.assignedToId ||
            undefined,
        },
        accessToken
      );

      await refreshTasks();

      setEditingId(null);

      setEditForm({
        title: "",
        description: "",
        priority: "MEDIUM",
        startDate: "",
        deadline: "",
        assignedToId: "",
      });
    } catch (error) {
      console.error(error);
    }
  }

  const completed = tasks.filter(
    (task) =>
      task.status === "COMPLETED"
  ).length;

  const progress = tasks.length
    ? Math.round(
        (completed / tasks.length) * 100
      )
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

          {(user?.role === "ADMIN" ||
            user?.role === "MANAGER") && (
            <select
              className="border h-10 px-2 w-full"
              value={form.assignedToId}
              onChange={(e) =>
                setForm({
                  ...form,
                  assignedToId: e.target.value,
                })
              }
            >
              <option value="">
                Assigner un exécutant
              </option>

              {membersList
                .filter(
                  (member) =>
                    member.role === "EXECUTANT"
                )
                .map((member) => (
                  <option
                    key={member.id}
                    value={member.id}
                  >
                    {member.name}
                  </option>
                ))}
            </select>
          )}

          <input
            type="datetime-local"
            className="border h-10 px-2 w-full"
            value={editForm.startDate || ""}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                startDate: e.target.value,
              })
            }
          />

          <input
            type="datetime-local"
            className="border h-10 px-2 w-full"
            value={editForm.deadline || ""}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                deadline: e.target.value,
              })
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
<div className="grid gap-4">
  {tasks.map((task) => (
    <div
      key={task.id}
      className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {editingId === task.id &&
          ["ADMIN", "MANAGER"].includes(user?.role ?? "") ? (
            <div className="space-y-3">
              <input
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    title: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 h-10"
                placeholder="Titre"
              />

              <textarea
                value={editForm.description || ""}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    description: e.target.value,
                  })
                }
                className="w-full border rounded-lg p-3 min-h-[80px]"
                placeholder="Description"
              />

              <div className="grid md:grid-cols-3 gap-3">
                <select
                  value={editForm.priority}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      priority: e.target.value as
                        | "LOW"
                        | "MEDIUM"
                        | "HIGH"
                        | "URGENT",
                    })
                  }
                  className="border rounded-lg px-3 h-10"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>

                <input
                  type="datetime-local"
                  value={editForm.startDate || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      startDate: e.target.value,
                    })
                  }
                  className="border rounded-lg px-3 h-10"
                />

                <input
                  type="datetime-local"
                  value={editForm.deadline || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      deadline: e.target.value,
                    })
                  }
                  className="border rounded-lg px-3 h-10"
                />
              </div>
            </div>
          ) : (
            <>
              <h3
                onClick={() => {
                  setEditingId(task.id)

                  setEditForm({
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    startDate: task.startDate,
                    deadline: task.deadline,
                    assignedToId: task.assignedToId,
                  })
                }}
                className="font-semibold text-lg cursor-pointer hover:text-blue-600"
              >
                {task.title}
              </h3>

              {task.description && (
                <p className="text-sm text-slate-500 mt-1">
                  {task.description}
                </p>
              )}
            </>
          )}
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
            task.status
          )}`}
        >
          {task.status}
        </span>
      </div>

      {/* INFOS */}
      <div className="grid md:grid-cols-4 gap-3 mt-5 text-sm">
        <div>
          <p className="text-slate-400">Priorité</p>
          <p className="font-medium">{task.priority}</p>
        </div>

        <div>
          <p className="text-slate-400">Assigné à</p>
          <p className="font-medium">
            {membersList.find(
              (member) =>
                member.id === task.assignedToId
            )?.name || "Non assigné"}
          </p>
        </div>

        <div>
          <p className="text-slate-400">Début</p>
          <p className="font-medium">
            {task.startDate
              ? new Date(task.startDate).toLocaleDateString()
              : "-"}
          </p>
        </div>

        <div>
          <p className="text-slate-400">Échéance</p>
          <p className="font-medium">
            {task.deadline
              ? new Date(task.deadline).toLocaleDateString()
              : "-"}
          </p>
        </div>
      </div>

      {/* ASSIGNATION */}
      {(user?.role === "ADMIN" ||
        user?.role === "MANAGER") && (
        <div className="mt-5">
          <select
            onChange={async (e) => {
              if (!accessToken) return

              if (!e.target.value) return

              await assignTask(
                task.id,
                e.target.value,
                accessToken
              )

              await reloadTasks()
            }}
            className="border rounded-lg h-10 px-3"
          >
            <option value="">
              Assigner un utilisateur
            </option>

            {membersList.map((m) => (
              <option
                key={m.id}
                value={m.id}
              >
                {m.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t">
        {editingId === task.id &&
          ["ADMIN", "MANAGER"].includes(
            user?.role ?? ""
          ) && (
            <>
              <button
                onClick={() => {
                  setEditingId(null)

                  setEditForm({
                    title: "",
                    description: "",
                    priority: "MEDIUM",
                    startDate: "",
                    deadline: "",
                    assignedToId: "",
                  })
                }}
                className="px-4 h-9 rounded-lg border"
              >
                Annuler
              </button>

              <button
                onClick={() =>
                  handleUpdate(task.id)
                }
                className="px-4 h-9 rounded-lg bg-black text-white"
              >
                Enregistrer
              </button>
            </>
          )}

        {(user?.role === "EXECUTANT" ||
          user?.role === "PRESTATAIRE") &&
          task.assignedToId === user?.id &&
          task.status !== "COMPLETED" &&
          task.status !==
            "VALIDATION_REQUESTED" && (
            <button
              onClick={async () => {
                if (!accessToken) return

                await completeTask(
                  task.id,
                  accessToken
                )

                await reloadTasks()
              }}
              className="px-4 h-9 rounded-lg bg-green-600 text-white"
            >
              Terminer
            </button>
          )}

        {(user?.role === "ADMIN" ||
          user?.role === "MANAGER") &&
          task.status ===
            "VALIDATION_REQUESTED" && (
            <>
              <button
                onClick={async () => {
                  await rejectTask(
                    task.id,
                    accessToken!
                  )

                  await reloadTasks()
                }}
                className="px-4 h-9 rounded-lg bg-red-600 text-white"
              >
                Rejeter
              </button>

              <button
                onClick={async () => {
                  await approveManager(
                    task.id,
                    accessToken!
                  )

                  await reloadTasks()
                }}
                className="px-4 h-9 rounded-lg bg-blue-600 text-white"
              >
                Finaliser
              </button>
            </>
          )}
      </div>
    </div>
  ))}
</div>

      {/* 🔥 LIST */}
      {/* <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="border rounded p-3 flex justify-between items-center"
          >
            <div className="flex justify-between items-center">
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
                      value={editForm.startDate || ""}
                      onChange={(e) =>
                        setForm({ ...form, startDate: e.target.value })
                      }
                    />

                    <input
                      type="datetime-local"
                      className="border h-10 px-2 w-full"
                      value={editForm.deadline || ""}
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
                      setEditForm({
                        title: task.title,
                        description: task.description,
                        priority: task.priority,
                        startDate: task.startDate,
                        deadline: task.deadline,
                        assignedToId: task.assignedToId,
                      })
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

            <p className="text-sm text-gray-500">
              Assigné à :{" "}
              {membersList.find(
                (member) => member.id === task.assignedToId
              )?.name || "Personne"}
            </p>

            {(user?.role === "ADMIN" ||
              user?.role === "MANAGER") && (
              <div className="flex gap-2">
                <select
                  onChange={async(e) => {
                    if (!accessToken) return;

                    const userId = e.target.value

                    if (!userId) return

                    await assignTask(
                      task.id,
                      userId,
                      accessToken
                    )

                    await reloadTasks()
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

            <div className="flex gap-2">
              {editingId === task.id && ["ADMIN", "MANAGER"].includes(user?.role ?? "") && (
                <>
                <button
  onClick={() => {
    setEditingId(null)

    setEditForm({
      title: "",
      description: "",
      priority: "MEDIUM",
      startDate: "",
      deadline: "",
      assignedToId: "",
    })
  }}
  className="text-xs border px-2"
>
  Cancel
</button>
                <button
                  onClick={() => handleUpdate(task.id)}
                  className="text-xs border px-2"
                >
                  Save
                </button>
                </>
              )}
                
              {(user?.role === "EXECUTANT" || user?.role === "PRESTATAIRE") &&
                task.assignedToId === user?.id &&
                task.status !== "COMPLETED" && task.status !== "VALIDATION_REQUESTED" && (
                  <button
                    onClick={async() => {
                      if (!accessToken) return;

                      await completeTask(task.id, accessToken!)
                      await reloadTasks()
                    }}
                    className="text-xs border px-2 cursor-pointer"
                  >
                    Terminer
                  </button>
                )}

              {(user?.role === "MANAGER" || user?.role === "ADMIN") &&
                task.status === "VALIDATION_REQUESTED" && (
                  <>
                    <button
                      onClick={async () => {
                        await rejectTask(task.id, accessToken!)
                        await reloadTasks()
                      }}
                      className="text-xs border px-2 cursor-pointer"
                    >
                      Rejeter
                    </button>
                    <button
                      onClick={async() => {
                        await approveManager(task.id, accessToken!)
                        await reloadTasks()
                      }}
                      className="text-xs border px-2 cursor-pointer"
                    >
                      Finaliser
                    </button>
                  </>
              )}
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}
