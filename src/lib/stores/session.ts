import { writable } from "svelte/store";
import type { Session, User } from "better-auth/types";

type SessionData = {
  session: Session;
  user: User;
};

export const sessionStore = writable<SessionData | null>(null);
