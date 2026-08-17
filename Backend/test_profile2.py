import asyncio
from src.database import async_session
from src.auth.repository import upsert_user
from src.user_management.repository import get_or_create_profile, update_user_profile

async def main():
    async with async_session() as session:
        try:
            user = await upsert_user(session, "test_clerk", "test@example.com", "Test", "TestFirst", "TestLast")
            print("User ID:", user.id)
            
            profile = await get_or_create_profile(session, user.id)
            print("Profile created/fetched:", profile)
            
            profile = await update_user_profile(session, user.id, watchlist=["TEST1", "TEST2"])
            print("Profile updated:", profile)
        except Exception as e:
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
