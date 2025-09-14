import axios from "axios";
import { Language, ExecutionRequest, ExecutionResult } from "@/types";

const PISTON_API_URL = "https://emkc.org/api/v2/piston";

export class PistonAPI {
  private static instance: PistonAPI;
  private languages: Language[] = [];
  private languagesLoaded = false;

  static getInstance(): PistonAPI {
    if (!PistonAPI.instance) {
      PistonAPI.instance = new PistonAPI();
    }
    return PistonAPI.instance;
  }

  async getLanguages(): Promise<Language[]> {
    if (this.languagesLoaded) {
      return this.languages;
    }

    try {
      const response = await axios.get(`${PISTON_API_URL}/runtimes`);
      this.languages = response.data;
      this.languagesLoaded = true;
      return this.languages;
    } catch (error) {
      console.error("Failed to fetch languages:", error);
      throw new Error("Failed to fetch supported languages");
    }
  }

  async executeCode(request: ExecutionRequest): Promise<ExecutionResult> {
    // Proxy through our backend to allow future enhancements (dependencies, secrets, rate limiting)
    try {
      const response = await axios.post(`/api/execute`, request, {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      });
      return response.data;
    } catch (error) {
      console.error("Code execution failed:", error);
      throw new Error("Code execution failed. Please try again.");
    }
  }

  getLanguageByName(name: string): Language | undefined {
    return this.languages.find(
      (lang) =>
        lang.language.toLowerCase() === name.toLowerCase() ||
        lang.aliases.some((alias) => alias.toLowerCase() === name.toLowerCase())
    );
  }

  getDefaultCode(language: string): string {
    const templates: Record<string, string> = {
      python: 'print("Hello, World!")',
      javascript: `// Reads all stdin synchronously (works on Piston) and mimics readline-sync
const data = require('fs').readFileSync(0, 'utf8').split(/\r?\n/);
let cursor = 0;
const question = (prompt = '') => {
  if (prompt) process.stdout.write(prompt);
  return data[cursor++] ?? '';
};

// Example usage
const name = question('Enter your name: ');
console.log('Hello, ' + name + '!');
`,
      typescript: `// Reads all stdin synchronously (works on Piston) and mimics readline-sync
import * as fs from 'fs';
const data = fs.readFileSync(0, 'utf8').split(/\r?\n/);
let cursor = 0;
const question = (prompt = ''): string => {
  if (prompt) process.stdout.write(prompt);
  return data[cursor++] ?? '';
};

// Example usage
const name = question('Enter your name: ');
console.log('Hello, ' + name + '!');
`,
      java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
      c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
      go: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
      rust: `fn main() {
    println!("Hello, World!");
}`,
      php: '<?php\necho "Hello, World!";\n?>',
      ruby: 'puts "Hello, World!"',
      swift: 'print("Hello, World!")',
      kotlin: 'fun main() {\n    println("Hello, World!")\n}',
    };

    return templates[language.toLowerCase()] || "// Write your code here";
  }

  getFileExtension(language: string): string {
    const extensions: Record<string, string> = {
      python: "py",
      javascript: "js",
      typescript: "ts",
      java: "java",
      cpp: "cpp",
      c: "c",
      go: "go",
      rust: "rs",
      php: "php",
      ruby: "rb",
      swift: "swift",
      kotlin: "kt",
    };

    return extensions[language.toLowerCase()] || "txt";
  }
}
