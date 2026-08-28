import sqlite3
import json
import os
import sys

def export_sqlite_to_json(db_path, output_json_path):
    if not os.path.exists(db_path):
        print(f"Error: Database file not found: {db_path}", file=sys.stderr)
        sys.exit(1)
    
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    tables = [row[0] for row in cursor.fetchall()]
    print(f"Found {len(tables)} tables in SQLite: {tables}")
    
    data = {}
    for table in tables:
        cursor.execute(f'SELECT * FROM "{table}"')
        rows = cursor.fetchall()
        row_dicts = []
        for r in rows:
            row_dicts.append(dict(r))
        data[table] = row_dicts
        print(f"Extracted {len(row_dicts)} rows from {table}")
        
    conn.close()
    
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\nSuccessfully exported SQLite database to {output_json_path}")

if __name__ == '__main__':
    db_file = os.path.join(os.path.dirname(__file__), '..', 'gitguide.db')
    out_file = os.path.join(os.path.dirname(__file__), 'sqlite_dump.json')
    export_sqlite_to_json(db_file, out_file)
