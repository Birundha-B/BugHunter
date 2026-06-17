import re

PATTERNS = [
    {
        "issue": "Hardcoded API Key",
        "severity": "Critical",
        "pattern": r'api[_-]?key\s*=\s*["\'].*["\']'
    },
    {
        "issue": "Hardcoded Password",
        "severity": "High",
        "pattern": r'password\s*=\s*["\'].*["\']'
    },
    {
        "issue": "Dangerous eval()",
        "severity": "High",
        "pattern": r'\beval\s*\('
    },
    {
        "issue": "Dangerous exec()",
        "severity": "High",
        "pattern": r'\bexec\s*\('
    },
    {
        "issue": "SQL Injection Risk",
        "severity": "Critical",
        "pattern": r'SELECT.*\+'
    },
    {
        "issue": "Shell Injection Risk",
        "severity": "Critical",
        "pattern": r'subprocess\..*shell\s*=\s*True'
    }
]


def scan_security(code):

    findings = []

    for rule in PATTERNS:

        if re.search(
            rule["pattern"],
            code,
            re.IGNORECASE
        ):
            findings.append({
                "issue": rule["issue"],
                "severity": rule["severity"]
            })

    return findings