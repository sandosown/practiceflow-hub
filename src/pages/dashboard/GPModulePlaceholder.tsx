import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  title: string;
}

const GPModulePlaceholder: React.FC<Props> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => navigate('/dashboard/owner')} className="hover:text-primary transition-colors">Workspaces</button>
          <span>›</span>
          <button onClick={() => navigate('/dashboard/owner/group-practice')} className="hover:text-primary transition-colors">Group Practice Dashboard</button>
          <span>›</span>
          <span className="text-foreground font-medium">{title}</span>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/owner/group-practice')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        </div>

        <div className="sf-card p-8 text-center">
          <p className="text-muted-foreground">Coming in Phase 3</p>
        </div>
      </div>
    </div>
  );
};

export default GPModulePlaceholder;
