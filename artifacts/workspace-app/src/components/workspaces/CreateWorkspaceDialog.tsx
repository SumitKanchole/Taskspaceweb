import { useState, ReactNode } from "react";
import { useCreateWorkspace, getListWorkspacesQueryKey } from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

const createSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
  description: z.string().optional(),
});

type CreateFormValues = z.infer<typeof createSchema>;

interface CreateWorkspaceDialogProps {
  children: ReactNode;
}

export function CreateWorkspaceDialog({ children }: CreateWorkspaceDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const createMutation = useCreateWorkspace();

  const form = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (data: CreateFormValues) => {
    createMutation.mutate(
      { data },
      {
        onSuccess: (newWorkspace) => {
          queryClient.invalidateQueries({ queryKey: getListWorkspacesQueryKey() });
          setOpen(false);
          toast.success("Workspace created");
          form.reset();
          if (newWorkspace?.id) {
            setLocation(`/workspaces/${newWorkspace.id}/tasks`);
          }
        },
        onError: () => {
          toast.error("Failed to create workspace");
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#1e0e3b] text-white border-white/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create Workspace</DialogTitle>
          <DialogDescription className="text-white/50">
            Set up a new workspace for your team.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                 <FormItem>
                   <FormLabel className="text-white/70">Name</FormLabel>
                   <FormControl>
                     <Input className="bg-[#0b0f19] border-white/10 text-white focus-visible:ring-cyan-500" placeholder="Engineering Team" {...field} />
                   </FormControl>
                   <FormMessage className="text-red-400" />
                 </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                 <FormItem>
                   <FormLabel className="text-white/70">Description (Optional)</FormLabel>
                   <FormControl>
                     <Textarea className="bg-[#0b0f19] border-white/10 text-white focus-visible:ring-cyan-500 min-h-[100px]" placeholder="Manage engineering tasks and sprints..." {...field} />
                   </FormControl>
                   <FormMessage className="text-red-400" />
                 </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-0" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {createMutation.isPending ? "Creating..." : "Create Workspace"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
