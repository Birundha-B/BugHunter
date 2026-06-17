from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet


def generate_pdf_report(
    filename,
    repository,
    analysis
):

    doc = SimpleDocTemplate(filename)

    styles = getSampleStyleSheet()

    content = []

    title = Paragraph(
        f"BugHunter Analysis Report - {repository}",
        styles["Title"]
    )

    content.append(title)

    content.append(Spacer(1, 12))

    report_text = Paragraph(
        analysis.replace("\n", "<br/>"),
        styles["BodyText"]
    )

    content.append(report_text)

    doc.build(content)

    return filename