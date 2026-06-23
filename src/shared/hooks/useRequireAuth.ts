import { useAuth } from "@/app/providers/AuthClientProvider";
import { useModal } from "../ui/modal";

export function useRequireAuth() {
  const { user } = useAuth();
  const loginModal = useModal();

  const requireAuth = (callback?: () => void) => {
    if (!user) {
      loginModal.open();
      return false;
    }
    callback?.();
    return true;
  };

  return {
    user,
    requireAuth,
    loginModal,
  };
}
