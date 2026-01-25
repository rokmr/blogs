---
title: "Pytest Guide"
date: 2025-01-15
description: "Complete guide to Python testing with pytest - fixtures, mocking, parametrization, and best practices"
tags: [python, testing, pytest, tdd, best-practices]
---

# Pytest Guide

## What is Pytest?

Testing framework for Python with simple syntax and powerful features.

**Why use it:**
- Simple `assert` statements (no special assertion methods)
- Auto-discovers tests
- Detailed failure messages
- Powerful fixtures
- Easy to mock external dependencies

---

## Installation & Setup

```bash
# Using pip
pip install pytest

# Using uv
uv add pytest --dev
```

**Running tests:**
```bash
pytest                    # Run all tests
pytest test_file.py       # Run specific file
pytest -v                 # Verbose
pytest -s                 # Show print statements
uv run --dev pytest       # With uv
```

---

## Basic Testing

### 1. Simple Test

```python
# src/calculator.py
def add(a, b):
    return a + b
```

```python
# tests/test_calculator.py
from src.calculator import add

def test_add():
    assert add(2, 3) == 5
```

**Rules:**
- Test files: `test_*.py`
- Test functions: `test_*()`
- Use `assert` for checks

### 2. Testing Exceptions

```python
def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b
```

```python
import pytest

def test_divide_by_zero():
    with pytest.raises(ValueError):
        divide(10, 0)
```

### 3. Project Structure

```
project/
├── src/
│   ├── auth/
│   │   └── login.py
│   └── utils.py
└── tests/
    ├── test_auth/
    │   └── test_login.py      # Mirrors src structure
    └── test_utils.py
```

---

## Fixtures

Reusable test setup to avoid code duplication.

### Basic Fixture

```python
import pytest

@pytest.fixture
def user():
    return {"name": "Alice", "email": "alice@example.com"}

def test_user_name(user):
    assert user["name"] == "Alice"

def test_user_email(user):
    assert user["email"] == "alice@example.com"
```

### Global Fixtures (conftest.py)

```python
# tests/conftest.py
import pytest

@pytest.fixture
def db_connection():
    # Setup
    conn = create_connection()
    yield conn
    # Teardown
    conn.close()
```

Now `db_connection` is available in all test files without importing.

---

## Parametrized Testing

Test multiple inputs with one function.

```python
@pytest.mark.parametrize("input, expected", [
    (2, 4),
    (3, 9),
    (4, 16),
])
def test_square(input, expected):
    assert input ** 2 == expected
```

**Multiple parameters:**
```python
@pytest.mark.parametrize("a, b, result", [
    (2, 3, 5),
    (10, 5, 15),
    (0, 0, 0),
])
def test_add(a, b, result):
    assert add(a, b) == result
```

---

## Markers

Label and control test execution.

```python
@pytest.mark.slow
def test_slow_operation():
    time.sleep(5)
    assert True

@pytest.mark.skip(reason="Not ready yet")
def test_new_feature():
    assert False

@pytest.mark.xfail(reason="Known bug")
def test_known_issue():
    assert 1 / 0
```

**Run specific tests:**
```bash
pytest -m slow            # Run only slow tests
pytest -m "not slow"      # Skip slow tests
```

**Define in pyproject.toml:**
```toml
[tool.pytest.ini_options]
markers = [
    "slow: slow running tests",
    "integration: integration tests",
]
```

---

## Setup & Teardown

Run code before/after tests.

```python
class TestDatabase:
    def setup_method(self):
        """Runs before each test"""
        self.db = Database()
        self.db.connect()
    
    def teardown_method(self):
        """Runs after each test"""
        self.db.close()
    
    def test_insert(self):
        self.db.insert("test data")
        assert self.db.count() == 1
```

**Options:**
- `setup_method/teardown_method` - Before/after each test
- `setup_class/teardown_class` - Once for the whole class

---

## Mocking

Replace external dependencies with fake objects.

### Basic Mock (unittest.mock)

```python
from unittest.mock import Mock, patch
import requests

@patch("requests.get")
def test_api_call(mock_get):
    # Setup mock
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"data": "test"}
    mock_get.return_value = mock_response
    
    # Test
    response = requests.get("https://api.example.com")
    assert response.json() == {"data": "test"}
```

### Using pytest-mock (Cleaner)

```python
def test_api_call(mocker):
    mock_response = mocker.Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"data": "test"}
    
    mocker.patch("requests.get", return_value=mock_response)
    
    response = requests.get("https://api.example.com")
    assert response.json() == {"data": "test"}
```

**Mock assertions:**
```python
mock_get.assert_called_once()
mock_get.assert_called_with("https://api.example.com")
assert mock_get.call_count == 1
```

---

## Real-World Examples

### 1. Testing FastAPI

```python
# src/api.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"id": user_id, "name": "Alice"}
```

```python
# tests/test_api.py
from fastapi.testclient import TestClient
from src.api import app

client = TestClient(app)

def test_get_user():
    response = client.get("/users/1")
    assert response.status_code == 200
    assert response.json() == {"id": 1, "name": "Alice"}
```

### 2. Testing LLM/AI APIs

