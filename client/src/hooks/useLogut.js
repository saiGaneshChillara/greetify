import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";

export const useLogout = () => {
  const queryClient = useQueryClient();

  const { mutate: logoutMutation, error, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return { logoutMutation };
};