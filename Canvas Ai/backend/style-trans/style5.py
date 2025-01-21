import tensorflow as tf
import numpy as np
import PIL.Image
import tensorflow_hub as hub

# Function to convert a tensor to an image
def tensor_to_image(tensor):
    tensor = tensor * 255
    tensor = np.array(tensor, dtype=np.uint8)
    if np.ndim(tensor) > 3:
        assert tensor.shape[0] == 1
        tensor = tensor[0]
    return PIL.Image.fromarray(tensor)

# Function to load and preprocess an image
def load_img(path_to_img):
    try:
        max_dim = 512
        img = tf.io.read_file(path_to_img)
        img = tf.image.decode_image(img, channels=3)
        img = tf.image.convert_image_dtype(img, tf.float32)

        shape = tf.cast(tf.shape(img)[:-1], tf.float32)
        long_dim = max(shape)
        scale = max_dim / long_dim

        new_shape = tf.cast(shape * scale, tf.int32)
        img = tf.image.resize(img, new_shape)
        img = img[tf.newaxis, :]  # Add batch dimension
        return img
    except Exception as e:
        print(f"Error loading image: {e}")
        return None

# Function to load the style transfer model
def load_model():
    model = hub.load('https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2')
    return model

# Function to apply the model on the uploaded image
def apply_model_on_image(model, content_image_path, style_image_path):
    content_image = load_img(content_image_path)
    style_image = load_img(style_image_path)

    if content_image is None:
        print(f"Failed to load content image from: {content_image_path}")
    if style_image is None:
        print(f"Failed to load style image from: {style_image_path}")

    if content_image is None or style_image is None:
        print("Failed to load one or both images. Exiting.")
    else:
        # Apply style transfer
        stylized_image = model(tf.constant(content_image), tf.constant(style_image))[0]

        # Convert the stylized image to PIL format
        stylized_image_pil = tensor_to_image(stylized_image)
        return stylized_image_pil

# Example usage
if __name__ == "__main__":
    # Load the style transfer model from TensorFlow Hub
    hub_model = load_model()

    # Paths to the uploaded content and style images
    content_image_path = "path_to_your_content_image.jpg"
    style_image_path = "path_to_your_style_image.jpg"

    # Apply the model on the uploaded images
    stylized_image_pil = apply_model_on_image(hub_model, content_image_path, style_image_path)
    stylized_image_pil.show()
    stylized_image_pil.save("stylized_image.png")
    print("Stylized image saved as 'stylized_image.png'")