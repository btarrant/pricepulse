import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}
