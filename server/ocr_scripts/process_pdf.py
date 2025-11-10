import sys
import os
import PyPDF2
import docx
import tempfile
from pdf2image import convert_from_path
import pytesseract

# --- Helper Functions for Different File Types ---
try:
    from pdf2image import convert_from_path
except ImportError:
    print("pdf2image is not installed. Please add it to your requirements and ensure Poppler is available.", file=sys.stderr)
    sys.exit(1)

def extract_text_from_docx(file_path):
    """Extracts text content from a .docx file."""
    try:
        doc = docx.Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        return f"Error reading DOCX file: {e}"

def extract_text_from_txt(file_path):
    """Reads text content from a .txt file."""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()
    except Exception as e:
        return f"Error reading TXT file: {e}"

def extract_text_from_pdf_hybrid(file_path, language):
    """
    Extracts text from a PDF using a hybrid approach.
    1. Tries direct text extraction (fast).
    2. If a page yields little text, falls back to Tesseract OCR (robust).
    """
    full_text = ""
    try:
        pdf_reader = PyPDF2.PdfReader(file_path)
        tesseract_lang = 'eng'
        if language == 'traditional-chinese':
            tesseract_lang = 'chi_tra'

        for i, page in enumerate(pdf_reader.pages):
            page_text = page.extract_text()
            
            # If extracted text is very short, it might be an image-based page.
            # We set a threshold, e.g., 20 characters.
            if page_text and len(page_text.strip()) > 20:
                full_text += f"--- Page {i+1} (Text Layer) ---\n{page_text}\n\n"
            else:
                # Fallback to Tesseract OCR for this page
                full_text += f"--- Page {i+1} (OCR Fallback) ---\n"
                try:
                    with tempfile.TemporaryDirectory() as temp_dir:
                        # Convert just the current page to an image
                        image = convert_from_path(file_path, first_page=i+1, last_page=i+1, output_folder=temp_dir)[0]
                        ocr_text = pytesseract.image_to_string(image, lang=tesseract_lang)
                        full_text += ocr_text + "\n\n"
                except Exception as ocr_error:
                    full_text += f"OCR failed for this page: {str(ocr_error)}\n\n"
                    
    except Exception as e:
        return f"Error processing PDF file: {e}"
        
    return full_text

# --- Main Execution Block ---

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python process_pdf.py <file_path> <language>", file=sys.stderr)
        sys.exit(1)

    input_file_path = sys.argv[1]
    input_language = sys.argv[2]
    
    try:
        file_extension = os.path.splitext(input_file_path)[1].lower()
        extracted_text = ""

        if file_extension == '.pdf':
            extracted_text = extract_text_from_pdf_hybrid(input_file_path, input_language)
        elif file_extension == '.docx':
            extracted_text = extract_text_from_docx(input_file_path)
        elif file_extension == '.txt':
            extracted_text = extract_text_from_txt(input_file_path)
        else:
            extracted_text = "Unsupported file type."

        # Print the final result to standard output for Node.js
        print(extracted_text)

    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}", file=sys.stderr)
        sys.exit(1)
