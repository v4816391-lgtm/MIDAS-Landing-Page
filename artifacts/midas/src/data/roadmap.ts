import {
  BarChart3,
  BookOpen,
  ClipboardList,
  FileText,
  FlaskConical,
  Lightbulb,
  PenLine,
  Search,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';

export type RoadmapSection =
  | 'question'
  | 'planning'
  | 'literature'
  | 'methodology'
  | 'instruments'
  | 'ethics'
  | 'data-collection'
  | 'analysis'
  | 'publication';

export type RoadmapStep = {
  id: string;
  number: string;
  label: string;
  description: string;
  section: RoadmapSection;
  icon: LucideIcon;
};

export const roadmapSteps: RoadmapStep[] = [
  { id: 'research-question', number: '01', label: 'Research Question', description: 'Frame the question', section: 'question', icon: Lightbulb },
  { id: 'planning', number: '02', label: 'Planning', description: 'Set the boundaries', section: 'planning', icon: ClipboardList },
  { id: 'literature-review', number: '03', label: 'Literature Review', description: 'Map the conversation', section: 'literature', icon: BookOpen },
  { id: 'methodology', number: '04', label: 'Methodology', description: 'Choose the approach', section: 'methodology', icon: FlaskConical },
  { id: 'instruments', number: '05', label: 'Instruments', description: 'Select your measures', section: 'instruments', icon: Search },
  { id: 'ethics', number: '06', label: 'Ethics', description: 'Build in care', section: 'ethics', icon: ShieldCheck },
  { id: 'data-collection', number: '07', label: 'Data Collection', description: 'Gather evidence', section: 'data-collection', icon: Users },
  { id: 'data-analysis', number: '08', label: 'Data Analysis', description: 'Interpret the evidence', section: 'analysis', icon: BarChart3 },
  { id: 'manuscript-writing', number: '09', label: 'Manuscript Writing', description: 'Make the thinking visible', section: 'publication', icon: PenLine },
  { id: 'journal-selection', number: '10', label: 'Journal Selection', description: 'Find the audience', section: 'publication', icon: FileText },
  { id: 'publication', number: '11', label: 'Publication', description: 'Share the work', section: 'publication', icon: FileText },
];

export const workspaceNavigation: { label: string; section: RoadmapSection; stepId: string }[] = [
  { label: 'Research Question', section: 'question', stepId: 'research-question' },
  { label: 'Literature', section: 'literature', stepId: 'literature-review' },
  { label: 'Methodology', section: 'methodology', stepId: 'methodology' },
  { label: 'Instruments', section: 'instruments', stepId: 'instruments' },
  { label: 'Ethics', section: 'ethics', stepId: 'ethics' },
  { label: 'Data Collection', section: 'data-collection', stepId: 'data-collection' },
  { label: 'Analysis', section: 'analysis', stepId: 'data-analysis' },
  { label: 'Publication', section: 'publication', stepId: 'publication' },
];