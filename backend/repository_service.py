from dotenv import load_dotenv
import os
import requests

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

HEADERS = {
    "Accept": "application/vnd.github+json",
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "User-Agent": "BugHunter"
}

CODE_EXTENSIONS = (
    ".py",
    ".js",
    ".ts",
    ".java",
    ".cpp",
    ".c"
)


def get_repo_files(owner, repo, path=""):

    url = (
        f"https://api.github.com/repos/"
        f"{owner}/{repo}/contents/{path}"
    )

    try:

        response = requests.get(
            url,
            headers=HEADERS,
            timeout=15
        )

        if response.status_code != 200:

            print(
                f"GitHub Error: {response.status_code}"
            )

            return []

        data = response.json()

        if isinstance(data, dict):
            return []

        files = []

        for item in data:

            if item["type"] == "file":

                if item["name"].endswith(
                    CODE_EXTENSIONS
                ):

                    files.append(
                        item["path"]
                    )

            elif item["type"] == "dir":

                files.extend(
                    get_repo_files(
                        owner,
                        repo,
                        item["path"]
                    )
                )

        return files

    except Exception as e:

        print(
            "Repository Scan Error:",
            str(e)
        )

        return []


def get_repository_code(owner, repo):

    files = get_repo_files(
        owner,
        repo
    )

    if not files:
        return []

    # Remove docs, tests and metadata files
    files = [
        f for f in files
        if (
            "tests/" not in f
            and not f.startswith("docs/")
            and "__init__.py" not in f
            and "__version__.py" not in f
            and "setup.py" not in f
        )
    ]

    # Prioritize important source files
    priority_files = []

    for file in files:

        file_lower = file.lower()

        if any(
            keyword in file_lower
            for keyword in [
                "api",
                "service",
                "auth",
                "model",
                "adapter",
                "session"
            ]
        ):
            priority_files.append(file)

    if priority_files:
        files = priority_files[:5]
    else:
        files = files[:5]

    repository_code = []

    repo_url = (
        f"https://api.github.com/repos/"
        f"{owner}/{repo}"
    )

    try:

        repo_response = requests.get(
            repo_url,
            headers=HEADERS,
            timeout=15
        )

        if repo_response.status_code != 200:

            print(
                "Failed to get repository info"
            )

            return []

        default_branch = (
            repo_response
            .json()
            .get(
                "default_branch",
                "main"
            )
        )

        print(
            "Default Branch:",
            default_branch
        )

        for file_path in files:

            raw_url = (
                f"https://raw.githubusercontent.com/"
                f"{owner}/{repo}/"
                f"{default_branch}/{file_path}"
            )

            try:

                response = requests.get(
                    raw_url,
                    headers=HEADERS,
                    timeout=15
                )

                if response.status_code == 200:

                    repository_code.append(
                        {
                            "file": file_path,
                            "code": response.text[:5000]
                        }
                    )

                    print(
                        "Loaded:",
                        file_path
                    )

                else:

                    print(
                        "Skipped:",
                        file_path
                    )

            except Exception as e:

                print(
                    "Failed:",
                    file_path
                )

                print(str(e))

        print(
            "Files Sent To Gemini:",
            len(repository_code)
        )

        return repository_code

    except Exception as e:

        print(
            "Repository Analysis Error:",
            str(e)
        )

        return []