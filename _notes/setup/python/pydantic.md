---
title: "Pydantic"
description: "Data validation and structured output from LLMs using Pydantic models"
subject: setup
math: false
tags: [setup, python, pydantic, validation]
status: wip
sitemap: false
---
## Overview

Helps get structured output from LLMs.

## Example

```python
from pydantic import BaseModel, EmailStr
from typing import Literal, List

class CustomerQuery(BaseModel):
    name: str
    email: EmailStr
    query: str
    category: Literal['refund_request', 'information_request', 'other']
    is_complaint: bool
    tags: List[str]
```

## Validation

```python
valid_data = CustomerQuery.model_validate_json(json_output)
```

## Common Errors

1. **JSON ValidationError**: Extra text or malformed JSON
2. **Data ValidationError**: Valid JSON but data doesn't match model schema
