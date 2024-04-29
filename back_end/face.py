import cv2
import face_recognition
from flask import Flask, request, jsonify
from supabase_py import create_client

app = Flask(__name__)

known_faces = []

# Initialize Supabase client
supabase_url = "https://suvgasxjlxfjzibnbyfk.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1dmdhc3hqbHhmanppYm5ieWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQwNjAzMzMsImV4cCI6MjAyOTYzNjMzM30.fQERUHK-56fjHeNe7csghAdi5biL6RM21_iS20wrQ1U"
supabase = create_client(supabase_url, supabase_key)

# Function to load and encode faces from images in Supabase storage
def load_known_faces_from_supabase(bucket_name):
    known_faces.clear()
    storage = supabase.storage()
    images = storage.from_storage("SnapSync Photos").list("", limit=1000).data
    for image in images:
        image_data = supabase.storage.from_storage("SnapSync Photos").download(image.name)
        if image_data.status_code == 200:
            image_bytes = image_data.content
            face_encoding = face_recognition.face_encodings(image_bytes)[0]
            known_faces.append((image.name, face_encoding))

# Route for comparing uploaded image with known faces
@app.route('/compare-images', methods=['POST'])
def compare_images():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    uploaded_image = request.files['image']
    uploaded_image.save('uploaded_image.jpeg')

    # Load uploaded image
    uploaded_image = face_recognition.load_image_file('uploaded_image.jpeg')
    uploaded_face_locations = face_recognition.face_locations(uploaded_image)
    uploaded_face_encodings = face_recognition.face_encodings(uploaded_image, uploaded_face_locations)

    # Compare uploaded face with known faces from Supabase
    matching_images = []
    for filename, known_face_encoding in known_faces:
        for uploaded_face_encoding in uploaded_face_encodings:
            match = face_recognition.compare_faces([known_face_encoding], uploaded_face_encoding, tolerance=0.6)
            if match[0]:
                matching_images.append(filename)
                break

    return jsonify({'matchingImages': matching_images})

if __name__ == "__main__":
    load_known_faces_from_supabase("SnapSync Photos")  # Load known faces from Supabase at startup
    app.run(debug=True)