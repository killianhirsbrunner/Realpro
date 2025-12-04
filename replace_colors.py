#!/usr/bin/env python3
"""
Script to replace orange, purple, and violet Tailwind colors with blue equivalents.
- orange → secondary (cyan-blue)
- purple → brand (main blue)
- violet → brand (main blue)
"""

import re
import os
from pathlib import Path

def replace_colors_in_file(file_path):
    """Replace color classes in a single file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Replace orange patterns with secondary
        patterns_orange = [
            (r'bg-orange-(\d+)', r'bg-secondary-\1'),
            (r'text-orange-(\d+)', r'text-secondary-\1'),
            (r'border-orange-(\d+)', r'border-secondary-\1'),
            (r'from-orange-(\d+)', r'from-secondary-\1'),
            (r'to-orange-(\d+)', r'to-secondary-\1'),
            (r'via-orange-(\d+)', r'via-secondary-\1'),
            (r'ring-orange-(\d+)', r'ring-secondary-\1'),
        ]

        # Replace purple patterns with brand
        patterns_purple = [
            (r'bg-purple-(\d+)', r'bg-brand-\1'),
            (r'text-purple-(\d+)', r'text-brand-\1'),
            (r'border-purple-(\d+)', r'border-brand-\1'),
            (r'from-purple-(\d+)', r'from-brand-\1'),
            (r'to-purple-(\d+)', r'to-brand-\1'),
            (r'via-purple-(\d+)', r'via-brand-\1'),
            (r'ring-purple-(\d+)', r'ring-brand-\1'),
        ]

        # Replace violet patterns with brand
        patterns_violet = [
            (r'bg-violet-(\d+)', r'bg-brand-\1'),
            (r'text-violet-(\d+)', r'text-brand-\1'),
            (r'border-violet-(\d+)', r'border-brand-\1'),
            (r'from-violet-(\d+)', r'from-brand-\1'),
            (r'to-violet-(\d+)', r'to-brand-\1'),
            (r'via-violet-(\d+)', r'via-brand-\1'),
            (r'ring-violet-(\d+)', r'ring-brand-\1'),
        ]

        # Apply all replacements
        for pattern, replacement in patterns_orange + patterns_purple + patterns_violet:
            content = re.sub(pattern, replacement, content)

        # Only write if content changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Main function to process all files."""
    src_dir = Path('src')

    if not src_dir.exists():
        print("Error: src/ directory not found")
        return

    # Find all TypeScript/TSX files
    files_to_process = list(src_dir.rglob('*.tsx')) + list(src_dir.rglob('*.ts'))

    modified_count = 0
    processed_count = 0

    print(f"Found {len(files_to_process)} files to process...")

    for file_path in files_to_process:
        if replace_colors_in_file(file_path):
            modified_count += 1
            print(f"✓ Modified: {file_path}")
        processed_count += 1

        if processed_count % 10 == 0:
            print(f"Progress: {processed_count}/{len(files_to_process)} files processed...")

    print(f"\n=== Summary ===")
    print(f"Total files processed: {processed_count}")
    print(f"Files modified: {modified_count}")
    print(f"Files unchanged: {processed_count - modified_count}")

if __name__ == '__main__':
    main()
