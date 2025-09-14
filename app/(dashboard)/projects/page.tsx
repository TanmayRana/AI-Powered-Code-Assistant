"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Calendar,
  Code,
  Star,
  Globe,
  GitBranch,
  Users,
  Settings,
  Filter,
  Grid3X3,
  List,
  ChevronRight,
  Zap,
  Award
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const projects = [
  {
    id: 1,
    name: 'Todo App',
    description: 'A modern todo application with React and TypeScript featuring drag-and-drop functionality',
    language: 'TypeScript',
    framework: 'React',
    lastModified: '2 hours ago',
    files: 12,
    collaborative: true,
    starred: false,
    status: 'active',
    thumbnail: '✅',
    category: 'Web App',
    progress: 85
  },
  {
    id: 2,
    name: 'Python Calculator',
    description: 'Scientific calculator built with Python and tkinter with advanced mathematical functions',
    language: 'Python',
    framework: 'tkinter',
    lastModified: '1 day ago',
    files: 8,
    collaborative: false,
    starred: true,
    status: 'completed',
    thumbnail: '🧮',
    category: 'Desktop App',
    progress: 100
  },
  {
    id: 3,
    name: 'Blog API',
    description: 'RESTful API for a blog application using Node.js with authentication and CRUD operations',
    language: 'JavaScript',
    framework: 'Node.js',
    lastModified: '3 days ago',
    files: 15,
    collaborative: true,
    starred: false,
    status: 'active',
    thumbnail: '📝',
    category: 'Backend API',
    progress: 70
  },
  {
    id: 4,
    name: 'Weather Dashboard',
    description: 'Real-time weather dashboard with charts, forecasts, and location-based services',
    language: 'JavaScript',
    framework: 'Vue.js',
    lastModified: '1 week ago',
    files: 20,
    collaborative: false,
    starred: true,
    status: 'archived',
    thumbnail: '🌤️',
    category: 'Dashboard',
    progress: 95
  }
];

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const router = useRouter();
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    language: '',
    framework: ''
  });

  const getLanguageColor = (language: string) => {
    const colors = {
      'TypeScript': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'JavaScript': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'Python': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Java': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };
    return colors[language as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || project.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.language) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('Project created successfully!');
    setIsCreateDialogOpen(false);
    setNewProject({ name: '', description: '', language: '', framework: '' });
  };

  const toggleStar = (projectId: number) => {
    toast.success('Project starred!');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Enhanced Header */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <CardHeader className="pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FolderOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  My Projects
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Build, manage, and collaborate on your coding projects
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                <Award className="h-3 w-3 mr-1" />
                {projects.length} Projects
              </Badge>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                        <Plus className="h-4 w-4 text-white" />
                      </div>
                      Create New Project
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Project Name *</label>
                      <Input
                        placeholder="Enter project name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        placeholder="Enter project description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        className="min-h-[80px]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Language *</label>
                      <Select value={newProject.language} onValueChange={(value) => setNewProject({...newProject, language: value})}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                          <SelectItem value="cpp">C++</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Framework (Optional)</label>
                      <Input
                        placeholder="e.g., React, Vue, Express"
                        value={newProject.framework}
                        onChange={(e) => setNewProject({...newProject, framework: e.target.value})}
                        className="h-12"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleCreateProject} className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        Create Project
                      </Button>
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-2 focus:border-purple-500 dark:focus:border-purple-400"
              />
            </div>
            <div className="flex gap-3">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-full lg:w-48 h-12">
                  <SelectValue placeholder="Filter by language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="JavaScript">JavaScript</SelectItem>
                  <SelectItem value="TypeScript">TypeScript</SelectItem>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="Java">Java</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-10 w-10 p-0"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-10 w-10 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform shadow-md">
                      {project.thumbnail}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{project.category}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleStar(project.id)}
                    className="p-1 h-8 w-8"
                  >
                    <Star className={`h-4 w-4 ${project.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                  </Button>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={getLanguageColor(project.language)}>
                    {project.language}
                  </Badge>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  {project.collaborative && (
                    <Badge variant="outline" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      Team
                    </Badge>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {project.lastModified}
                      </div>
                      <div className="flex items-center gap-1">
                        <Code className="h-4 w-4" />
                        {project.files} files
                      </div>
                    </div>
                  </div>

                  {project.progress < 100 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-blue-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                      <Code className="h-4 w-4 mr-2" />
                      Open
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                      className="w-20"
                    >
                      Details
                    </Button>
                    <Button size="sm" variant="outline" className="w-10 p-0">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform shadow-md">
                    {project.thumbnail}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStar(project.id)}
                          className="p-1 h-8 w-8"
                        >
                          <Star className={`h-4 w-4 ${project.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                          <Code className="h-4 w-4 mr-2" />
                          Open
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                         onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                          className="ml-2"
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-1">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getLanguageColor(project.language)}>
                          {project.language}
                        </Badge>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        {project.collaborative && (
                          <Badge variant="outline" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            Team
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {project.lastModified}
                        </div>
                        <div className="flex items-center gap-1">
                          <Code className="h-4 w-4" />
                          {project.files} files
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredProjects.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg">
              📁
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchTerm ? 'Try adjusting your search terms or filters' : 'Get started by creating your first project and begin your coding journey'}
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}