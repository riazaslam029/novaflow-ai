import { prisma } from "./prisma";
import { SessionUser } from "./auth";

/**
 * Server-side authorization layer.
 * Strictly enforces data-access rules at the database query level.
 * 
 * Rules:
 * - ADMIN: Can view all projects and tasks. Can access AI transcript creation.
 * - MANAGER: Can view only projects where managerId == currentUser.id, and tasks in those projects.
 * - AGENT: Can view only tasks assigned to them (assigneeId == currentUser.id), and the distinct projects containing their tasks.
 */

export async function getProjectsForUser(user: SessionUser) {
  if (user.role === "ADMIN") {
    return prisma.project.findMany({
      include: {
        manager: {
          select: { id: true, name: true, email: true, specialization: true },
        },
        _count: {
          select: { tasks: true },
        },
        tasks: {
          select: { estimatedHours: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  if (user.role === "MANAGER") {
    return prisma.project.findMany({
      where: {
        managerId: user.id,
      },
      include: {
        manager: {
          select: { id: true, name: true, email: true, specialization: true },
        },
        _count: {
          select: { tasks: true },
        },
        tasks: {
          select: { estimatedHours: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // AGENT: distinct projects containing their assigned tasks
  return prisma.project.findMany({
    where: {
      tasks: {
        some: {
          assigneeId: user.id,
        },
      },
    },
    include: {
      manager: {
        select: { id: true, name: true, email: true, specialization: true },
      },
      _count: {
        select: {
          tasks: {
            where: { assigneeId: user.id },
          },
        },
      },
      tasks: {
        where: { assigneeId: user.id },
        select: { estimatedHours: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectByIdForUser(user: SessionUser, projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      manager: {
        select: { id: true, name: true, email: true, specialization: true },
      },
      tasks: {
        where:
          user.role === "AGENT"
            ? { assigneeId: user.id }
            : undefined,
        include: {
          assignee: {
            select: { id: true, name: true, email: true, specialization: true },
          },
        },
        orderBy: { deadline: "asc" },
      },
    },
  });

  if (!project) return null;

  // Authorization enforcement
  if (user.role === "MANAGER" && project.managerId !== user.id) {
    return "FORBIDDEN";
  }

  if (user.role === "AGENT") {
    // If agent has no tasks in this project, they cannot access it
    const hasTask = await prisma.task.findFirst({
      where: {
        projectId,
        assigneeId: user.id,
      },
    });
    if (!hasTask) {
      return "FORBIDDEN";
    }
  }

  return project;
}

export async function getTasksForUser(user: SessionUser, projectId?: string) {
  if (user.role === "ADMIN") {
    return prisma.task.findMany({
      where: projectId ? { projectId } : undefined,
      include: {
        project: {
          select: { id: true, name: true, clientName: true, deadline: true, manager: { select: { name: true } } },
        },
        assignee: {
          select: { id: true, name: true, email: true, specialization: true },
        },
      },
      orderBy: { deadline: "asc" },
    });
  }

  if (user.role === "MANAGER") {
    return prisma.task.findMany({
      where: {
        project: {
          managerId: user.id,
          ...(projectId ? { id: projectId } : {}),
        },
      },
      include: {
        project: {
          select: { id: true, name: true, clientName: true, deadline: true, manager: { select: { name: true } } },
        },
        assignee: {
          select: { id: true, name: true, email: true, specialization: true },
        },
      },
      orderBy: { deadline: "asc" },
    });
  }

  // AGENT: strictly only tasks assigned to this agent
  return prisma.task.findMany({
    where: {
      assigneeId: user.id,
      ...(projectId ? { projectId } : {}),
    },
    include: {
      project: {
        select: { id: true, name: true, clientName: true, deadline: true, manager: { select: { name: true } } },
      },
      assignee: {
        select: { id: true, name: true, email: true, specialization: true },
      },
    },
    orderBy: { deadline: "asc" },
  });
}
