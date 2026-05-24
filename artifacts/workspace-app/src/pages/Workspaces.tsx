import { useListWorkspaces } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, LayoutList, Briefcase, Loader2 } from "lucide-react";
import { CreateWorkspaceDialog } from "@/components/workspaces/CreateWorkspaceDialog";

export default function Workspaces() {
  const { data: workspaces, isLoading } = useListWorkspaces();

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-muted-foreground mt-2">Manage your teams and projects.</p>
        </div>
        <CreateWorkspaceDialog>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-0 shadow-lg shadow-blue-900/20">
            <Plus className="mr-2 h-4 w-4" />
            New Workspace
          </Button>
        </CreateWorkspaceDialog>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center min-h-[40vh] animate-in fade-in duration-700">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium animate-pulse">Loading workspaces...</p>
          </div>
        </div>
      ) : workspaces && workspaces.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <Link key={workspace.id} href={`/workspaces/${workspace.id}/tasks`}>
              <Card className="bg-black/40 backdrop-blur-3xl border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-[2rem] hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_0_rgba(120,119,198,0.2)] cursor-pointer h-full flex flex-col overflow-hidden">
                <CardHeader>
                  <CardTitle>{workspace.name}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {workspace.description || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-4 flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {workspace.memberCount} Members
                  </div>
                  <div className="flex items-center gap-1">
                    <LayoutList className="h-4 w-4" />
                    {workspace.taskCount} Tasks
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-semibold">No workspaces yet</h3>
          <p className="mt-2 text-muted-foreground">Create your first workspace to get started.</p>
        </div>
      )}
    </div>
  );
}
