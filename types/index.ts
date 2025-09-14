export interface Language {
  language: string;
  version: string;
  aliases: string[];
  runtime?: string;
}

export interface ExecutionResult {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal?: string;
    output: string;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
    signal?: string;
    output: string;
  };
}

export interface CodeFile {
  name: string;
  content: string;
}

export interface ExecutionRequest {
  language: string;
  version: string;
  files: CodeFile[];
  stdin?: string;
  args?: string[];
}

export interface TerminalEntry {
  id: string;
  type: "input" | "output" | "error" | "info";
  content: string;
  timestamp: Date;
}

export interface EditorState {
  code: string;
  language: string;
  version: string;
  stdin: string;
  headerFiles: CodeFile[];
  isRunning: boolean;
  terminalHistory: TerminalEntry[];
}
