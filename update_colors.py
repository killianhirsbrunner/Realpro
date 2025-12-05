#!/usr/bin/env python3
"""
Script pour remplacer toutes les anciennes couleurs bleues par les nouvelles couleurs turquoise
dans tout le projet RealPro SA
"""

import os
import re
from pathlib import Path

# Définir les remplacements de couleurs
COLOR_REPLACEMENTS = {
    # Hex colors - Bleu vers Turquoise
    '#3b82f6': '#0891b2',  # blue-500 → turquoise-600
    '#2563eb': '#0891b2',  # blue-600 → turquoise-600
    '#1e40af': '#0e7490',  # blue-800 → turquoise-700
    '#1d4ed8': '#0e7490',  # blue-700 → turquoise-700
    '#60a5fa': '#06b6d4',  # blue-400 → turquoise-500
    '#93c5fd': '#22d3ee',  # blue-300 → turquoise-400
    '#dbeafe': '#cffafe',  # blue-100 → turquoise-100
    '#eff6ff': '#ecfeff',  # blue-50 → turquoise-50

    # Tailwind classes - bg (backgrounds)
    'bg-blue-50': 'bg-brand-50',
    'bg-blue-100': 'bg-brand-100',
    'bg-blue-200': 'bg-brand-200',
    'bg-blue-300': 'bg-brand-300',
    'bg-blue-400': 'bg-brand-400',
    'bg-blue-500': 'bg-brand-500',
    'bg-blue-600': 'bg-brand-600',
    'bg-blue-700': 'bg-brand-700',
    'bg-blue-800': 'bg-brand-800',
    'bg-blue-900': 'bg-brand-900',

    # Tailwind classes - text
    'text-blue-50': 'text-brand-50',
    'text-blue-100': 'text-brand-100',
    'text-blue-200': 'text-brand-200',
    'text-blue-300': 'text-brand-300',
    'text-blue-400': 'text-brand-400',
    'text-blue-500': 'text-brand-500',
    'text-blue-600': 'text-brand-600',
    'text-blue-700': 'text-brand-700',
    'text-blue-800': 'text-brand-800',
    'text-blue-900': 'text-brand-900',

    # Tailwind classes - border
    'border-blue-50': 'border-brand-50',
    'border-blue-100': 'border-brand-100',
    'border-blue-200': 'border-brand-200',
    'border-blue-300': 'border-brand-300',
    'border-blue-400': 'border-brand-400',
    'border-blue-500': 'border-brand-500',
    'border-blue-600': 'border-brand-600',
    'border-blue-700': 'border-brand-700',
    'border-blue-800': 'border-brand-800',
    'border-blue-900': 'border-brand-900',

    # Tailwind classes - hover
    'hover:bg-blue-50': 'hover:bg-brand-50',
    'hover:bg-blue-100': 'hover:bg-brand-100',
    'hover:bg-blue-200': 'hover:bg-brand-200',
    'hover:bg-blue-500': 'hover:bg-brand-500',
    'hover:bg-blue-600': 'hover:bg-brand-600',
    'hover:bg-blue-700': 'hover:bg-brand-700',
    'hover:text-blue-600': 'hover:text-brand-600',
    'hover:text-blue-700': 'hover:text-brand-700',
    'hover:border-blue-600': 'hover:border-brand-600',

    # Tailwind classes - focus
    'focus:ring-blue-500': 'focus:ring-brand-500',
    'focus:border-blue-500': 'focus:border-brand-500',

    # Tailwind classes - from/to (gradients)
    'from-blue-500': 'from-brand-500',
    'from-blue-600': 'from-brand-600',
    'to-blue-600': 'to-brand-600',
    'to-blue-700': 'to-brand-700',

    # Ring colors
    'ring-blue-500': 'ring-brand-500',
    'ring-blue-600': 'ring-brand-600',
}

def should_skip_file(file_path):
    """Vérifier si le fichier doit être ignoré"""
    skip_patterns = [
        'node_modules',
        'dist',
        '.git',
        'update_colors.py',
        '__pycache__',
        '.pyc',
        'package-lock.json',
    ]

    path_str = str(file_path)
    return any(pattern in path_str for pattern in skip_patterns)

def replace_colors_in_file(file_path):
    """Remplacer les couleurs dans un fichier"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        changes_made = False

        # Appliquer tous les remplacements
        for old, new in COLOR_REPLACEMENTS.items():
            if old in content:
                content = content.replace(old, new)
                changes_made = True

        # Écrire le fichier seulement si des changements ont été faits
        if changes_made:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True

        return False

    except Exception as e:
        print(f"❌ Erreur lors du traitement de {file_path}: {e}")
        return False

def main():
    """Fonction principale"""
    project_root = Path('/tmp/cc-agent/61034988/project')

    # Extensions de fichiers à traiter
    extensions = ['.tsx', '.ts', '.jsx', '.js', '.css', '.html', '.md']

    print("🎨 Remplacement des couleurs bleues par turquoise...")
    print("=" * 60)

    files_processed = 0
    files_modified = 0

    # Parcourir tous les fichiers du projet
    for ext in extensions:
        for file_path in project_root.rglob(f'*{ext}'):
            if should_skip_file(file_path):
                continue

            files_processed += 1

            if replace_colors_in_file(file_path):
                files_modified += 1
                print(f"✅ Modifié: {file_path.relative_to(project_root)}")

    print("=" * 60)
    print(f"✅ Terminé !")
    print(f"📊 Fichiers traités: {files_processed}")
    print(f"📝 Fichiers modifiés: {files_modified}")
    print("=" * 60)

if __name__ == '__main__':
    main()
