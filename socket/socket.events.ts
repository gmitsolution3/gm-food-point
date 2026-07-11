export const SOCKET_EVENTS = {
  CONNECT: "connect",
  JOIN_ROOM: "join:room",
  NOTIFICATION: "notification",
  ORDER_CREATED: "order:created",
  ORDER_QUEUED: "order:queued",
  ORDER_COOKING: "order:cooking",
  ORDER_READY: "order:ready",
  ORDER_COMPLETED: "order:completed",
} as const;

export const ROLES = {
  CASHIER: "cashier",
  KITCHEN: "kitchen",
  MANAGER: "manager",
  USER: "user",
} as const;
