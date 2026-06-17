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


def fetch_file(owner, repo, path):
    """
    Fetch a single file from GitHub repository
    """

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
            return None

        data = response.json()

        download_url = data.get(
            "download_url"
        )

        if not download_url:
            return None

        file_response = requests.get(
            download_url,
            timeout=15
        )

        if file_response.status_code != 200:
            return None

        return file_response.text

    except Exception as e:

        print(
            "GitHub Fetch Error:",
            str(e)
        )

        return None