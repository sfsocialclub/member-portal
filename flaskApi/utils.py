from datetime import datetime, timezone

def add_timestamps(doc: dict, is_update: bool = False) -> dict:
    """Add or update created_at and updated_at timestamps in a document."""
    now = datetime.now(timezone.utc)

    if not is_update:
        doc['created_at'] = now
    doc['updated_at'] = now

    return doc