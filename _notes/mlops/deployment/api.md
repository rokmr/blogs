---
title: "REST APIs"
description: "REST architecture, HTTP methods, CRUD operations, and status codes"
subject: mlops
math: false
tags: [mlops, api, rest, http, deployment]
---

**API (Application Programming Interface)** — communication bridge between two software systems.

**REST (REpresentational State Transfer)** — stateless, client-server, uniform interface (HTTP), cacheable, layered.

## CRUD Operations

| Operation | HTTP Method | Description |
|-----------|-------------|-------------|
| Create | POST | Add new resource |
| Read | GET | Fetch resources |
| Update | PUT | Replace resource |
| Delete | DELETE | Remove resource |

## HTTP Methods

| Method | Usage |
|--------|-------|
| `GET` | Retrieve data |
| `POST` | Submit new data |
| `PUT` | Replace entire resource |
| `PATCH` | Modify partial resource |
| `DELETE` | Remove resource |

## Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 202 | Accepted (not yet processed) |
| 204 | No Content |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Internal Server Error |
| 503 | Service Unavailable |
