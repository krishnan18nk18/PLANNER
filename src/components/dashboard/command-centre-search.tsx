import { Search, Plus, Mic, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function CommandCentreSearch({ onAddTask }: { onAddTask: () => void }) {
  return (
    <div className="relative glass-card rounded-full p-2 border-border/20 shadow-2xl w-full">
      <div className="flex items-center gap-2">
        <div className="pl-4 pr-2">
          <Search className="h-6 w-6 text-primary" />
        </div>
        <Input
          type="search"
          placeholder="Search across all planners, tasks, notes..."
          className="flex-1 bg-transparent border-none text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 hover:bg-white/20 animate-bounce-hover">
                <Filter className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 hover:bg-white/20 animate-bounce-hover">
                <Mic className="h-5 w-5" />
            </Button>
            <Button onClick={onAddTask} className="rounded-full h-10 w-24 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 transition-transform shadow-lg">
                <Plus className="h-5 w-5 mr-1" />
                Add Task
            </Button>
        </div>
      </div>
    </div>
  );
}

    