```python
# src/llm.py
import openai

def generate_text(prompt: str) -> str:
    client = openai.OpenAI(api_key="sk-...")
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content
```

```python
# tests/test_llm.py
def test_generate_text(mocker):
    # Mock OpenAI
    mock_client = mocker.Mock()
    mocker.patch("openai.OpenAI", return_value=mock_client)
    
    # Setup response
    mock_response = mocker.Mock()
    mock_message = mocker.Mock(content="Generated text")
    mock_choice = mocker.Mock(message=mock_message)
    mock_response.choices = [mock_choice]
    mock_client.chat.completions.create.return_value = mock_response
    
    # Test
    result = generate_text("Test prompt")
    assert result == "Generated text"
```

### 3. Testing Database

```python
# src/database.py
import sqlite3

class Database:
    def __init__(self, path=":memory:"):
        self.conn = sqlite3.connect(path)
    
    def insert_user(self, name, email):
        cursor = self.conn.cursor()
        cursor.execute("INSERT INTO users (name, email) VALUES (?, ?)", 
                      (name, email))
        self.conn.commit()
        return cursor.lastrowid
```

```python
# tests/test_database.py
import pytest

@pytest.fixture
def db():
    database = Database(":memory:")
    cursor = database.conn.cursor()
    cursor.execute("""
        CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            name TEXT,
            email TEXT
        )
    """)
    yield database
    database.conn.close()

def test_insert_user(db):
    user_id = db.insert_user("Alice", "alice@example.com")
    assert user_id == 1
```

---

## Configuration

### pyproject.toml

```toml
[tool.pytest.ini_options]
pythonpath = "src"
testpaths = ["tests"]

markers = [
    "slow: slow tests",
    "integration: integration tests",
]

addopts = [
    "-v",
    "--strict-markers",
    "--tb=short",
]
```

### VSCode Settings

Create `.vscode/settings.json`:

```json
{
  "python.testing.pytestEnabled": true,
  "python.testing.unittestEnabled": false,
  "python.testing.cwd": "${workspaceFolder}"
}
```

**Enable in VSCode:**
1. Cmd/Ctrl + Shift + P
2. "Python: Configure Tests"
3. Select "pytest"

---

## Best Practices

### 1. Descriptive Names
```python
# Good
def test_user_creation_with_valid_email():
    pass

# Bad
def test1():
    pass
```

### 2. One Test = One Concept
```python
# Good
def test_add_positive_numbers():
    assert add(2, 3) == 5

def test_add_negative_numbers():
    assert add(-2, -3) == -5

# Bad
def test_add():
    assert add(2, 3) == 5
    assert add(-2, -3) == -5
    assert add(0, 0) == 0
```

### 3. Independent Tests
```python
# Bad
def test_create_user():
    global user
    user = create_user()

def test_update_user():
    user.update(email="new@example.com")  # Depends on test_create_user

# Good
def test_update_user():
    user = create_user()
    user.update(email="new@example.com")
    assert user.email == "new@example.com"
```

### 4. Use Fixtures
```python
# Bad - Repetition
def test_user_name():
    user = {"name": "Alice", "email": "alice@example.com"}
    assert user["name"] == "Alice"

def test_user_email():
    user = {"name": "Alice", "email": "alice@example.com"}
    assert user["email"] == "alice@example.com"

# Good - DRY
@pytest.fixture
def user():
    return {"name": "Alice", "email": "alice@example.com"}

def test_user_name(user):
    assert user["name"] == "Alice"

def test_user_email(user):
    assert user["email"] == "alice@example.com"
```

### 5. Test Edge Cases
```python
def test_divide():
    assert divide(10, 2) == 5

def test_divide_by_zero():
    with pytest.raises(ValueError):
        divide(10, 0)

def test_divide_negative():
    assert divide(-10, 2) == -5
```

---

## Command Reference

```bash
# Basic
pytest                              # Run all tests
pytest test_file.py                 # Run specific file
pytest tests/test_auth/             # Run directory
pytest -v                           # Verbose
pytest -s                           # Show print
pytest -x                           # Stop on first failure

# Filtering
pytest -k "test_add"                # Match pattern
pytest -m slow                      # Run marked tests
pytest -m "not slow"                # Skip marked tests

# Coverage
pytest --cov=src                    # Show coverage
pytest --cov=src --cov-report=html  # HTML report

# Performance
pytest --durations=10               # Show slowest tests
pytest -n 4                         # Parallel (needs pytest-xdist)

# Debugging
pytest --pdb                        # Drop to debugger on failure
pytest --lf                         # Run last failed
pytest --ff                         # Failed first, then rest

# With uv
uv run --dev pytest                 # Run with uv
```

---

## Summary

**Core Concepts:**
1. **Basic**: Simple `assert` statements
2. **Fixtures**: Reusable test setup
3. **Parametrize**: Multiple inputs, one test
4. **Markers**: Label and filter tests
5. **Mocking**: Fake external dependencies
6. **Configuration**: `pyproject.toml` + VSCode

**Next Steps:**
1. Write tests for existing code
2. Aim for >80% coverage
3. Use TDD (Test-Driven Development)
4. Integrate into CI/CD

**Key Takeaway:** Good tests = reliable, maintainable code!
