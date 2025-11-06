import sys
import os
import tempfile
from pdf2image import convert_from_path
import pytesseract

def ocr_pdf(file_path, language):
    """
    Performs OCR on a given PDF file and returns the extracted text.
    """
    text = ""
    # Use a temporary directory to store the images of the PDF pages
    with tempfile.TemporaryDirectory() as temp_dir:
        # Convert PDF to a list of PIL images
        images = convert_from_path(file_path, output_folder=temp_dir)
        
        # Determine the language for Tesseract
        # Note: 'traditional-chinese' in the UI needs to be mapped to 'chi_tra' for Tesseract
        tesseract_lang = 'eng'
        if language == 'traditional-chinese':
            tesseract_lang = 'chi_tra'

        # Iterate through all the images and extract text
        for i, image in enumerate(images):
            try:
                # Use Tesseract to do OCR on the image
                page_text = pytesseract.image_to_string(image, lang=tesseract_lang)
                text += f"--- Page {i+1} ---\n{page_text}\n\n"
            except Exception as e:
                text += f"--- Error on Page {i+1}: {str(e)} ---\n\n"
    
    return text

if __name__ == "__main__":
    # The script is called with arguments: 
    # sys.argv[0] is the script name itself
    # sys.argv[1] is the input file path
    # sys.argv[2] is the language
    pdf_file_path = sys.argv[1]
    ocr_lang = sys.argv[2]
    
    try:
        extracted_text = ocr_pdf(pdf_file_path, ocr_lang)
        # Print the result to standard output, so Node.js can capture it
        print(extracted_text)
    except Exception as e:
        # If there's an error, print it to standard error
        print(f"Error processing PDF: {str(e)}", file=sys.stderr)
        sys.exit(1)
