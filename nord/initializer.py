import os
import subprocess

def npm_init():
    npm_path = "C:/Program Files/nodejs/npm.cmd"
    base_directory = os.path.join(os.getcwd(), "nord")

    if not os.path.exists(base_directory):
        print(f"Error: The directory {base_directory} does not exist.")
        return
    
    folders = [f.path for f in os.scandir(base_directory) if f.is_dir()]

    for folder in folders:
        print(f"Initializing npm in {folder}")
        try:
            subprocess.run([npm_path, "init", "-y"], cwd=folder, check=True)
            print(f"Successfully initialized npm in {folder}")
        except subprocess.CalledProcessError as e:
            print(f"Error initializing npm in {folder}: {e}")

npm_init()
