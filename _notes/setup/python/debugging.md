---
title: "VS Code Debugging"
description: "launch.json configuration for Python debugging in VS Code"
subject: setup
math: false
tags: [debugging, python, setup, tools, vscode]
order: 3
---

Configure via `.vscode/launch.json`:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Debug Main Script",
            "type": "debugpy",
            "request": "launch",
            "program": "${workspaceFolder}/main.py",
            "console": "integratedTerminal",
            "args": [],
            "envFile": "${workspaceFolder}/.env",
            "python": "/path/to/venv/bin/python",
            "justMyCode": true,
            "env": {
                "PYTHONPATH": "${workspaceFolder}",
                "DEBUG": "true"
            }
        },
        {
            "name": "Train Model",
            "type": "debugpy",
            "request": "launch",
            "program": "${workspaceFolder}/train.py",
            "console": "integratedTerminal",
            "args": [
                "--instance_data_dir", "examples/creature",
                "--output_dir", "outputs/creature"
            ],
            "justMyCode": false,
            "subProcess": true
        }
    ]
}
```

## Key Variables
- `${workspaceFolder}` — project root
- `${file}` — currently open file
- `${command:python.interpreterPath}` — selected interpreter

## Tips
- Use `justMyCode: false` to debug into libraries
- Use `subProcess: true` for training that spawns child processes
- Always use forward slashes in paths
