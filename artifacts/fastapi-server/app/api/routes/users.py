from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_
from typing import List

from app.db.database import get_db
from app.models import User
from app.schemas import UserResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.get("", response_model=List[UserResponse])
async def search_users(
    query: str = Query("", min_length=0),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(User)
    if query:
        search = f"%{query}%"
        stmt = stmt.where(or_(
            User.name.ilike(search),
            User.email.ilike(search)
        ))
    stmt = stmt.limit(50)
    result = await db.execute(stmt)
    return result.scalars().all()

from app.models import WorkspaceMember, Workspace
from sqlalchemy.orm import selectinload
from app.schemas import TeamMemberResponse

@router.get("/team", response_model=List[TeamMemberResponse])
async def get_team_members(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Find all workspace IDs the current user belongs to
    user_workspaces_stmt = select(WorkspaceMember.workspace_id).where(WorkspaceMember.user_id == current_user.id)
    
    # Query all workspace members for those workspaces
    stmt = (
        select(WorkspaceMember)
        .options(selectinload(WorkspaceMember.user), selectinload(WorkspaceMember.workspace))
        .where(WorkspaceMember.workspace_id.in_(user_workspaces_stmt))
        .order_by(WorkspaceMember.joined_at.desc())
    )
    result = await db.execute(stmt)
    members = result.scalars().all()
    
    # Map to schema
    return [
        {
            "user": m.user,
            "workspace": {"id": m.workspace.id, "name": m.workspace.name},
            "role": m.role,
            "joined_at": m.joined_at
        }
        for m in members
    ]
