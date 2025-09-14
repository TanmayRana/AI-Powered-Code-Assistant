/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Star,
  Clock,
  Code,
  CheckCircle,
  Play,
  ArrowLeft,
  Users,
  Target,
  Award,
  Eye,
  Lightbulb,
} from "lucide-react";
import { toast } from "react-hot-toast";

const challenges = [
  {
    id: 1,
    title: "Two Sum Problem",
    description: "Find two numbers in an array that add up to a target value",
    difficulty: "Easy",
    points: 100,
    timeLimit: "30 min",
    completed: true,
    language: "Python",
    category: "Array",
    successRate: 85,
    submissions: 1234,
    problemStatement: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

## Example 1:
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

## Example 2:
\`\`\`
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

## Example 3:
\`\`\`
Input: nums = [3,3], target = 6
Output: [0,1]
\`\`\`

## Constraints:
- 2 ≤ nums.length ≤ 10⁴
- -10⁹ ≤ nums[i] ≤ 10⁹
- -10⁹ ≤ target ≤ 10⁹
- Only one valid answer exists.`,
    solution: `# Two Sum - Solution

## Approach 1: Brute Force
The brute force approach is simple. Loop through each element x and find if there is another value that equals to target - x.

\`\`\`python
def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []
\`\`\`

**Time Complexity:** O(n²)
**Space Complexity:** O(1)

## Approach 2: Hash Map (Optimal)
We can use a hash map to store the numbers we've seen and their indices.

\`\`\`python
def twoSum(nums, target):
    num_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in num_map:
            return [num_map[complement], i]
        
        num_map[num] = i
    
    return []
\`\`\`

**Time Complexity:** O(n)
**Space Complexity:** O(n)

## Explanation:
1. We iterate through the array once
2. For each number, we calculate its complement (target - current number)
3. We check if the complement exists in our hash map
4. If it exists, we found our pair and return the indices
5. If not, we store the current number and its index in the hash map

This approach is optimal because it reduces the time complexity from O(n²) to O(n) by trading space for time.`,
    hints: [
      "Try using a hash map to store numbers you've already seen",
      "For each number, check if its complement (target - number) exists in the hash map",
      "Remember to store the index along with the number",
      "You only need to iterate through the array once",
    ],
    testCases: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "nums[0] + nums[1] = 2 + 7 = 9",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "nums[1] + nums[2] = 2 + 4 = 6",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        explanation: "nums[0] + nums[1] = 3 + 3 = 6",
      },
    ],
  },
  {
    id: 2,
    title: "Binary Search Tree Validation",
    description: "Validate if a binary tree is a valid binary search tree",
    difficulty: "Medium",
    points: 150,
    timeLimit: "45 min",
    completed: false,
    language: "JavaScript",
    category: "Tree",
    successRate: 62,
    submissions: 892,
    problemStatement: `Given the root of a binary tree, determine if it is a valid binary search tree (BST).

A valid BST is defined as follows:
- The left subtree of a node contains only nodes with keys less than the node's key.
- The right subtree of a node contains only nodes with keys greater than the node's key.
- Both the left and right subtrees must also be binary search trees.

## Example 1:
\`\`\`
    2
   / \\
  1   3

Input: root = [2,1,3]
Output: true
\`\`\`

## Example 2:
\`\`\`
    5
   / \\
  1   4
     / \\
    3   6

Input: root = [5,1,4,null,null,3,6]
Output: false
Explanation: The root node's value is 5 but its right child's value is 4.
\`\`\`

## Constraints:
- The number of nodes in the tree is in the range [1, 10⁴].
- -2³¹ ≤ Node.val ≤ 2³¹ - 1`,
    solution: `# Binary Search Tree Validation - Solution

## Approach 1: Recursive with Bounds
We can validate the BST by keeping track of the valid range for each node.

\`\`\`javascript
function isValidBST(root) {
    function validate(node, min, max) {
        if (!node) return true;
        
        if (node.val <= min || node.val >= max) {
            return false;
        }
        
        return validate(node.left, min, node.val) && 
               validate(node.right, node.val, max);
    }
    
    return validate(root, -Infinity, Infinity);
}
\`\`\`

## Approach 2: In-order Traversal
A valid BST's in-order traversal should be in ascending order.

\`\`\`javascript
function isValidBST(root) {
    let prev = -Infinity;
    
    function inorder(node) {
        if (!node) return true;
        
        if (!inorder(node.left)) return false;
        
        if (node.val <= prev) return false;
        prev = node.val;
        
        return inorder(node.right);
    }
    
    return inorder(root);
}
\`\`\`

**Time Complexity:** O(n)
**Space Complexity:** O(n) for recursion stack`,
    hints: [
      "Think about the valid range of values for each node",
      "Consider using in-order traversal - what property should it have?",
      "Remember that all nodes in the left subtree must be less than the current node",
      "All nodes in the right subtree must be greater than the current node",
    ],
    testCases: [
      {
        input: "root = [2,1,3]",
        output: "true",
        explanation: "Valid BST structure",
      },
      {
        input: "root = [5,1,4,null,null,3,6]",
        output: "false",
        explanation:
          "Node 4 is in the right subtree of 5 but has value less than 5",
      },
    ],
  },
];

