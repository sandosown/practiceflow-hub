import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const ADD_KEY = '__add_custom__';

interface CategorySelectProps {
  defaults: string[];
  custom: string[];
  value: string;
  onChange: (v: string) => void;
  onAddCustom: (name: string) => void;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  defaults, custom, value, onChange, onAddCustom,
}) => {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const allOptions = [...defaults, ...custom.filter(c => !defaults.includes(c))];

  const handleValueChange = (v: string) => {
    if (v === ADD_KEY) {
      setAdding(true);
      return;
    }
    onChange(v);
  };

  const confirmAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (!allOptions.includes(trimmed)) {
      onAddCustom(trimmed);
    }
    onChange(trimmed);
    setNewName('');
    setAdding(false);
  };

  if (adding) {
    return (
      <div className="flex items-center gap-2 mt-1">
        <Input
          placeholder="New category name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && confirmAdd()}
          autoFocus
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={confirmAdd}
          className="shrink-0"
          style={{ borderColor: '#059669', color: '#059669' }}
        >
          <Check className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => { setAdding(false); setNewName(''); }}
          className="shrink-0 text-muted-foreground"
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
      <SelectContent>
        {allOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        <SelectItem value={ADD_KEY} className="text-emerald-600 font-medium">+ Add Category</SelectItem>
      </SelectContent>
    </Select>
  );
};
