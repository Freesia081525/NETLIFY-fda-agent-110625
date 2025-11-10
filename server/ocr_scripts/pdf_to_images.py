import sys
import json
import base64
from io import BytesIO
from pdf2image import convert_from_path

def pdf_to_base64_images(file_path):
    """
    Converts each page of a PDF into a base64 encoded JPEG image.
    Returns a JSON string of a list of these base64 strings.
    """
    images_b64 = []
    try:
        # Convert PDF to a list of PIL images
        images = convert_from_path(file_path)
        
        for image in images:
            # Create an in-memory binary stream
            buffered = BytesIO()
            # Save the image to the stream in JPEG format
            image.save(buffered, format="JPEG")
            # Get the byte value of the stream
            img_bytes = buffered.getvalue()
            # Encode the bytes to a base64 string
            img_base64 = base64.b64encode(img_bytes)
            # Decode to a UTF-8 string to make it JSON serializable
            base64_string = img_base64.decode('utf-8')
            # Add the data URI prefix
            images_b64.append(f"data:image/jpeg;base64,{base64_string}")
            
    except Exception as e:
        print(f"Error converting PDF to images: {str(e)}", file=sys.stderr)
        sys.exit(1)
        
    return json.dumps(images_b64)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python pdf_to_images.py <file_path>", file=sys.stderr)
        sys.exit(1)

    pdf_file_path = sys.argv[1]
    base64_json_output = pdf_to_base64_images(pdf_file_path)
    # Print the final JSON array to standard output
    print(base64_json_output)
