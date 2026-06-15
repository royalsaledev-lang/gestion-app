"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import {
  getTasks,
  createTask,
  createSubTask,
  approveManager,
  assignTask,
  completeTask,
  updateTask,
  rejectTask,
  addComment,
  getComments,
  deleteComment,
} from "@/features/tasks/task.service";

import { UserLite, Project, Task, Comment } from "@/types/database";
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

export function ProjectTasks({ membersList, project }: Props) {
  const { accessToken, user } = useAuth();

  const canManage = user?.role === "ADMIN" || user?.role === "MANAGER";

  const canCreateParentTask =
    user?.role === "ADMIN" || user?.role === "MANAGER";

  const canCreateSubTask =
    user?.role === "ADMIN" ||
    user?.role === "MANAGER" ||
    user?.role === "PRESTATAIRE";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedParentTaskId, setSelectedParentTaskId] = useState<
    string | null
  >(null);

  const [editingSubTaskId, setEditingSubTaskId] = useState<string | null>(null);

  const [subTaskEditForm, setSubTaskEditForm] = useState<UpdateTaskDTO>({
    title: "",
    description: "",
    priority: "MEDIUM",
    startDate: "",
    deadline: "",
    assignedToId: "",
  });

  const [subTaskForm, setSubTaskForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    assignedToId: "",
  });

  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});

  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {},
  );

  const [loadingComments, setLoadingComments] = useState<
    Record<string, boolean>
  >({});

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    startDate: "",
    deadline: "",
    assignedToId: "",
  });

  const [editForm, setEditForm] = useState<UpdateTaskDTO>({
    title: "",
    description: "",
    priority: "MEDIUM",
    startDate: "",
    deadline: "",
    assignedToId: "",
  });

  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    async function loadTasks() {
      try {
        const data = await getTasks(accessToken as string);

        setTasks(data.filter((t: Task) => t.projectId === project.id));
      } catch (error) {
        console.error(error);
      }
    }

    loadTasks();
  }, [accessToken, project.id]);

  async function refreshTasks() {
    if (!accessToken) return;

    const updated = await getTasks(accessToken);

    setTasks(updated.filter((task: Task) => task.projectId === project.id));
  }

  async function loadComments(taskId: string) {
    if (!accessToken) return;

    try {
      setLoadingComments((prev) => ({
        ...prev,
        [taskId]: true,
      }));

      const comments = await getComments(taskId, accessToken);

      setCommentsMap((prev) => ({
        ...prev,
        [taskId]: comments,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingComments((prev) => ({
        ...prev,
        [taskId]: false,
      }));
    }
  }

  async function handleAddComment(taskId: string) {
    if (!accessToken) return;

    const content = commentInputs[taskId]?.trim();

    if (!content) return;

    try {
      await addComment(taskId, content, accessToken);

      setCommentInputs((prev) => ({
        ...prev,
        [taskId]: "",
      }));

      await loadComments(taskId);

      await refreshTasks();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteComment(commentId: string, taskId: string) {
    if (!accessToken) return;

    try {
      await deleteComment(commentId, accessToken);

      await loadComments(taskId);

      await refreshTasks();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCreateSubTask() {
    if (!accessToken || !selectedParentTaskId || !subTaskForm.title.trim()) {
      return;
    }

    try {
      await createSubTask(
        selectedParentTaskId,
        {
          title: subTaskForm.title,

          description: subTaskForm.description || undefined,

          priority: subTaskForm.priority as
            | "LOW"
            | "MEDIUM"
            | "HIGH"
            | "URGENT",

          assignedToId: subTaskForm.assignedToId || undefined,

          projectId: project.id,
        },
        accessToken,
      );

      setSelectedParentTaskId(null);

      setSubTaskForm({
        title: "",
        description: "",
        priority: "MEDIUM",
        assignedToId: "",
      });

      await refreshTasks();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCreate() {
    if (!accessToken || !form.title.trim()) return;

    try {
      setLoading(true);

      await createTask(
        {
          title: form.title,
          description: form.description || undefined,

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
        accessToken,
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
    if (!accessToken) return;

    const data = await getTasks(accessToken);

    setTasks(data.filter((task: Task) => task.projectId === project.id));
  }

  async function handleUpdate(taskId: string) {
    if (!accessToken) return;

    try {
      await updateTask(
        taskId,
        {
          ...editForm,

          startDate: editForm.startDate
            ? new Date(editForm.startDate).toISOString()
            : undefined,

          deadline: editForm.deadline
            ? new Date(editForm.deadline).toISOString()
            : undefined,

          assignedToId: editForm.assignedToId || undefined,
        },
        accessToken,
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

  const allSubTasks = tasks.flatMap((task) => task.subTasks || []);

  const completedSubTasks = allSubTasks.filter(
    (subTask) =>
      subTask.status === "COMPLETED" || subTask.status === "APPROVED",
  ).length;

  const progress =
    allSubTasks.length > 0
      ? Math.round((completedSubTasks / allSubTasks.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* 🔥 CREATION TACHE PARENT */}
      {canCreateParentTask && (
        <div className="space-y-2 border rounded-xl p-4 bg-slate-50">
          <h3 className="font-semibold">Nouvelle tâche</h3>

          <input
            placeholder="Titre"
            className="border h-10 px-2 w-full"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
          />

<textarea
  placeholder="Description"
  className="border px-2 w-full"
  rows={4}
  value={form.description}
  onChange={(e) =>
    setForm({
      ...form,
      description: e.target.value,
    })
  }
/>

          <select
            className="border h-10 px-2 w-full"
            value={form.priority}
            onChange={(e) =>
              setForm({
                ...form,
                priority: e.target.value as
                  | "LOW"
                  | "MEDIUM"
                  | "HIGH"
                  | "URGENT",
              })
            }
          >
          <option value="LOW">Faible</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="HIGH">Élevée</option>
            <option value="URGENT">Urgente</option>
          </select>

          {/* <input
            type="datetime-local"
            className="border h-10 px-2 w-full"
            value={form.startDate}
            onChange={(e) =>
              setForm({
                ...form,
                startDate: e.target.value,
              })
            }
          />

          <input
            type="datetime-local"
            className="border h-10 px-2 w-full"
            value={form.deadline}
            onChange={(e) =>
              setForm({
                ...form,
                deadline: e.target.value,
              })
            }
          /> */}

          <button
            disabled={loading}
            onClick={handleCreate}
            className="bg-black text-white px-4 h-10 rounded-lg"
          >
            {loading ? "Création..." : "Créer la tâche"}
          </button>
        </div>
      )}

      {selectedParentTaskId && canCreateSubTask && (
        <div className="border rounded-xl p-4 bg-slate-50 space-y-3">
          <h3 className="font-semibold">Nouvelle sous-tâche</h3>

          <input
            placeholder="Titre"
            className="border h-10 px-2 w-full"
            value={subTaskForm.title}
            onChange={(e) =>
              setSubTaskForm({
                ...subTaskForm,
                title: e.target.value,
              })
            }
          />

          <textarea
            placeholder="Description"
            className="border p-2 w-full rounded"
            value={subTaskForm.description}
            onChange={(e) =>
              setSubTaskForm({
                ...subTaskForm,
                description: e.target.value,
              })
            }
          />

          <select
            className="border h-10 px-2 w-full"
            value={subTaskForm.priority}
            onChange={(e) =>
              setSubTaskForm({
                ...subTaskForm,
                priority: e.target.value as
                  | "LOW"
                  | "MEDIUM"
                  | "HIGH"
                  | "URGENT",
              })
            }
          >
            <option value="LOW">Faible</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="HIGH">Élevée</option>
            <option value="URGENT">Urgente</option>
          </select>

          {/* Assignation uniquement ADMIN/MANAGER */}
          {canManage && (
            <select
              className="border h-10 px-2 w-full"
              value={subTaskForm.assignedToId}
              onChange={(e) =>
                setSubTaskForm({
                  ...subTaskForm,
                  assignedToId: e.target.value,
                })
              }
            >
              <option value="">Assigner un utilisateur</option>

              {membersList
                .filter(
                  (member) =>
                    member.role === "EXECUTANT" ||
                    member.role === "PRESTATAIRE",
                )
                .map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
            </select>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleCreateSubTask}
              className="bg-blue-600 text-white px-4 h-10 rounded-lg"
            >
              Créer la sous-tâche
            </button>

            <button
              onClick={() => setSelectedParentTaskId(null)}
              className="border px-4 h-10 rounded-lg"
            >
              Annuler
            </button>
          </div>
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
        {tasks
          .filter((task) => !task.parentTaskId)
          .map((task) => (
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
                                      <option value="LOW">Faible</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="HIGH">Élevée</option>
            <option value="URGENT">Urgente</option>
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
                          setEditingId(task.id);

                          setEditForm({
                            title: task.title,
                            description: task.description,
                            priority: task.priority,
                            startDate: task.startDate,
                            deadline: task.deadline,
                            assignedToId: task.assignedToId,
                          });
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
                    task.status,
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
                      (member) => member.id === task.assignedToId,
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

              {task.subTasks && task.subTasks.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="font-semibold mb-4">Sous-tâches</h4>

                  <div className="space-y-3">
                    {task.subTasks.map((subTask) => (
                      <div
                        key={subTask.id}
                        className="border rounded-lg p-4 bg-slate-50"
                      >
<div className="flex justify-between items-start gap-3">
  <div className="flex-1">
    {editingSubTaskId === subTask.id ? (
      <div className="space-y-3">
        <input
          value={subTaskEditForm.title}
          onChange={(e) =>
            setSubTaskEditForm({
              ...subTaskEditForm,
              title: e.target.value,
            })
          }
          className="border h-10 px-3 w-full rounded"
        />

        <textarea
          value={subTaskEditForm.description || ""}
          onChange={(e) =>
            setSubTaskEditForm({
              ...subTaskEditForm,
              description: e.target.value,
            })
          }
          className="border p-3 w-full rounded"
        />

        <div className="grid md:grid-cols-3 gap-3">
          <select
            value={subTaskEditForm.priority}
            onChange={(e) =>
              setSubTaskEditForm({
                ...subTaskEditForm,
                priority: e.target.value as
                  | "LOW"
                  | "MEDIUM"
                  | "HIGH"
                  | "URGENT",
              })
            }
            className="border rounded-lg px-3 h-10"
          >
            <option value="LOW">Faible</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="HIGH">Élevée</option>
            <option value="URGENT">Urgente</option>
          </select>

          <input
            type="datetime-local"
            value={subTaskEditForm.startDate || ""}
            onChange={(e) =>
              setSubTaskEditForm({
                ...subTaskEditForm,
                startDate: e.target.value,
              })
            }
            className="border rounded-lg px-3 h-10"
          />

          <input
            type="datetime-local"
            value={subTaskEditForm.deadline || ""}
            onChange={(e) =>
              setSubTaskEditForm({
                ...subTaskEditForm,
                deadline: e.target.value,
              })
            }
            className="border rounded-lg px-3 h-10"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingSubTaskId(null);

              setSubTaskEditForm({
                title: "",
                description: "",
                priority: "MEDIUM",
                startDate: "",
                deadline: "",
                assignedToId: "",
              });
            }}
            className="border px-4 h-9 rounded-lg"
          >
            Annuler
          </button>

          <button
            onClick={async () => {
              if (!accessToken) return;

              await updateTask(
                subTask.id,
                {
                  ...subTaskEditForm,
                  startDate: subTaskEditForm.startDate
                    ? new Date(
                        subTaskEditForm.startDate
                      ).toISOString()
                    : undefined,
                  deadline: subTaskEditForm.deadline
                    ? new Date(
                        subTaskEditForm.deadline
                      ).toISOString()
                    : undefined,
                },
                accessToken
              );

              setEditingSubTaskId(null);

              await reloadTasks();
            }}
            className="bg-black text-white px-4 h-9 rounded-lg"
          >
            Enregistrer
          </button>
        </div>
      </div>
    ) : (
      <h5 className="font-medium">
        {subTask.title}
      </h5>
    )}
  </div>

  <span
    className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(
      subTask.status,
    )}`}
  >
    {subTask.status}
  </span>
</div>

                        {subTask.description && (
                          <p className="text-sm text-slate-500 mt-2">
                            {subTask.description}
                          </p>
                        )}

                        <div className="grid md:grid-cols-3 gap-3 mt-3 text-sm">
                          <div>
                            <p className="text-slate-400">Assigné à</p>
                            <p>{subTask.assignedTo?.name ?? "Non assigné"}</p>
                          </div>

                          <div>
                            <p className="text-slate-400">Début</p>
                            <p>
                              {subTask.startDate
                                ? new Date(
                                    subTask.startDate,
                                  ).toLocaleDateString()
                                : "-"}
                            </p>
                          </div>

                          <div>
                            <p className="text-slate-400">Échéance</p>
                            <p>
                              {subTask.deadline
                                ? new Date(
                                    subTask.deadline,
                                  ).toLocaleDateString()
                                : "-"}
                            </p>
                          </div>
                        </div>

                        {/* COMMENTAIRES SOUS-TÂCHE */}
                        <div className="mt-4">
                          <button
                            onClick={() => loadComments(subTask.id)}
                            className="border px-3 h-8 rounded"
                          >
                            Commentaires
                          </button>

                          {(user?.role === "ADMIN" ||
                            user?.role === "MANAGER" ||
                            (user?.role === "PRESTATAIRE" &&
                              subTask.assignedToId === user.id)) && (
                            <button
                              onClick={() => {
                                setEditingSubTaskId(subTask.id);

                                setSubTaskEditForm({
                                  title: subTask.title,
                                  description: subTask.description,
                                  priority: subTask.priority,
                                  startDate: subTask.startDate,
                                  deadline: subTask.deadline,
                                  assignedToId: subTask.assignedToId,
                                });
                              }}
                              className="border px-3 h-9 rounded"
                            >
                              Modifier
                            </button>
                          )}

                          {commentsMap[subTask.id] && (
                            <div className="mt-3 space-y-2">
                              {commentsMap[subTask.id].map((comment) => (
                                <div
                                  key={comment.id}
                                  className="border rounded p-2"
                                >
                                  <p className="font-medium">
                                    {comment.author?.name}
                                  </p>

                                  <p>{comment.content}</p>
                                </div>
                              ))}

                              <div className="flex gap-2">
                                <input
                                  value={commentInputs[subTask.id] || ""}
                                  onChange={(e) =>
                                    setCommentInputs((prev) => ({
                                      ...prev,
                                      [subTask.id]: e.target.value,
                                    }))
                                  }
                                  className="border flex-1 h-10 px-2 rounded"
                                  placeholder="Commentaire"
                                />

                                <button
                                  onClick={() => handleAddComment(subTask.id)}
                                  className="bg-black text-white px-4 rounded"
                                >
                                  Envoyer
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {canManage && (
                          <select
                            defaultValue={subTask.assignedToId ?? ""}
                            onChange={async (e) => {
                              if (!e.target.value) return;

                              await assignTask(
                                subTask.id,
                                e.target.value,
                                accessToken!,
                              );

                              await reloadTasks();
                            }}
                            className="border rounded h-9 px-2"
                          >
                            <option value="">Assigner</option>

                            {membersList
                              .filter(
                                (member) =>
                                  member.role === "EXECUTANT" ||
                                  member.role === "PRESTATAIRE",
                              )
                              .map((member) => (
                                <option key={member.id} value={member.id}>
                                  {member.name}
                                </option>
                              ))}
                          </select>
                        )}

                        {/* ACTIONS SOUS-TÂCHE */}
                        
                        <div className="flex gap-2 mt-4">
                          
                          {(user?.role === "EXECUTANT" ||
                            user?.role === "PRESTATAIRE") &&
                            subTask.assignedToId === user?.id &&
                            subTask.status !== "VALIDATION_REQUESTED" &&
                            subTask.status !== "COMPLETED" && (
                              <button
                                onClick={async () => {
                                  await completeTask(subTask.id, accessToken!);

                                  await reloadTasks();
                                }}
                                className="bg-green-600 text-white px-3 h-9 rounded"
                              >
                                Terminer
                              </button>
                            )}

                          {(user?.role === "ADMIN" ||
                            user?.role === "MANAGER") &&
                            subTask.status === "VALIDATION_REQUESTED" && (
                              <>
                                <button
                                  onClick={async () => {
                                    await rejectTask(subTask.id, accessToken!);

                                    await reloadTasks();
                                  }}
                                  className="bg-red-600 text-white px-3 h-9 rounded"
                                >
                                  Rejeter
                                </button>

                                <button
                                  onClick={async () => {
                                    await approveManager(
                                      subTask.id,
                                      accessToken!,
                                    );

                                    await reloadTasks();
                                  }}
                                  className="bg-blue-600 text-white px-3 h-9 rounded"
                                >
                                  Valider
                                </button>
                              </>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                {(user?.role === "ADMIN" ||
                  user?.role === "MANAGER" ||
                  user?.role === "PRESTATAIRE") && (
                  <button
                    onClick={() => setSelectedParentTaskId(task.id)}
                    className="px-3 h-9 rounded-lg border"
                  >
                    Ajouter une sous-tâche
                  </button>
                )}

                <button
                  onClick={() => loadComments(task.id)}
                  className="px-3 h-9 rounded-lg border"
                >
                  Commentaires
                </button>
              </div>

              {commentsMap[task.id] && (
                <div className="mt-4 border rounded-lg p-3 bg-slate-50">
                  <h4 className="font-medium mb-3">Commentaires</h4>

                  <div className="space-y-2">
                    {commentsMap[task.id].map((comment) => (
                      <div key={comment.id} className="border rounded p-2">
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {comment.author?.name}
                          </span>

                          {(user?.role === "ADMIN" ||
                            comment.authorId === user?.id) && (
                            <button
                              onClick={() =>
                                handleDeleteComment(comment.id, task.id)
                              }
                              className="text-red-500 text-xs"
                            >
                              Supprimer
                            </button>
                          )}
                        </div>

                        <p>{comment.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <input
                      value={commentInputs[task.id] || ""}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [task.id]: e.target.value,
                        }))
                      }
                      placeholder="Ajouter un commentaire"
                      className="border flex-1 h-10 px-2 rounded"
                    />

                    <button
                      onClick={() => handleAddComment(task.id)}
                      className="bg-black text-white px-4 rounded"
                    >
                      Envoyer
                    </button>
                  </div>
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t">
                {editingId === task.id &&
                  ["ADMIN", "MANAGER"].includes(user?.role ?? "") && (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(null);

                          setEditForm({
                            title: "",
                            description: "",
                            priority: "MEDIUM",
                            startDate: "",
                            deadline: "",
                            assignedToId: "",
                          });
                        }}
                        className="px-4 h-9 rounded-lg border"
                      >
                        Annuler
                      </button>

                      <button
                        onClick={() => handleUpdate(task.id)}
                        className="px-4 h-9 rounded-lg bg-black text-white"
                      >
                        Enregistrer
                      </button>
                    </>
                  )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { useAuth } from "@/features/auth/auth-provider";
// import {
//   getTasks,
//   createTask,
//   createSubTask,
//   approveManager,
//   assignTask,
//   completeTask,
//   updateTask,
//   rejectTask,
//   addComment,
//   getComments,
//   deleteComment,
// } from "@/features/tasks/task.service";

// import {
//   UserLite,
//   Project,
//   Task,
//   Comment,
// } from "@/types/database";
// import { UpdateTaskDTO } from "@/types/task";

// interface Props {
//   membersList: UserLite[];
//   project: Project;
// }

// function getStatusColor(status: string) {
//   switch (status) {
//     case "DRAFT":
//       return "bg-gray-300";
//     case "IN_PROGRESS":
//       return "bg-blue-400";
//     case "VALIDATION_REQUESTED":
//       return "bg-yellow-400";
//     case "APPROVED":
//       return "bg-purple-400";
//     case "COMPLETED":
//       return "bg-green-500";
//     default:
//       return "bg-gray-200";
//   }
// }

// export function ProjectTasks({
//   membersList,
//   project,
// }: Props) {
//   const { accessToken, user } = useAuth();

//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [selectedParentTaskId, setSelectedParentTaskId] =
//   useState<string | null>(null);

// const [subTaskForm, setSubTaskForm] =
//   useState({
//     title: "",
//     description: "",
//     priority: "MEDIUM",
//     assignedToId: "",
//   });

//   const [commentsMap, setCommentsMap] =
//   useState<Record<string, Comment[]>>({});

// const [commentInputs, setCommentInputs] =
//   useState<Record<string, string>>({});

// const [loadingComments, setLoadingComments] =
//   useState<Record<string, boolean>>({});

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     priority: "MEDIUM",
//     startDate: "",
//     deadline: "",
//     assignedToId: "",
//   });

//   const [editForm, setEditForm] =
//     useState<UpdateTaskDTO>({
//       title: "",
//       description: "",
//       priority: "MEDIUM",
//       startDate: "",
//       deadline: "",
//       assignedToId: "",
//     });

//   const [loading, setLoading] = useState(false);

//   const [editingId, setEditingId] =
//     useState<string | null>(null);

//   useEffect(() => {
//     if (!accessToken) return;

//     async function loadTasks() {
//       try {
//         const data = await getTasks(
//           accessToken as string
//         );

//         setTasks(
//           data.filter(
//             (t: Task) => t.projectId === project.id
//           )
//         )
//       } catch (error) {
//         console.error(error);
//       }
//     }

//     loadTasks();
//   }, [accessToken, project.id]);

//   async function refreshTasks() {
//     if (!accessToken) return;

//     const updated = await getTasks(
//       accessToken
//     );

//     setTasks(
//       updated.filter(
//         (task: Task) =>
//           task.projectId === project.id
//       )
//     );
//   }

//   async function loadComments(
//   taskId: string
// ) {
//   if (!accessToken) return;

//   try {
//     setLoadingComments((prev) => ({
//       ...prev,
//       [taskId]: true,
//     }));

//     const comments =
//       await getComments(
//         taskId,
//         accessToken
//       );

//     setCommentsMap((prev) => ({
//       ...prev,
//       [taskId]: comments,
//     }));
//   } catch (error) {
//     console.error(error);
//   } finally {
//     setLoadingComments((prev) => ({
//       ...prev,
//       [taskId]: false,
//     }));
//   }
// }

// async function handleAddComment(
//   taskId: string
// ) {
//   if (!accessToken) return;

//   const content =
//     commentInputs[taskId]?.trim();

//   if (!content) return;

//   try {
//     await addComment(
//       taskId,
//       content,
//       accessToken
//     );

//     setCommentInputs((prev) => ({
//       ...prev,
//       [taskId]: "",
//     }));

//     await loadComments(taskId);

//     await refreshTasks();
//   } catch (error) {
//     console.error(error);
//   }
// }

// async function handleDeleteComment(
//   commentId: string,
//   taskId: string
// ) {
//   if (!accessToken) return;

//   try {
//     await deleteComment(
//       commentId,
//       accessToken
//     );

//     await loadComments(taskId);

//     await refreshTasks();
//   } catch (error) {
//     console.error(error);
//   }
// }

// async function handleCreateSubTask() {
//   if (
//     !accessToken ||
//     !selectedParentTaskId ||
//     !subTaskForm.title.trim()
//   ) {
//     return;
//   }

//   try {
//     await createSubTask(
//       selectedParentTaskId,
//       {
//         title: subTaskForm.title,

//         description:
//           subTaskForm.description ||
//           undefined,

//         priority:
//           subTaskForm.priority as
//             | "LOW"
//             | "MEDIUM"
//             | "HIGH"
//             | "URGENT",

//         assignedToId:
//           subTaskForm.assignedToId ||
//           undefined,

//         projectId: project.id,
//       },
//       accessToken
//     );

//     setSelectedParentTaskId(null);

//     setSubTaskForm({
//       title: "",
//       description: "",
//       priority: "MEDIUM",
//       assignedToId: "",
//     });

//     await refreshTasks();
//   } catch (error) {
//     console.error(error);
//   }
// }

//   async function handleCreate() {
//     if (!accessToken || !form.title.trim())
//       return;

//     try {
//       setLoading(true);

//       await createTask(
//         {
//           title: form.title,
//           description:
//             form.description || undefined,

//           priority: form.priority as
//             | "LOW"
//             | "MEDIUM"
//             | "HIGH"
//             | "URGENT",

//           startDate: form.startDate
//             ? new Date(
//                 form.startDate
//               ).toISOString()
//             : undefined,

//           deadline: form.deadline
//             ? new Date(
//                 form.deadline
//               ).toISOString()
//             : undefined,

//           assignedToId:
//             form.assignedToId || undefined,

//           projectId: project.id,
//         },
//         accessToken
//       );

//       await refreshTasks();

//       setForm({
//         title: "",
//         description: "",
//         priority: "MEDIUM",
//         startDate: "",
//         deadline: "",
//         assignedToId: "",
//       });
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function reloadTasks() {
//     if (!accessToken) return

//     const data = await getTasks(accessToken)

//     setTasks(
//       data.filter(
//         (task: Task) =>
//           task.projectId === project.id
//       )
//     )
//   }

//   async function handleUpdate(
//     taskId: string
//   ) {
//     if (!accessToken) return;

//     try {
//       await updateTask(
//         taskId,
//         {
//           ...editForm,

//           startDate: editForm.startDate
//             ? new Date(
//                 editForm.startDate
//               ).toISOString()
//             : undefined,

//           deadline: editForm.deadline
//             ? new Date(
//                 editForm.deadline
//               ).toISOString()
//             : undefined,

//           assignedToId:
//             editForm.assignedToId ||
//             undefined,
//         },
//         accessToken
//       );

//       await refreshTasks();

//       setEditingId(null);

//       setEditForm({
//         title: "",
//         description: "",
//         priority: "MEDIUM",
//         startDate: "",
//         deadline: "",
//         assignedToId: "",
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   const completed = tasks.filter(
//     (task) =>
//       task.status === "COMPLETED"
//   ).length;

//   const progress = tasks.length
//     ? Math.round(
//         (completed / tasks.length) * 100
//       )
//     : 0;

//   return (
//     <div className="space-y-6">
//       {/* 🔥 CREATE */}
//       {(user?.role === "ADMIN" ||
//         user?.role === "MANAGER" ||
//         user?.role === "PRESTATAIRE") && (
//         <div className="space-y-2">
//           <input
//             placeholder="Titre"
//             className="border h-10 px-2 w-full"
//             value={form.title}
//             onChange={(e) => setForm({ ...form, title: e.target.value })}
//           />

//           <input
//             placeholder="Description"
//             className="border h-10 px-2 w-full"
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//           />

//           <select
//             className="border h-10 px-2 w-full"
//             value={form.priority}
//             onChange={(e) =>
//               setForm({ ...form, priority: e.target.value as "LOW" | "MEDIUM" | "HIGH" | "URGENT"})
//             }
//           >
//             <option value="LOW">LOW</option>
//             <option value="MEDIUM">MEDIUM</option>
//             <option value="HIGH">HIGH</option>
//             <option value="URGENT">URGENT</option>
//           </select>

//           {(user?.role === "ADMIN" ||
//             user?.role === "MANAGER") && (
//             <select
//               className="border h-10 px-2 w-full"
//               value={form.assignedToId}
//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   assignedToId: e.target.value,
//                 })
//               }
//             >
//               <option value="">
//                 Assigner un exécutant
//               </option>

//               {membersList
//                 .filter(
//                   (member) =>
//                     member.role === "EXECUTANT" || "PRESTATAIRE"
//                 )
//                 .map((member) => (
//                   <option
//                     key={member.id}
//                     value={member.id}
//                   >
//                     {member.name}
//                   </option>
//                 ))}
//             </select>
//           )}

//           <input
//   type="datetime-local"
//   className="border h-10 px-2 w-full"
//   value={form.startDate}
//   onChange={(e) =>
//     setForm({
//       ...form,
//       startDate: e.target.value,
//     })
//   }
// />

// <input
//   type="datetime-local"
//   className="border h-10 px-2 w-full"
//   value={form.deadline}
//   onChange={(e) =>
//     setForm({
//       ...form,
//       deadline: e.target.value,
//     })
//   }
// />

//           <button
//             disabled={loading}
//             onClick={handleCreate}
//             className="bg-black text-white px-4 h-10 cursor-pointer"
//           >
//             {loading ? "En cour..." : "Ajouter"}
//           </button>
//         </div>
//       )}

//       {selectedParentTaskId && (
//   <div className="border rounded-xl p-4 bg-slate-50 space-y-3">
//     <h3 className="font-semibold">
//       Nouvelle sous-tâche
//     </h3>

//     <input
//       placeholder="Titre"
//       className="border h-10 px-2 w-full"
//       value={subTaskForm.title}
//       onChange={(e) =>
//         setSubTaskForm({
//           ...subTaskForm,
//           title: e.target.value,
//         })
//       }
//     />

//     <textarea
//       placeholder="Description"
//       className="border p-2 w-full rounded"
//       value={subTaskForm.description}
//       onChange={(e) =>
//         setSubTaskForm({
//           ...subTaskForm,
//           description: e.target.value,
//         })
//       }
//     />

//     <select
//       className="border h-10 px-2 w-full"
//       value={subTaskForm.priority}
//       onChange={(e) =>
//         setSubTaskForm({
//           ...subTaskForm,
//           priority: e.target.value as
//             | "LOW"
//             | "MEDIUM"
//             | "HIGH"
//             | "URGENT",
//         })
//       }
//     >
//       <option value="LOW">LOW</option>
//       <option value="MEDIUM">MEDIUM</option>
//       <option value="HIGH">HIGH</option>
//       <option value="URGENT">URGENT</option>
//     </select>

//     <select
//       className="border h-10 px-2 w-full"
//       value={subTaskForm.assignedToId}
//       onChange={(e) =>
//         setSubTaskForm({
//           ...subTaskForm,
//           assignedToId: e.target.value,
//         })
//       }
//     >
//       <option value="">
//         Assigner un utilisateur
//       </option>

//       {membersList.map((member) => (
//         <option
//           key={member.id}
//           value={member.id}
//         >
//           {member.name}
//         </option>
//       ))}
//     </select>

//     <div className="flex gap-2">
//       <button
//         onClick={handleCreateSubTask}
//         className="bg-blue-600 text-white px-4 h-10 rounded-lg"
//       >
//         Créer
//       </button>

//       <button
//         onClick={() =>
//           setSelectedParentTaskId(null)
//         }
//         className="border px-4 h-10 rounded-lg"
//       >
//         Annuler
//       </button>
//     </div>
//   </div>
// )}

//       <div>
//         <p className="text-sm mb-1">Progression</p>
//         <div className="w-full bg-gray-200 h-3 rounded">
//           <div
//             className="bg-black h-3 rounded"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//         <p className="text-xs mt-1">{progress}%</p>
//       </div>

//       {/* 🔥 LIST */}
// <div className="grid gap-4">
//   {tasks
//   .filter(
//     (task) => !task.parentTaskId
//   )
//   .map((task) => (
//     <div
//       key={task.id}
//       className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
//     >
//       {/* HEADER */}
//       <div className="flex items-start justify-between gap-4">
//         <div className="flex-1">
//           {editingId === task.id &&
//           ["ADMIN", "MANAGER"].includes(user?.role ?? "") ? (
//             <div className="space-y-3">
//               <input
//                 value={editForm.title}
//                 onChange={(e) =>
//                   setEditForm({
//                     ...editForm,
//                     title: e.target.value,
//                   })
//                 }
//                 className="w-full border rounded-lg px-3 h-10"
//                 placeholder="Titre"
//               />

//               <textarea
//                 value={editForm.description || ""}
//                 onChange={(e) =>
//                   setEditForm({
//                     ...editForm,
//                     description: e.target.value,
//                   })
//                 }
//                 className="w-full border rounded-lg p-3 min-h-[80px]"
//                 placeholder="Description"
//               />

//               <div className="grid md:grid-cols-3 gap-3">
//                 <select
//                   value={editForm.priority}
//                   onChange={(e) =>
//                     setEditForm({
//                       ...editForm,
//                       priority: e.target.value as
//                         | "LOW"
//                         | "MEDIUM"
//                         | "HIGH"
//                         | "URGENT",
//                     })
//                   }
//                   className="border rounded-lg px-3 h-10"
//                 >
//                   <option value="LOW">LOW</option>
//                   <option value="MEDIUM">MEDIUM</option>
//                   <option value="HIGH">HIGH</option>
//                   <option value="URGENT">URGENT</option>
//                 </select>

//                 <input
//                   type="datetime-local"
//                   value={editForm.startDate || ""}
//                   onChange={(e) =>
//                     setEditForm({
//                       ...editForm,
//                       startDate: e.target.value,
//                     })
//                   }
//                   className="border rounded-lg px-3 h-10"
//                 />

//                 <input
//                   type="datetime-local"
//                   value={editForm.deadline || ""}
//                   onChange={(e) =>
//                     setEditForm({
//                       ...editForm,
//                       deadline: e.target.value,
//                     })
//                   }
//                   className="border rounded-lg px-3 h-10"
//                 />
//               </div>
//             </div>
//           ) : (
//             <>
//               <h3
//                 onClick={() => {
//                   setEditingId(task.id)

//                   setEditForm({
//                     title: task.title,
//                     description: task.description,
//                     priority: task.priority,
//                     startDate: task.startDate,
//                     deadline: task.deadline,
//                     assignedToId: task.assignedToId,
//                   })
//                 }}
//                 className="font-semibold text-lg cursor-pointer hover:text-blue-600"
//               >
//                 {task.title}
//               </h3>

//               {task.description && (
//                 <p className="text-sm text-slate-500 mt-1">
//                   {task.description}
//                 </p>
//               )}
//             </>
//           )}
//         </div>

//         <span
//           className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
//             task.status
//           )}`}
//         >
//           {task.status}
//         </span>
//       </div>

//       {/* INFOS */}
//       <div className="grid md:grid-cols-4 gap-3 mt-5 text-sm">
//         <div>
//           <p className="text-slate-400">Priorité</p>
//           <p className="font-medium">{task.priority}</p>
//         </div>

//         <div>
//           <p className="text-slate-400">Assigné à</p>
//           <p className="font-medium">
//             {membersList.find(
//               (member) =>
//                 member.id === task.assignedToId
//             )?.name || "Non assigné"}
//           </p>
//         </div>

//         <div>
//           <p className="text-slate-400">Début</p>
//           <p className="font-medium">
//             {task.startDate
//               ? new Date(task.startDate).toLocaleDateString()
//               : "-"}
//           </p>
//         </div>

//         <div>
//           <p className="text-slate-400">Échéance</p>
//           <p className="font-medium">
//             {task.deadline
//               ? new Date(task.deadline).toLocaleDateString()
//               : "-"}
//           </p>
//         </div>
//       </div>

//       {task.subTasks &&
//   task.subTasks.length > 0 && (
//     <div className="mt-6 border-t pt-4">
//       <h4 className="font-semibold mb-4">
//         Sous-tâches
//       </h4>

//       <div className="space-y-3">
//         {task.subTasks.map((subTask) => (
//           <div
//             key={subTask.id}
//             className="border rounded-lg p-4 bg-slate-50"
//           >
//             <div className="flex justify-between">
//               <h5 className="font-medium">
//                 {subTask.title}
//               </h5>

//               <span
//                 className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(
//                   subTask.status
//                 )}`}
//               >
//                 {subTask.status}
//               </span>
//             </div>

//             {subTask.description && (
//               <p className="text-sm text-slate-500 mt-2">
//                 {subTask.description}
//               </p>
//             )}

//             <div className="grid md:grid-cols-3 gap-3 mt-3 text-sm">
//               <div>
//                 <p className="text-slate-400">
//                   Assigné à
//                 </p>
//                 <p>
//                   {subTask.assignedTo?.name ??
//                     "Non assigné"}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-slate-400">
//                   Début
//                 </p>
//                 <p>
//                   {subTask.startDate
//                     ? new Date(
//                         subTask.startDate
//                       ).toLocaleDateString()
//                     : "-"}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-slate-400">
//                   Échéance
//                 </p>
//                 <p>
//                   {subTask.deadline
//                     ? new Date(
//                         subTask.deadline
//                       ).toLocaleDateString()
//                     : "-"}
//                 </p>
//               </div>
//             </div>

//             {/* COMMENTAIRES SOUS-TÂCHE */}
//             <div className="mt-4">
//   <button
//     onClick={() =>
//       loadComments(subTask.id)
//     }
//     className="border px-3 h-8 rounded"
//   >
//     Commentaires
//   </button>

//   {commentsMap[subTask.id] && (
//     <div className="mt-3 space-y-2">
//       {commentsMap[
//         subTask.id
//       ].map((comment) => (
//         <div
//           key={comment.id}
//           className="border rounded p-2"
//         >
//           <p className="font-medium">
//             {comment.author?.name}
//           </p>

//           <p>{comment.content}</p>
//         </div>
//       ))}

//       <div className="flex gap-2">
//         <input
//           value={
//             commentInputs[
//               subTask.id
//             ] || ""
//           }
//           onChange={(e) =>
//             setCommentInputs(
//               (prev) => ({
//                 ...prev,
//                 [subTask.id]:
//                   e.target.value,
//               })
//             )
//           }
//           className="border flex-1 h-10 px-2 rounded"
//           placeholder="Commentaire"
//         />

//         <button
//           onClick={() =>
//             handleAddComment(
//               subTask.id
//             )
//           }
//           className="bg-black text-white px-4 rounded"
//         >
//           Envoyer
//         </button>
//       </div>
//     </div>
//   )}
// </div>
//             {/* ACTIONS SOUS-TÂCHE */}
// <div className="flex gap-2 mt-4">
//   {(user?.role ===
//     "EXECUTANT" ||
//     user?.role ===
//       "PRESTATAIRE") &&
//     subTask.assignedToId ===
//       user?.id &&
//     subTask.status !==
//       "VALIDATION_REQUESTED" &&
//     subTask.status !==
//       "COMPLETED" && (
//       <button
//         onClick={async () => {
//           await completeTask(
//             subTask.id,
//             accessToken!
//           )

//           await reloadTasks()
//         }}
//         className="bg-green-600 text-white px-3 h-9 rounded"
//       >
//         Terminer
//       </button>
//     )}

//   {(user?.role === "ADMIN" ||
//     user?.role === "MANAGER") &&
//     subTask.status ===
//       "VALIDATION_REQUESTED" && (
//       <>
//         <button
//           onClick={async () => {
//             await rejectTask(
//               subTask.id,
//               accessToken!
//             )

//             await reloadTasks()
//           }}
//           className="bg-red-600 text-white px-3 h-9 rounded"
//         >
//           Rejeter
//         </button>

//         <button
//           onClick={async () => {
//             await approveManager(
//               subTask.id,
//               accessToken!
//             )

//             await reloadTasks()
//           }}
//           className="bg-blue-600 text-white px-3 h-9 rounded"
//         >
//           Valider
//         </button>
//       </>
//     )}
// </div>
//           </div>
//         ))}
//       </div>
//     </div>
// )}

//       <div className="mt-4 flex flex-wrap gap-3">
//   {(user?.role === "ADMIN" ||
//     user?.role === "MANAGER") && (
//     <button
//       onClick={() =>
//         setSelectedParentTaskId(task.id)
//       }
//       className="px-3 h-9 rounded-lg border"
//     >
//       Ajouter une sous-tâche
//     </button>
//   )}

//   <button
//     onClick={() =>
//       loadComments(task.id)
//     }
//     className="px-3 h-9 rounded-lg border"
//   >
//     Commentaires
//   </button>
// </div>

// {commentsMap[task.id] && (
//   <div className="mt-4 border rounded-lg p-3 bg-slate-50">
//     <h4 className="font-medium mb-3">
//       Commentaires
//     </h4>

//     <div className="space-y-2">
//       {commentsMap[task.id].map(
//         (comment) => (
//           <div
//             key={comment.id}
//             className="border rounded p-2"
//           >
//             <div className="flex justify-between">
//               <span className="font-medium">
//                 {comment.author?.name}
//               </span>

//               {(user?.role ===
//                 "ADMIN" ||
//                 comment.authorId ===
//                   user?.id) && (
//                 <button
//                   onClick={() =>
//                     handleDeleteComment(
//                       comment.id,
//                       task.id
//                     )
//                   }
//                   className="text-red-500 text-xs"
//                 >
//                   Supprimer
//                 </button>
//               )}
//             </div>

//             <p>{comment.content}</p>
//           </div>
//         )
//       )}
//     </div>

//     <div className="flex gap-2 mt-3">
//       <input
//         value={
//           commentInputs[task.id] || ""
//         }
//         onChange={(e) =>
//           setCommentInputs((prev) => ({
//             ...prev,
//             [task.id]:
//               e.target.value,
//           }))
//         }
//         placeholder="Ajouter un commentaire"
//         className="border flex-1 h-10 px-2 rounded"
//       />

//       <button
//         onClick={() =>
//           handleAddComment(task.id)
//         }
//         className="bg-black text-white px-4 rounded"
//       >
//         Envoyer
//       </button>
//     </div>
//   </div>
// )}

//       {/* ACTIONS */}
//       <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t">
//         {editingId === task.id &&
//           ["ADMIN", "MANAGER"].includes(
//             user?.role ?? ""
//           ) && (
//             <>
//               <button
//                 onClick={() => {
//                   setEditingId(null)

//                   setEditForm({
//                     title: "",
//                     description: "",
//                     priority: "MEDIUM",
//                     startDate: "",
//                     deadline: "",
//                     assignedToId: "",
//                   })
//                 }}
//                 className="px-4 h-9 rounded-lg border"
//               >
//                 Annuler
//               </button>

//               <button
//                 onClick={() =>
//                   handleUpdate(task.id)
//                 }
//                 className="px-4 h-9 rounded-lg bg-black text-white"
//               >
//                 Enregistrer
//               </button>
//             </>
//           )}

//         {(user?.role === "EXECUTANT" ||
//           user?.role === "PRESTATAIRE") &&
//           task.assignedToId === user?.id &&
//           task.status !== "COMPLETED" &&
//           task.status !==
//             "VALIDATION_REQUESTED" && (
//             <button
//               onClick={async () => {
//                 if (!accessToken) return

//                 await completeTask(
//                   task.id,
//                   accessToken
//                 )

//                 await reloadTasks()
//               }}
//               className="px-4 h-9 rounded-lg bg-green-600 text-white"
//             >
//               Terminer
//             </button>
//           )}

//         {(user?.role === "ADMIN" ||
//           user?.role === "MANAGER") &&
//           task.status ===
//             "VALIDATION_REQUESTED" && (
//             <>
//               <button
//                 onClick={async () => {
//                   await rejectTask(
//                     task.id,
//                     accessToken!
//                   )

//                   await reloadTasks()
//                 }}
//                 className="px-4 h-9 rounded-lg bg-red-600 text-white"
//               >
//                 Rejeter
//               </button>

//               <button
//                 onClick={async () => {
//                   await approveManager(
//                     task.id,
//                     accessToken!
//                   )

//                   await reloadTasks()
//                 }}
//                 className="px-4 h-9 rounded-lg bg-blue-600 text-white"
//               >
//                 Finaliser
//               </button>
//             </>
//           )}
//       </div>
//     </div>
//   ))}
// </div>

//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useAuth } from "@/features/auth/auth-provider";
// import {
//   getTasks,
//   createTask,
//   approveManager,
//   assignTask,
//   completeTask,
//   updateTask,
//   rejectTask,
// } from "@/features/tasks/task.service";

// import { UserLite, Project, Task } from "@/types/database";
// import { UpdateTaskDTO } from "@/types/task";

// interface Props {
//   membersList: UserLite[];
//   project: Project;
// }

// function getStatusColor(status: string) {
//   switch (status) {
//     case "DRAFT":
//       return "bg-gray-300";
//     case "IN_PROGRESS":
//       return "bg-blue-400";
//     case "VALIDATION_REQUESTED":
//       return "bg-yellow-400";
//     case "APPROVED":
//       return "bg-purple-400";
//     case "COMPLETED":
//       return "bg-green-500";
//     default:
//       return "bg-gray-200";
//   }
// }

// export function ProjectTasks({
//   membersList,
//   project,
// }: Props) {
//   const { accessToken, user } = useAuth();

//   const [tasks, setTasks] = useState<Task[]>([]);

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     priority: "MEDIUM",
//     startDate: "",
//     deadline: "",
//     assignedToId: "",
//   });

//   const [editForm, setEditForm] =
//     useState<UpdateTaskDTO>({
//       title: "",
//       description: "",
//       priority: "MEDIUM",
//       startDate: "",
//       deadline: "",
//       assignedToId: "",
//     });

//   const [loading, setLoading] = useState(false);

//   const [editingId, setEditingId] =
//     useState<string | null>(null);

//   useEffect(() => {
//     if (!accessToken) return;

//     async function loadTasks() {
//       try {
//         const data = await getTasks(
//           accessToken as string
//         );

//         setTasks(
//           data.filter(
//             (t: Task) => t.projectId === project.id
//           )
//         )
//       } catch (error) {
//         console.error(error);
//       }
//     }

//     loadTasks();
//   }, [accessToken, project.id]);

//   async function refreshTasks() {
//     if (!accessToken) return;

//     const updated = await getTasks(
//       accessToken
//     );

//     setTasks(
//       updated.filter(
//         (task: Task) =>
//           task.projectId === project.id
//       )
//     );
//   }

//   async function handleCreate() {
//     if (!accessToken || !form.title.trim())
//       return;

//     try {
//       setLoading(true);

//       await createTask(
//         {
//           title: form.title,
//           description:
//             form.description || undefined,

//           priority: form.priority as
//             | "LOW"
//             | "MEDIUM"
//             | "HIGH"
//             | "URGENT",

//           startDate: form.startDate
//             ? new Date(
//                 form.startDate
//               ).toISOString()
//             : undefined,

//           deadline: form.deadline
//             ? new Date(
//                 form.deadline
//               ).toISOString()
//             : undefined,

//           assignedToId:
//             form.assignedToId || undefined,

//           projectId: project.id,
//         },
//         accessToken
//       );

//       await refreshTasks();

//       setForm({
//         title: "",
//         description: "",
//         priority: "MEDIUM",
//         startDate: "",
//         deadline: "",
//         assignedToId: "",
//       });
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function reloadTasks() {
//     if (!accessToken) return

//     const data = await getTasks(accessToken)

//     setTasks(
//       data.filter(
//         (task: Task) =>
//           task.projectId === project.id
//       )
//     )
//   }

//   async function handleUpdate(
//     taskId: string
//   ) {
//     if (!accessToken) return;

//     try {
//       await updateTask(
//         taskId,
//         {
//           ...editForm,

//           startDate: editForm.startDate
//             ? new Date(
//                 editForm.startDate
//               ).toISOString()
//             : undefined,

//           deadline: editForm.deadline
//             ? new Date(
//                 editForm.deadline
//               ).toISOString()
//             : undefined,

//           assignedToId:
//             editForm.assignedToId ||
//             undefined,
//         },
//         accessToken
//       );

//       await refreshTasks();

//       setEditingId(null);

//       setEditForm({
//         title: "",
//         description: "",
//         priority: "MEDIUM",
//         startDate: "",
//         deadline: "",
//         assignedToId: "",
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   const completed = tasks.filter(
//     (task) =>
//       task.status === "COMPLETED"
//   ).length;

//   const progress = tasks.length
//     ? Math.round(
//         (completed / tasks.length) * 100
//       )
//     : 0;

//   return (
//     <div className="space-y-6">
//       {/* 🔥 CREATE */}
//       {(user?.role === "ADMIN" ||
//         user?.role === "MANAGER" ||
//         user?.role === "PRESTATAIRE") && (
//         <div className="space-y-2">
//           <input
//             placeholder="Titre"
//             className="border h-10 px-2 w-full"
//             value={form.title}
//             onChange={(e) => setForm({ ...form, title: e.target.value })}
//           />

//           <input
//             placeholder="Description"
//             className="border h-10 px-2 w-full"
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//           />

//           <select
//             className="border h-10 px-2 w-full"
//             value={form.priority}
//             onChange={(e) =>
//               setForm({ ...form, priority: e.target.value as "LOW" | "MEDIUM" | "HIGH" | "URGENT"})
//             }
//           >
//             <option value="LOW">LOW</option>
//             <option value="MEDIUM">MEDIUM</option>
//             <option value="HIGH">HIGH</option>
//             <option value="URGENT">URGENT</option>
//           </select>

//           {(user?.role === "ADMIN" ||
//             user?.role === "MANAGER") && (
//             <select
//               className="border h-10 px-2 w-full"
//               value={form.assignedToId}
//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   assignedToId: e.target.value,
//                 })
//               }
//             >
//               <option value="">
//                 Assigner un exécutant
//               </option>

//               {membersList
//                 .filter(
//                   (member) =>
//                     member.role === "EXECUTANT"
//                 )
//                 .map((member) => (
//                   <option
//                     key={member.id}
//                     value={member.id}
//                   >
//                     {member.name}
//                   </option>
//                 ))}
//             </select>
//           )}

//           <input
//             type="datetime-local"
//             className="border h-10 px-2 w-full"
//             value={editForm.startDate || ""}
//             onChange={(e) =>
//               setEditForm({
//                 ...editForm,
//                 startDate: e.target.value,
//               })
//             }
//           />

//           <input
//             type="datetime-local"
//             className="border h-10 px-2 w-full"
//             value={editForm.deadline || ""}
//             onChange={(e) =>
//               setEditForm({
//                 ...editForm,
//                 deadline: e.target.value,
//               })
//             }
//           />

//           <button
//             disabled={loading}
//             onClick={handleCreate}
//             className="bg-black text-white px-4 h-10 cursor-pointer"
//           >
//             {loading ? "En cour..." : "Ajouter"}
//           </button>
//         </div>
//       )}

//       <div>
//         <p className="text-sm mb-1">Progression</p>
//         <div className="w-full bg-gray-200 h-3 rounded">
//           <div
//             className="bg-black h-3 rounded"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//         <p className="text-xs mt-1">{progress}%</p>
//       </div>

//       {/* 🔥 LIST */}
// <div className="grid gap-4">
//   {tasks.map((task) => (
//     <div
//       key={task.id}
//       className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
//     >
//       {/* HEADER */}
//       <div className="flex items-start justify-between gap-4">
//         <div className="flex-1">
//           {editingId === task.id &&
//           ["ADMIN", "MANAGER"].includes(user?.role ?? "") ? (
//             <div className="space-y-3">
//               <input
//                 value={editForm.title}
//                 onChange={(e) =>
//                   setEditForm({
//                     ...editForm,
//                     title: e.target.value,
//                   })
//                 }
//                 className="w-full border rounded-lg px-3 h-10"
//                 placeholder="Titre"
//               />

//               <textarea
//                 value={editForm.description || ""}
//                 onChange={(e) =>
//                   setEditForm({
//                     ...editForm,
//                     description: e.target.value,
//                   })
//                 }
//                 className="w-full border rounded-lg p-3 min-h-[80px]"
//                 placeholder="Description"
//               />

//               <div className="grid md:grid-cols-3 gap-3">
//                 <select
//                   value={editForm.priority}
//                   onChange={(e) =>
//                     setEditForm({
//                       ...editForm,
//                       priority: e.target.value as
//                         | "LOW"
//                         | "MEDIUM"
//                         | "HIGH"
//                         | "URGENT",
//                     })
//                   }
//                   className="border rounded-lg px-3 h-10"
//                 >
//                   <option value="LOW">LOW</option>
//                   <option value="MEDIUM">MEDIUM</option>
//                   <option value="HIGH">HIGH</option>
//                   <option value="URGENT">URGENT</option>
//                 </select>

//                 <input
//                   type="datetime-local"
//                   value={editForm.startDate || ""}
//                   onChange={(e) =>
//                     setEditForm({
//                       ...editForm,
//                       startDate: e.target.value,
//                     })
//                   }
//                   className="border rounded-lg px-3 h-10"
//                 />

//                 <input
//                   type="datetime-local"
//                   value={editForm.deadline || ""}
//                   onChange={(e) =>
//                     setEditForm({
//                       ...editForm,
//                       deadline: e.target.value,
//                     })
//                   }
//                   className="border rounded-lg px-3 h-10"
//                 />
//               </div>
//             </div>
//           ) : (
//             <>
//               <h3
//                 onClick={() => {
//                   setEditingId(task.id)

//                   setEditForm({
//                     title: task.title,
//                     description: task.description,
//                     priority: task.priority,
//                     startDate: task.startDate,
//                     deadline: task.deadline,
//                     assignedToId: task.assignedToId,
//                   })
//                 }}
//                 className="font-semibold text-lg cursor-pointer hover:text-blue-600"
//               >
//                 {task.title}
//               </h3>

//               {task.description && (
//                 <p className="text-sm text-slate-500 mt-1">
//                   {task.description}
//                 </p>
//               )}
//             </>
//           )}
//         </div>

//         <span
//           className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
//             task.status
//           )}`}
//         >
//           {task.status}
//         </span>
//       </div>

//       {/* INFOS */}
//       <div className="grid md:grid-cols-4 gap-3 mt-5 text-sm">
//         <div>
//           <p className="text-slate-400">Priorité</p>
//           <p className="font-medium">{task.priority}</p>
//         </div>

//         <div>
//           <p className="text-slate-400">Assigné à</p>
//           <p className="font-medium">
//             {membersList.find(
//               (member) =>
//                 member.id === task.assignedToId
//             )?.name || "Non assigné"}
//           </p>
//         </div>

//         <div>
//           <p className="text-slate-400">Début</p>
//           <p className="font-medium">
//             {task.startDate
//               ? new Date(task.startDate).toLocaleDateString()
//               : "-"}
//           </p>
//         </div>

//         <div>
//           <p className="text-slate-400">Échéance</p>
//           <p className="font-medium">
//             {task.deadline
//               ? new Date(task.deadline).toLocaleDateString()
//               : "-"}
//           </p>
//         </div>
//       </div>

//       {/* ASSIGNATION */}
//       {(user?.role === "ADMIN" ||
//         user?.role === "MANAGER") && (
//         <div className="mt-5">
//           <select
//             onChange={async (e) => {
//               if (!accessToken) return

//               if (!e.target.value) return

//               await assignTask(
//                 task.id,
//                 e.target.value,
//                 accessToken
//               )

//               await reloadTasks()
//             }}
//             className="border rounded-lg h-10 px-3"
//           >
//             <option value="">
//               Assigner un utilisateur
//             </option>

//             {membersList.map((m) => (
//               <option
//                 key={m.id}
//                 value={m.id}
//               >
//                 {m.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* ACTIONS */}
//       <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t">
//         {editingId === task.id &&
//           ["ADMIN", "MANAGER"].includes(
//             user?.role ?? ""
//           ) && (
//             <>
//               <button
//                 onClick={() => {
//                   setEditingId(null)

//                   setEditForm({
//                     title: "",
//                     description: "",
//                     priority: "MEDIUM",
//                     startDate: "",
//                     deadline: "",
//                     assignedToId: "",
//                   })
//                 }}
//                 className="px-4 h-9 rounded-lg border"
//               >
//                 Annuler
//               </button>

//               <button
//                 onClick={() =>
//                   handleUpdate(task.id)
//                 }
//                 className="px-4 h-9 rounded-lg bg-black text-white"
//               >
//                 Enregistrer
//               </button>
//             </>
//           )}

//         {(user?.role === "EXECUTANT" ||
//           user?.role === "PRESTATAIRE") &&
//           task.assignedToId === user?.id &&
//           task.status !== "COMPLETED" &&
//           task.status !==
//             "VALIDATION_REQUESTED" && (
//             <button
//               onClick={async () => {
//                 if (!accessToken) return

//                 await completeTask(
//                   task.id,
//                   accessToken
//                 )

//                 await reloadTasks()
//               }}
//               className="px-4 h-9 rounded-lg bg-green-600 text-white"
//             >
//               Terminer
//             </button>
//           )}

//         {(user?.role === "ADMIN" ||
//           user?.role === "MANAGER") &&
//           task.status ===
//             "VALIDATION_REQUESTED" && (
//             <>
//               <button
//                 onClick={async () => {
//                   await rejectTask(
//                     task.id,
//                     accessToken!
//                   )

//                   await reloadTasks()
//                 }}
//                 className="px-4 h-9 rounded-lg bg-red-600 text-white"
//               >
//                 Rejeter
//               </button>

//               <button
//                 onClick={async () => {
//                   await approveManager(
//                     task.id,
//                     accessToken!
//                   )

//                   await reloadTasks()
//                 }}
//                 className="px-4 h-9 rounded-lg bg-blue-600 text-white"
//               >
//                 Finaliser
//               </button>
//             </>
//           )}
//       </div>
//     </div>
//   ))}
// </div>

//     </div>
//   );
// }
