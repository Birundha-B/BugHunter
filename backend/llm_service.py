from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(
    api_key=os.getenv(
        "GEMINI_API_KEY"
    )
)


# =====================================
# Analyze Code
# =====================================

def analyze_code(code):

    prompt = f"""
You are a Senior Software Engineer.

Analyze the following code and provide:

1. Summary
2. Bugs Found
3. Security Issues
4. Performance Issues
5. Code Quality Suggestions
6. Recommended Fixes
7. Severity (Low / Medium / High / Critical)

Code:

{code}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text


# =====================================
# Analyze Repository
# =====================================

def analyze_repository(files_data):

    combined_code = ""

    for file in files_data:

        combined_code += (
            f"\n\n===== FILE: {file['file']} =====\n"
        )

        combined_code += file["code"]

    prompt = f"""
You are a Senior Software Architect.

The repository files below may be partial snippets.

IMPORTANT:
- Do NOT assume truncation means a bug.
- Do NOT report incomplete lines caused by snippet boundaries.
- Only report bugs if there is strong evidence.

Provide:

# Repository Summary

# Architecture Observations

# Bugs Found

# Security Issues

# Performance Issues

# Code Quality Issues

# Recommended Improvements

# Repository Score (0-100)

# Grade (A/B/C/D/F)

# Top 5 Priority Fixes

Repository Code:

{combined_code}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text
# =====================================
# Suggest Fixes
# =====================================

def suggest_fixes(code):

    prompt = f"""
You are a Senior Software Engineer.

Analyze the code.

For every issue found provide:

1. Issue
2. Why it is a problem
3. Fixed Code
4. Explanation

Code:

{code}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text