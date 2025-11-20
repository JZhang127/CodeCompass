from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

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

@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    # STUB: replace with real LLM later
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
