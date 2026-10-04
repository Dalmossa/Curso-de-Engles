"""
Content Service - Loads content from repository into database.
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from its_platform.content.loader import ContentLoader
from its_platform.db.models import ContentLesson, ContentPack
from its_platform.config import get_settings

settings = get_settings()


class ContentService:
    """Service for managing content in the database."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.loader = ContentLoader()

    async def sync_lessons(self) -> Dict[str, int]:
        """Sync lessons from content repository to database."""
        lessons = self.loader.load_all_lessons()
        stats = {"created": 0, "updated": 0, "unchanged": 0, "errors": 0}

        for lesson_meta in lessons:
            try:
                # Check if lesson exists
                stmt = select(ContentLesson).where(ContentLesson.id == lesson_meta.lesson_id)
                result = await self.session.execute(stmt)
                existing = result.scalar_one_or_none()

                if existing:
                    # Check if content changed
                    if existing.content_hash != lesson_meta.content_hash:
                        existing.module_id = lesson_meta.module_id
                        existing.cefr_level = lesson_meta.cefr_level
                        existing.title = lesson_meta.title
                        existing.description = lesson_meta.description
                        existing.skill_domains = lesson_meta.skill_domains
                        existing.prerequisites = lesson_meta.prerequisites
                        existing.estimated_duration_min = lesson_meta.estimated_duration_min
                        existing.reuse_basis = lesson_meta.reuse_basis
                        existing.source_references = lesson_meta.source_references
                        existing.content_hash = lesson_meta.content_hash
                        existing.is_active = True
                        stats["updated"] += 1
                    else:
                        stats["unchanged"] += 1
                else:
                    # Create new
                    lesson = ContentLesson(
                        id=lesson_meta.lesson_id,
                        module_id=lesson_meta.module_id,
                        cefr_level=lesson_meta.cefr_level,
                        title=lesson_meta.title,
                        description=lesson_meta.description,
                        skill_domains=lesson_meta.skill_domains,
                        prerequisites=lesson_meta.prerequisites,
                        estimated_duration_min=lesson_meta.estimated_duration_min,
                        reuse_basis=lesson_meta.reuse_basis,
                        source_references=lesson_meta.source_references,
                        content_hash=lesson_meta.content_hash,
                    )
                    self.session.add(lesson)
                    stats["created"] += 1

            except Exception as e:
                print(f"Error syncing lesson {lesson_meta.lesson_id}: {e}")
                stats["errors"] += 1

        await self.session.commit()
        return stats

    async def sync_packs(self) -> Dict[str, int]:
        """Sync packs from content repository to database."""
        packs = self.loader.load_all_packs()
        stats = {"created": 0, "updated": 0, "unchanged": 0, "errors": 0}

        for pack_meta in packs:
            try:
                stmt = select(ContentPack).where(ContentPack.id == pack_meta.pack_id)
                result = await self.session.execute(stmt)
                existing = result.scalar_one_or_none()

                if existing:
                    if existing.content_hash != pack_meta.content_hash:
                        existing.lesson_id = pack_meta.lesson_id
                        existing.version = pack_meta.version
                        existing.schema_version = pack_meta.schema_version
                        existing.item_count = pack_meta.item_count
                        existing.skill_domains = pack_meta.skill_domains
                        existing.reuse_basis = pack_meta.reuse_basis
                        existing.content_hash = pack_meta.content_hash
                        existing.is_active = True
                        stats["updated"] += 1
                    else:
                        stats["unchanged"] += 1
                else:
                    pack = ContentPack(
                        id=pack_meta.pack_id,
                        lesson_id=pack_meta.lesson_id,
                        version=pack_meta.version,
                        schema_version=pack_meta.schema_version,
                        item_count=pack_meta.item_count,
                        skill_domains=pack_meta.skill_domains,
                        reuse_basis=pack_meta.reuse_basis,
                        content_hash=pack_meta.content_hash,
                    )
                    self.session.add(pack)
                    stats["created"] += 1

            except Exception as e:
                print(f"Error syncing pack {pack_meta.pack_id}: {e}")
                stats["errors"] += 1

        await self.session.commit()
        return stats

    async def sync_all(self) -> Dict[str, Dict[str, int]]:
        """Sync all content (lessons and packs)."""
        lesson_stats = await self.sync_lessons()
        pack_stats = await self.sync_packs()
        return {"lessons": lesson_stats, "packs": pack_stats}

    async def get_lesson(self, lesson_id: str) -> Optional[ContentLesson]:
        """Get lesson by ID."""
        stmt = select(ContentLesson).where(ContentLesson.id == lesson_id, ContentLesson.is_active == True)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_pack(self, pack_id: str) -> Optional[ContentPack]:
        """Get pack by ID."""
        stmt = select(ContentPack).where(ContentPack.id == pack_id, ContentPack.is_active == True)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_packs_for_lesson(self, lesson_id: str) -> List[ContentPack]:
        """Get all active packs for a lesson."""
        stmt = select(ContentPack).where(
            ContentPack.lesson_id == lesson_id, ContentPack.is_active == True
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_lessons_by_module(self, module_id: str) -> List[ContentLesson]:
        """Get all active lessons in a module."""
        stmt = select(ContentLesson).where(
            ContentLesson.module_id == module_id, ContentLesson.is_active == True
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_lessons_by_cefr(self, cefr_level: str) -> List[ContentLesson]:
        """Get all active lessons for a CEFR level."""
        stmt = select(ContentLesson).where(
            ContentLesson.cefr_level == cefr_level, ContentLesson.is_active == True
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())