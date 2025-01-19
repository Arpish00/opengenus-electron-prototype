# convert_pdf_to_html.py
import os
from spire.pdf.common import *
from spire.pdf import *

def convert_pdf_to_html(pdf_path, output_path, use_embedded_svg=True):
    # Create a Document object
    doc = PdfDocument()

    # Load a PDF document
    doc.LoadFromFile(pdf_path)

    # Set the conversion options
    convertOptions = doc.ConvertOptions
    convertOptions.SetPdfToHtmlOptions(True, True, 1, True)

    # Save the PDF document to HTML format
    doc.SaveToFile(output_path, FileFormat.HTML)

    # Dispose resources
    doc.Dispose()

if __name__ == "__main__":
    pdf_file = "sample.pdf"  # Change this path
    output_file = "output/generated.html"  # Change this path if needed

        # to make sure the output directory exists
    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    # Create HTML file if it doesn't exist
    if not os.path.exists(output_file):
        with open(output_file, 'w') as f:
            f.write('')

    convert_pdf_to_html(pdf_file, output_file)