export default function ChallengeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = parseInt(params.id as string);
  const challenge = challenges.find((c) => c.id === challengeId);
  const [currentTab, setCurrentTab] = useState("problem");
  const [showHints, setShowHints] = useState(false);

  if (!challenge) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Challenge Not Found</h2>
          <p className="text-gray-600 mb-4">
            The challenge you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Array: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      Tree: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "Linked List":
        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      Frontend:
        "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    );
  };

  const handleStartChallenge = () => {
    toast.success("Starting challenge...");
  };

  const handleViewSolution = () => {
    setCurrentTab("solution");
    toast.success("Solution unlocked!");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                {challenge.title}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {challenge.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge className={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty}
                </Badge>
                <Badge className={getCategoryColor(challenge.category)}>
                  {challenge.category}
                </Badge>
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                  {challenge.language}
                </Badge>
                {challenge.completed && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                <Star className="h-5 w-5 fill-current" />
                {challenge.points}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Points
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-1">
                <Clock className="h-5 w-5" />
                {challenge.timeLimit}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Time Limit
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {challenge.successRate}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Success Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {challenge.submissions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Submissions
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleStartChallenge}
          className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white shadow-lg"
        >
          <Play className="h-4 w-4 mr-2" />
          {challenge.completed ? "Try Again" : "Start Challenge"}
        </Button>
        {challenge.completed && (
          <Button
            onClick={handleViewSolution}
            variant="outline"
            className="flex-1 border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Solution
          </Button>
        )}
      </div>

      {/* Content Tabs */}
      <Tabs
        value={currentTab}
        onValueChange={setCurrentTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          <TabsTrigger value="problem" className="rounded-lg font-medium">
            <Target className="h-4 w-4 mr-2" />
            Problem
          </TabsTrigger>
          <TabsTrigger value="hints" className="rounded-lg font-medium">
            <Lightbulb className="h-4 w-4 mr-2" />
            Hints
          </TabsTrigger>
          <TabsTrigger
            value="solution"
            className="rounded-lg font-medium"
            disabled={!challenge.completed}
          >
            <Code className="h-4 w-4 mr-2" />
            Solution
          </TabsTrigger>
          <TabsTrigger value="stats" className="rounded-lg font-medium">
            <Award className="h-4 w-4 mr-2" />
            Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="problem" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Problem Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: challenge.problemStatement.replace(/\n/g, "<br>"),
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Test Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {challenge.testCases.map((testCase, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="font-semibold mb-2">
                      Test Case {index + 1}:
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Input:</strong> {testCase.input}
                      </div>
                      <div>
                        <strong>Output:</strong> {testCase.output}
                      </div>
                      <div>
                        <strong>Explanation:</strong> {testCase.explanation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hints" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Hints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {challenge.hints.map((hint, index) => (
                  <div
                    key={index}
                    className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{hint}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="solution" className="space-y-6">
          {challenge.completed ? (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Solution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: challenge.solution.replace(/\n/g, "<br>"),
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Solution Locked</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Complete this challenge to unlock the solution
                </p>
                <Button onClick={handleStartChallenge}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Challenge
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Completion Rate</span>
                    <span>{challenge.successRate}%</span>
                  </div>
                  <Progress value={challenge.successRate} className="h-3" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.round(
                      (challenge.submissions * challenge.successRate) / 100
                    )}{" "}
                    successful submissions out of {challenge.submissions}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Challenge Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Difficulty
                    </span>
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Category
                    </span>
                    <Badge className={getCategoryColor(challenge.category)}>
                      {challenge.category}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Language
                    </span>
                    <span className="font-medium">{challenge.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Points
                    </span>
                    <span className="font-medium text-yellow-600">
                      {challenge.points}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
