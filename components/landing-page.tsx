"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import {
  Code,
  Brain,
  BookOpen,
  Users,
  Zap,
  Shield,
  ArrowRight,
  Play,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function LandingPage() {
  const { user, isSignedIn } = useUser();

  // console.log("isSignedIn", isSignedIn);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
            // className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl"
            >
              {/* <Brain className="h-8 w-8 text-white" />
               */}
              <Image
                src="/logoipsum.png"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Code Assistant
            </h1>
          </div>
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI-Powered Code Assistant
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            Learn, code, and grow with your personal AI tutor. Get instant help,
            structured lessons, and real-time collaboration in a modern
            development environment.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Learning Free
              </Button>
            </Link>
            <Link href="/assistant">
              <Button
                size="lg"
                variant="outline"
                className="border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Try AI Assistant
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">
          Everything You Need to Master Coding
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          Comprehensive tools and resources designed to accelerate your
          programming journey
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Code className="h-8 w-8  text-white" />,
              title: "Interactive Code Editor",
              description:
                "Monaco Editor with syntax highlighting, autocomplete, and real-time collaboration.",
              gradient: "from-blue-500 to-blue-600",
            },
            {
              icon: <Brain className="h-8 w-8 text-white" />,
              title: "AI Assistant",
              description:
                "Get instant help, code explanations, and personalized learning recommendations.",
              gradient: "from-purple-500 to-purple-600",
            },
            {
              icon: <BookOpen className="h-8 w-8 text-white" />,
              title: "Structured Lessons",
              description:
                "Progressive learning path with quizzes, challenges, and hands-on projects.",
              gradient: "from-green-500 to-green-600",
            },
            {
              icon: <Users className="h-8 w-8 text-white" />,
              title: "Real-time Collaboration",
              description:
                "Work together with others in shared coding environments.",
              gradient: "from-orange-500 to-orange-600",
            },
            {
              icon: <Zap className="h-8 w-8 text-white" />,
              title: "Instant Feedback",
              description:
                "Get immediate code analysis, suggestions, and performance insights.",
              gradient: "from-yellow-500 to-yellow-600",
            },
            {
              icon: <Shield className="h-8 w-8 text-white" />,
              title: "Secure & Private",
              description:
                "Enterprise-grade security with end-to-end encryption for your projects.",
              gradient: "from-red-500 to-red-600",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`p-3 bg-gradient-to-r ${feature.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Active Learners</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Programming Languages</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-blue-100">Lines of Code Written</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Your Coding Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of developers who are learning and growing with AI
            assistance. Start building amazing projects today.
          </p>
          <Link href="/dashboard/dashboard">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Learning Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div>
              {/* <Brain className="h-6 w-6 text-white" />
               */}
              <Image
                src="/logoipsum.png"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Code Assistant
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            © 2024 AI Code Assistant. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
