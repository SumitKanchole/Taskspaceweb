from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from sqlalchemy.orm import selectinload

from app.db.database import get_db
from app.models import Task, User, Workspace, WorkspaceMember
from app.schemas import TaskResponseItem
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/my", response_model=List[TaskResponseItem])
async def get_my_tasks(
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Get tasks created by the user in workspaces that the user owns.
    """
    stmt = (
        select(Task)
        .options(selectinload(Task.assignee), selectinload(Task.created_by))
        .join(Workspace, Workspace.id == Task.workspace_id)
        .where(
            Task.created_by_id == current_user.id,
            Workspace.owner_id == current_user.id
        )
        .order_by(Task.created_at.desc())
    )
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/all", response_model=List[TaskResponseItem])
async def get_all_tasks(
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Get all tasks from all workspaces the user is a member of.
    """
    stmt = (
        select(Task)
        .options(selectinload(Task.assignee), selectinload(Task.created_by))
        .join(WorkspaceMember, WorkspaceMember.workspace_id == Task.workspace_id)
        .where(WorkspaceMember.user_id == current_user.id)
        .order_by(Task.created_at.desc())
    )
    result = await db.execute(stmt)
    return result.scalars().all()
