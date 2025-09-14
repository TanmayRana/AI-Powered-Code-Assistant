"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FolderOpen,
  Star,
  Calendar,
  Code,
  Users,
  Play,
  ArrowLeft,
  Settings,
  GitBranch,
  FileText,
  Globe,
  Download,
  Share2,
} from "lucide-react";
import { toast } from "react-hot-toast";

const projects = [
  {
    id: 1,
    name: "Todo App",
    description:
      "A modern todo application with React and TypeScript featuring drag-and-drop functionality",
    language: "TypeScript",
    framework: "React",
    lastModified: "2 hours ago",
    fileCount: 12,
    collaborative: true,
    starred: false,
    status: "active",
    thumbnail: "✅",
    category: "Web App",
    progress: 85,
    readme: `# Todo App

A modern, responsive todo application built with React and TypeScript.

## Features

- ✅ Add, edit, and delete todos
- 🎯 Mark todos as complete/incomplete
- 🏷️ Categorize todos with tags
- 🔍 Search and filter functionality
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS
- 💾 Local storage persistence

## Tech Stack

- **Frontend:** React 18, TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Hooks (useState, useEffect)
- **Build Tool:** Vite
- **Package Manager:** npm

## Getting Started

1. Clone the repository
2. Install dependencies: \`npm install\`
3. Start the development server: \`npm run dev\`
4. Open http://localhost:3000 in your browser

## Project Structure

\`\`\`
src/
├── components/
│   ├── TodoItem.tsx
│   ├── TodoList.tsx
│   ├── AddTodo.tsx
│   └── FilterBar.tsx
├── hooks/
│   └── useTodos.ts
├── types/
│   └── todo.ts
├── utils/
│   └── storage.ts
└── App.tsx
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request`,
    files: [
      {
        name: "src/App.tsx",
        type: "file",
        size: "2.1 KB",
        modified: "2 hours ago",
      },
      {
        name: "src/components/TodoItem.tsx",
        type: "file",
        size: "1.8 KB",
        modified: "3 hours ago",
      },
      {
        name: "src/components/TodoList.tsx",
        type: "file",
        size: "1.2 KB",
        modified: "3 hours ago",
      },
      {
        name: "src/components/AddTodo.tsx",
        type: "file",
        size: "1.5 KB",
        modified: "4 hours ago",
      },
      {
        name: "src/hooks/useTodos.ts",
        type: "file",
        size: "2.3 KB",
        modified: "1 day ago",
      },
      {
        name: "src/types/todo.ts",
        type: "file",
        size: "0.3 KB",
        modified: "1 day ago",
      },
      {
        name: "package.json",
        type: "file",
        size: "1.1 KB",
        modified: "2 days ago",
      },
      {
        name: "README.md",
        type: "file",
        size: "1.8 KB",
        modified: "2 days ago",
      },
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    liveUrl: "https://my-todo-app.vercel.app",
    githubUrl: "https://github.com/user/todo-app",
  },
  {
    id: 2,
    name: "Python Calculator",
    description:
      "Scientific calculator built with Python and tkinter with advanced mathematical functions",
    language: "Python",
    framework: "tkinter",
    lastModified: "1 day ago",
    fileCount: 8,
    collaborative: false,
    starred: true,
    status: "completed",
    thumbnail: "🧮",
    category: "Desktop App",
    progress: 100,
    readme: `# Python Calculator

A feature-rich scientific calculator built with Python and tkinter.

## Features

- 🔢 Basic arithmetic operations (+, -, ×, ÷)
- 🧮 Scientific functions (sin, cos, tan, log, sqrt)
- 📊 Memory functions (M+, M-, MR, MC)
- 🔄 History tracking
- ⌨️ Keyboard support
- 🎨 Modern GUI design

## Requirements

- Python 3.7+
- tkinter (usually included with Python)
- math module (built-in)

## Installation

1. Clone the repository
2. Run: \`python calculator.py\`

## Usage

- Click buttons or use keyboard for input
- Use scientific functions for advanced calculations
- Access calculation history with the History button
- Memory functions store and recall values

## Keyboard Shortcuts

- Numbers: 0-9
- Operations: +, -, *, /
- Enter: Calculate
- Escape: Clear
- Backspace: Delete last digit`,
    files: [
      {
        name: "calculator.py",
        type: "file",
        size: "8.5 KB",
        modified: "1 day ago",
      },
      { name: "gui.py", type: "file", size: "4.2 KB", modified: "1 day ago" },
      {
        name: "operations.py",
        type: "file",
        size: "2.8 KB",
        modified: "2 days ago",
      },
      {
        name: "history.py",
        type: "file",
        size: "1.5 KB",
        modified: "2 days ago",
      },
      {
        name: "memory.py",
        type: "file",
        size: "1.1 KB",
        modified: "3 days ago",
      },
      {
        name: "constants.py",
        type: "file",
        size: "0.5 KB",
        modified: "3 days ago",
      },
      {
        name: "README.md",
        type: "file",
        size: "1.2 KB",
        modified: "1 week ago",
      },
      {
        name: "requirements.txt",
        type: "file",
        size: "0.1 KB",
        modified: "1 week ago",
      },
    ],
    technologies: ["Python", "tkinter", "math"],
    liveUrl: null,
    githubUrl: "https://github.com/user/python-calculator",
  },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = parseInt(params.id as string);
  const project = projects.find((p) => p.id === projectId);
  const [currentTab, setCurrentTab] = useState("overview");

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <p className="text-gray-600 mb-4">
            The project you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const getLanguageColor = (language: string) => {
    const colors = {
      TypeScript:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      JavaScript:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      Python:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      Java: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
    return (
      colors[language as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const handleOpenProject = () => {
    toast.success("Opening project in editor...");
  };

  const handleViewLive = () => {
    if (project.liveUrl) {
      window.open(project.liveUrl, "_blank");
    } else {
      toast.error("Live demo not available for this project");
    }
  };

  const handleViewGithub = () => {
    if (project.githubUrl) {
      window.open(project.githubUrl, "_blank");
    } else {
      toast.error("GitHub repository not available");
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
              {project.thumbnail}
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {project.name}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge className={getLanguageColor(project.language)}>
                  {project.language}
                </Badge>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
                <Badge variant="outline">{project.category}</Badge>
                {project.collaborative && (
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    <Users className="h-3 w-3 mr-1" />
                    Collaborative
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {project.fileCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Files
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {project.framework}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Framework
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {project.progress}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Complete
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-1">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {project.lastModified}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button
          onClick={handleOpenProject}
          className="flex-1 min-w-[200px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
        >
          <Code className="h-4 w-4 mr-2" />
          Open in Editor
        </Button>
        {project.liveUrl && (
          <Button
            onClick={handleViewLive}
            variant="outline"
            className="flex-1 min-w-[150px] border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Globe className="h-4 w-4 mr-2" />
            View Live
          </Button>
        )}
        <Button
          onClick={handleViewGithub}
          variant="outline"
          className="flex-1 min-w-[150px] border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <GitBranch className="h-4 w-4 mr-2" />
          GitHub
        </Button>
        <Button
          variant="outline"
          className="p-3 border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress Card */}
      {project.progress < 100 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Project Progress</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Keep working to complete your project
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  {project.progress}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Complete
                </div>
              </div>
            </div>
            <Progress value={project.progress} className="h-3" />
          </CardContent>
        </Card>
      )}

      {/* Content Tabs */}
      <Tabs
        value={currentTab}
        onValueChange={setCurrentTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          <TabsTrigger value="overview" className="rounded-lg font-medium">
            <FolderOpen className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="files" className="rounded-lg font-medium">
            <FileText className="h-4 w-4 mr-2" />
            Files
          </TabsTrigger>
          <TabsTrigger value="readme" className="rounded-lg font-medium">
            <Code className="h-4 w-4 mr-2" />
            README
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-lg font-medium">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Technologies Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Project Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Status
                    </span>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Language
                    </span>
                    <span className="font-medium">{project.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Framework
                    </span>
                    <span className="font-medium">{project.framework}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Files
                    </span>
                    <span className="font-medium">{project.fileCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Last Modified
                    </span>
                    <span className="font-medium">{project.lastModified}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Code className="h-6 w-6" />
                  <span className="text-sm">Edit Code</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Download className="h-6 w-6" />
                  <span className="text-sm">Download</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Share2 className="h-6 w-6" />
                  <span className="text-sm">Share</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Settings className="h-6 w-6" />
                  <span className="text-sm">Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Project Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {project.files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-gray-500">{file.size}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{file.modified}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="readme" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>README.md</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm">
                  {project.readme}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">General</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={project.name}
                        className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Description
                      </label>
                      <textarea
                        value={project.description}
                        className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 h-20"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Deployment</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Live URL
                      </label>
                      <input
                        type="text"
                        value={project.liveUrl || "Not deployed"}
                        className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        GitHub Repository
                      </label>
                      <input
                        type="text"
                        value={project.githubUrl || "Not connected"}
                        className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button>Save Changes</Button>
                  <Button variant="outline">Reset</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
