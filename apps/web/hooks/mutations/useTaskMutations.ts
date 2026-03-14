import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskCreateType, TaskUpdateType } from "@/types";
import { message } from "antd";
import api from "@/lib/api";

export const useCreateTaskMutation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: TaskCreateType) => {
      const res = await api.post("/tasks", values);
      return res.data;
    },
    onSuccess: () => {
      message.success("Task created");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onSuccessCallback?.();
    },
    onError: () => message.error("Failed to create task"),
  });
};

export const useUpdateTaskMutation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: TaskUpdateType & { id: number }) => {
      const res = await api.put(`/tasks/${id}`, values);
      return res.data;
    },
    onSuccess: () => {
      message.success("Task updated");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onSuccessCallback?.();
    },
    onError: () => message.error("Failed to update task"),
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/tasks/${id}`);
      return res.data;
    },
    onSuccess: () => {
      message.success("Task deleted");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => message.error("Failed to delete task"),
  });
};
