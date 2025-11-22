from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

# --- CORS FIX ---
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost",
    "http://localhost:8081",
    "http://127.0.0.1:8081",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class AnalyzeRequest(BaseModel):
    language: str
    mode: str      # "explain" OR "debug" OR "refactor"
    code: str
    errorContext: Optional[str] = None

class AnalyzeResponse(BaseModel):
    summary: str
    steps: List[str]
    issues: List[str]
    suggestions: List[str]
    improvedCode: str

# --- Endpoints ---
@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    return AnalyzeResponse(
        summary=f"[stub] Analysis for {req.language} code in {req.mode} mode.",
        steps=[
            "Received your code.",
            "This is a fake analysis (LLM not wired yet)."
        ],
        issues=["No real issues – this is just a stub."],
        suggestions=["Hook this endpoint up to a real LLM next."],
        improvedCode=req.code
    )

@app.get("/health")
def health():
    return {"ok": True}
