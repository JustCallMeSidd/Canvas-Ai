import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'style-trans'))

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import base64
from io import BytesIO
from PIL import Image
import style5  # Import style5 after adding the path

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load the sketch-to-color model
sketch_to_color_model = load_model('C:/STUDY/AI_proj/proj_2/backend/sketch-color/generator_model 150.h5')

# Load the style transfer model
style_transfer_model = style5.load_model()  # Assuming style5.py has a function load_model()

def preprocess_image(image_data):
    image = Image.open(BytesIO(base64.b64decode(image_data)))
    image = image.resize((256, 256))  # Resize to the input size of the model
    image = np.array(image) / 255.0  # Normalize the image
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    image = image.astype(np.float32)  # Convert to float32
    return image

def postprocess_image(image_array):
    if isinstance(image_array, tf.Tensor):
        image_array = image_array.numpy()  # Convert EagerTensor to NumPy array if necessary
    image_array = (image_array * 255).astype(np.uint8)
    image = Image.fromarray(image_array[0])
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

@app.route('/api/sketch-to-color', methods=['POST'])
def sketch_to_color():
    data = request.json
    image_data = data['image']
    image = preprocess_image(image_data)
    colorized_image = sketch_to_color_model.predict(image)
    colorized_image = postprocess_image(colorized_image)
    return jsonify({'image': colorized_image})

@app.route('/api/style-transfer', methods=['POST'])
def style_transfer():
    try:
        data = request.json
        content_image_data = data['content_image']
        style_image_data = data['style_image']
        
        content_image = preprocess_image(content_image_data)
        style_image = preprocess_image(style_image_data)
        
        stylized_image = style_transfer_model(tf.constant(content_image), tf.constant(style_image))[0]
        stylized_image = postprocess_image(stylized_image)
        
        return jsonify({'image': stylized_image})
    except KeyError as e:
        return jsonify({'error': f'Missing key: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)