from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os

app = FastAPI(title="AI Code Companion API (stub)")

# CORS: allow Expo web (localhost) and your LAN IP range
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:8081",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8081",
    # add your LAN dev IPs if needed, e.g. http://10.33.8.196:19000
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    language: str
    mode: str            # "explain" | "debug" | "refactor"
    code: str
    errorContext: Optional[str] = None

class AnalyzeResponse(BaseModel):
    summary: str
    steps: List[str]
    issues: List[str]
    suggestions: List[str]
    improvedCode: str

@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    # 💡 STUB ONLY — no LLM yet
    # You’re validating the JSON pipeline end-to-end.
    if not req.code.strip():
        raise HTTPException(status_code=400, detail="Empty code")

    return AnalyzeResponse(
        summary=f"[stub] {req.mode.capitalize()} for {req.language} code received.",
        steps=[
            "Parsed request.",
            "This is a fake analysis (LLM not wired yet).",
        ],
        issues=["(stub) no issues analyzed"],
        suggestions=["(stub) wire LLM next"],
        improvedCode=req.code  # echo original for now
    )
