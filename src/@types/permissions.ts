type PermissionAction = "CREATE" | "READ" | "WRITE" | "DELETE";

type Module =
  | "COMPANY"
  | "GROUPS"
  | "UNITS"
  | "AMBULANCES"
  | "USERS"
  | "CHATS"
  | "MESSAGES"
  | "SUPERADMIN";

type PermissionsType = {
  [module in Exclude<Module, "SUPERADMIN">]: {
    [action in PermissionAction]: `${module}:${action}`;
  };
} & {
  SUPERADMIN: "SUPERADMIN";
};

export const permissions: PermissionsType = {
  COMPANY: {
    CREATE: "COMPANY:CREATE",
    READ: "COMPANY:READ",
    WRITE: "COMPANY:WRITE",
    DELETE: "COMPANY:DELETE",
  },
  GROUPS: {
    CREATE: "GROUPS:CREATE",
    READ: "GROUPS:READ",
    WRITE: "GROUPS:WRITE",
    DELETE: "GROUPS:DELETE",
  },
  UNITS: {
    CREATE: "UNITS:CREATE",
    READ: "UNITS:READ",
    WRITE: "UNITS:WRITE",
    DELETE: "UNITS:DELETE",
  },
  AMBULANCES: {
    CREATE: "AMBULANCES:CREATE",
    READ: "AMBULANCES:READ",
    WRITE: "AMBULANCES:WRITE",
    DELETE: "AMBULANCES:DELETE",
  },
  USERS: {
    CREATE: "USERS:CREATE",
    READ: "USERS:READ",
    WRITE: "USERS:WRITE",
    DELETE: "USERS:DELETE",
  },
  CHATS: {
    CREATE: "CHATS:CREATE",
    READ: "CHATS:READ",
    WRITE: "CHATS:WRITE",
    DELETE: "CHATS:DELETE",
  },
  MESSAGES: {
    CREATE: "MESSAGES:CREATE",
    READ: "MESSAGES:READ",
    WRITE: "MESSAGES:WRITE",
    DELETE: "MESSAGES:DELETE",
  },
  SUPERADMIN: "SUPERADMIN",
};
