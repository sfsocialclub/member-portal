from datetime import datetime

def add_timestamps(doc: dict, is_update: bool = False) -> dict:
    """Add or update created_at and updated_at timestamps in a document."""
    now = datetime.now(datetime.timezone.utc)

    if not is_update:
        doc['created_at'] = now
    doc['updated_at'] = now

    return doc