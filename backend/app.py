from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from security_scanner import scan_security

from github_service import fetch_file

from repository_service import (
    get_repo_files,
    get_repository_code
)

from llm_service import (
    analyze_code,
    analyze_repository,
    suggest_fixes
)

from report_service import generate_pdf_report

app = FastAPI(
    title="BugHunter API",
    description="AI-Powered Code Review & Bug Detection System",
    version="2.0"
)

# =====================================
# CORS
# =====================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================
# Request Models
# =====================================

class CodeRequest(BaseModel):
    code: str


class FixRequest(BaseModel):
    code: str


class GitHubRequest(BaseModel):
    owner: str
    repo: str
    path: str


class RepoRequest(BaseModel):
    owner: str
    repo: str


# =====================================
# Home Route
# =====================================

@app.get("/")
def home():

    return {
        "message": "BugHunter Running 🚀"
    }


# =====================================
# Analyze Code
# =====================================

@app.post("/analyze")
def analyze(request: CodeRequest):

    try:

        result = analyze_code(
            request.code
        )

        return {
            "analysis": result
        }

    except Exception as e:

        return {
            "error": str(e)
        }


# =====================================
# Suggest Fixes
# =====================================

@app.post("/suggest-fixes")
def generate_fixes(request: FixRequest):

    try:

        result = suggest_fixes(
            request.code
        )

        return {
            "fixes": result
        }

    except Exception as e:

        return {
            "error": str(e)
        }

# =====================================
# Security Scanner
# =====================================

@app.post("/security-scan")
def security_scan(request: CodeRequest):

    try:

        findings = scan_security(
            request.code
        )

        return {
            "total_issues": len(findings),
            "security_findings": findings
        }

    except Exception as e:

        return {
            "error": str(e)
        }
# =====================================
# Analyze GitHub File
# =====================================

@app.post("/analyze-github")
def analyze_github(request: GitHubRequest):

    try:

        code = fetch_file(
            request.owner,
            request.repo,
            request.path
        )

        if not code:

            return {
                "error": "File not found"
            }

        result = analyze_code(code)

        return {
            "analysis": result
        }

    except Exception as e:

        return {
            "error": str(e)
        }


# =====================================
# Repository Files
# =====================================

@app.post("/repo-files")
def repo_files(request: RepoRequest):

    try:

        files = get_repo_files(
            request.owner,
            request.repo
        )

        return {
            "repository": request.repo,
            "total_files": len(files),
            "files": files
        }

    except Exception as e:

        return {
            "error": str(e)
        }


# =====================================
# Analyze Repository
# =====================================

@app.post("/analyze-repository")
def analyze_repository_endpoint(
    request: RepoRequest
):

    try:

        files_data = get_repository_code(
            request.owner,
            request.repo
        )

        if not files_data:

            return {
                "error": "No source files found"
            }

        result = analyze_repository(
            files_data
        )

        return {
            "repository": request.repo,
            "files_analyzed": len(files_data),
            "analyzed_files": [
                file["file"]
                for file in files_data
            ],
            "analysis": result
        }

    except Exception as e:

        print(
            "Repository Error:",
            str(e)
        )

        return {
            "error": str(e)
        }


# =====================================
# Generate PDF Report
# =====================================

@app.post("/analyze-repository-pdf")
def analyze_repository_pdf(
    request: RepoRequest
):

    try:

        files_data = get_repository_code(
            request.owner,
            request.repo
        )

        if not files_data:

            return {
                "error": "No source files found"
            }

        result = analyze_repository(
            files_data
        )

        pdf_path = generate_pdf_report(
            "repository_report.pdf",
            request.repo,
            result
        )

        return FileResponse(
            path=pdf_path,
            media_type="application/pdf",
            filename="BugHunter_Report.pdf"
        )

    except Exception as e:

        return {
            "error": str(e)
        }
    


@app.post("/repository-security-scan")
def repository_security_scan(
    request: RepoRequest
):

    try:

        files_data = get_repository_code(
            request.owner,
            request.repo
        )

        findings = []

        for file in files_data:

            issues = scan_security(
                file["code"]
            )

            for issue in issues:

                findings.append({
                    "file": file["file"],
                    "issue": issue["issue"],
                    "severity": issue["severity"]
                })

        critical = sum(
            1 for f in findings
            if f["severity"] == "Critical"
        )

        high = sum(
            1 for f in findings
            if f["severity"] == "High"
        )

        score = max(
            0,
            100 - (critical * 15) - (high * 8)
        )

        return {
            "repository": request.repo,
            "security_score": score,
            "critical": critical,
            "high": high,
            "total_issues": len(findings),
            "findings": findings
        }

    except Exception as e:

        return {
            "error": str(e)
        }