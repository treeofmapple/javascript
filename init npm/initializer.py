import os
import subprocess

def npm_init():

    current_directory = os.getcwd()
    folders = [f.path for f in os.scandir(current_directory) if f.is_dir()]

    for folder in folders:
        print(f"Initializing npm in {folder}")
        try:
            subprocess.run(['npm', 'init', '-y'], cwd=folder, check=True)
            print(f"Successfully initialized npm in {folder}")
        except subprocess.CalledProcessError as e:
            print(f"Error initializing npm in {folder}: {e}")

npm_init()